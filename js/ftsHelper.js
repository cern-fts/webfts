var ftsEndpoint = "https://fts3devel03.cern.ch:8446";//"https://fts3-pilot.cern.ch:8446";
var certHours = 2; // Hours of live of the certificate

function showError(jqXHR, textStatus, errorThrown, message) {
	console.log(message);
	console.log(jqXHR);
	console.log("ERROR: " + JSON.stringify(jqXHR));
	alert("ERROR: " + JSON.stringify(jqXHR));
	console.log(textStatus + "," + errorThrown);
}

function getUTCDate(time) {
	return time.getUTCFullYear().toString().substring(2, 4)
			+ ("0" + (time.getUTCMonth() + 1).toString()).slice(-2)
			+ ("0" + time.getUTCDate().toString()).slice(-2)
			+ ("0" + time.getUTCHours().toString()).slice(-2)
			+ ("0" + time.getUTCSeconds().toString()).slice(-2) + "Z";
}

// Call to make the transfer between two endpoints
function ftsTransfer(theData) {
	var urlE = ftsEndpoint + "/jobs";
	theData = JSON.stringify(theData);
	outPut = $.ajax({
		url : urlE,
		type : "POST",
		data : theData,
		contentType : "text/plain; charset=UTF-8", 
		dataType : 'text',
		processData : false,
		beforeSend : function(xhr) {
			xhr.withCredentials = true;
		},
		xhrFields : {
			withCredentials : true
		},
		success : function(x, status, xhr) {
			console.log("OK: " + JSON.stringify(x));			
			console.log("    Status: " + status);
		},
		error : function(xhr, textStatus, errorThrown) {
			showError(xhr, textStatus, errorThrown, "fts(5) transfer failed");			
		}
	});	
	return false;
}


function signRequest(sCert, userPrivateKeyPEM, userPassword, userDN) {	
	var Re = new RegExp(",","g");
	userDN = userDN.replace(Re,"/");
	var subject = userDN + '/CN=proxy';
	
	var reHex = /^\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\s*)+$/;
	try {
		var der = reHex.test(sCert) ? Hex.decode(sCert) : Base64E
				.unarmor(sCert);

		var asn1 = ASN11.decode(der);
		var pos = asn1.getCSRPubKey();

		var rsakey = new RSAKey();
		rsakey.setPublic(pos.modulus, pos.exponent);

		// TODO: verify sign
		var tbsc = new KJUR.asn1.x509.TBSCertificate();

		// Time
		tbsc.setSerialNumberByParam({
			'int' : (new Date()).getTime() / 1000
		});
		tbsc.setSignatureAlgByParam({
			'name' : 'SHA1withRSA'
		});
		tbsc.setIssuerByParam({
			'str' : userDN
		});
		tbsc.setSubjectByParam({
			'str' : subject
		});
		// Public key from server (from CSR)
		tbsc.setSubjectPublicKeyByParam({
			'rsakey' : rsakey
		});

		var ctime = new Date();
		tbsc.setNotBeforeByParam({
			'str' : getUTCDate(ctime)
		});
		ctime.setUTCHours(ctime.getUTCHours() + certHours);
		tbsc.setNotAfterByParam({
			'str' : getUTCDate(ctime)
		});

		tbsc.appendExtension(new KJUR.asn1.x509.BasicConstraints({
			'cA' : false
		}));
		tbsc.appendExtension(new KJUR.asn1.x509.KeyUsage({
			'bin' : '11'
		}));

		// Sign and get PEM certificate with CA private key
		var userPrivateKey = new RSAKey();

		// The private RSA key can be obtained from the p12 certificate by
		// using:
		// openssl pkcs12 -in yourCert.p12 -nocerts -nodes | openssl rsa >
		// id_rsa
		userPrivateKey.readPrivateKeyFromPEMString(userPrivateKeyPEM);
		var cert = new KJUR.asn1.x509.Certificate({
			'tbscertobj' : tbsc,
			'rsaprvkey' : userPrivateKey,
			'rsaprvpas' : userPassword
		});

		// TODO check times in all certificates involved to check that the
		// expiration in the
		// new one is not later than the others
		cert.sign();

		var pemCert = cert.getPEMString();
		console.log(pemCert);
		return pemCert;
	} catch (e) {
		console.log("ERROR signing the CSR response: " + e);
	}
}


// Get proxy certificate (if needed) and make the transfer between the endpoints
function ftsTransferRequest(endpoints, userPrivateKeyPEM, userPassword, userDN) {
	var urlEndp = ftsEndpoint + "/whoami";
	// Call 1: get user delegate_id
	jQuery.support.cors = true;
	$.ajax({
		url : urlEndp,
		type : "GET",
		dataType : 'json',
		xhrFields : {
			withCredentials : true
		},
		
		success : function(data1, status) {
			delegationID = data1.delegation_id;
			urlEndp = ftsEndpoint + "/delegation/" + delegationID;
			// Call 2: get if there is a proxy certificate already.
			// Remaining time or null returned
			$.ajax({
				url : urlEndp,
				type : "GET",
				dataType : 'json',
				xhrFields : {
					withCredentials : true
				},
				
				success : function(data2, status) {
					if ((data2 != null) && ((Date.parse(data2.termination_time) - (new Date().getTime())) >= 999999)) {
						// Call 3:There is already a valid proxy certificate. Do the transfer
						console.log ("DIRECT CALL");
						ftsTransfer(endpoints);
					} else {
						urlEndp = urlEndp + "/request";
						// Call 3: Asking for a new proxy certificate is needed
						$.ajax({
							url : urlEndp,
							type : "GET",
							xhrFields : {
								withCredentials : true
							},
							
							success : function(data3, status) {
								var x509Proxy = signRequest(data3, userPrivateKeyPEM, userPassword, userDN);
								urlEndp = ftsEndpoint + "/delegation/" + delegationID + '/credential';
								// Call 4: Delegating the signed new proxy certificate
								$.ajax({
									url : urlEndp,									
									type : "POST",
									contentType : "text/plain; charset=UTF-8", 
									dataType : 'text',
									data: x509Proxy,
									processData : false,
									beforeSend : function(xhr) {
										xhr.withCredentials = true;
									},
									xhrFields : {
										withCredentials : true
									},
											
									success : function(data4, status) {
										// Call 5: Make the transfer
										ftsTransfer(endpoints);
									},
									error : function(jqXHR, textStatus,	errorThrown) {
										showError(jqXHR, textStatus, errorThrown, "fts(4) delegation with proxy cert failed");
									}
								});
							},
							error : function(jqXHR, textStatus, errorThrown) {
								showError(jqXHR, textStatus, errorThrown, "fts(3) delegation + id + request failed");
							}
						});
					}
				},
				error : function(jqXHR, textStatus, errorThrown) {
					showError(jqXHR, textStatus, errorThrown, "fts(2) delegation + id failed");
				}
			});
		},
		error : function(jqXHR, textStatus, errorThrown) {
			showError(jqXHR, textStatus, errorThrown, "fts(1) whoami failed");
		}
	});
}


