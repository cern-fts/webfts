var ftsEndpoint = "https://fts3-pilot.cern.ch:8446";
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
	outPut = $.ajax({
		url : urlE,
		type : "POST",
		contentType : "application/json",
		dataType : 'json',
		data : JSON.stringify(theData),
		async : false,
		beforeSend : function(xhr) {
			xhr.withCredentials = true;

		},

		success : function(x, status, xhr) {
			console.log("OK: " + JSON.stringify(x));
			// alert("OK: " + JSON.stringify(x));
			console.log("    Status: " + status);
		},

		error : function(xhr, textStatus, errorThrown) {
			console.log("fts connect failed");
			console.log(xhr);
			console.log("ERROR: " + JSON.stringify(xhr));
			// alert("ERROR: " +JSON.stringify(xhr));
			console.log(textStatus + "," + errorThrown);
		},

		xhrFields : {
			withCredentials : true
		},
		crossDomain : true,
	});
}

function signRequest(sCert, userPrivateKeyPEM, userPassword, userDN) {
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
			'str' : userDN + '/CN=proxy'
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

		console.log(cert.getPEMString());
		return cert.getPEMString();
	} catch (e) {
		console.log("ERROR signing the CSR response: " + e);
	}
}



// Get proxy certificate (if needed) and make the transfer between the endpoints
function ftsTransferRequest(endpoints, userPrivateKeyPEM, userPassword, userDN) {
	var urlEndp = ftsEndpoint + "/whoami";
	// Call 1: get user delegate_id
	$.ajax({
		url : urlEndp,
		type : "GET",
		dataType : 'json',

		success : function(data1, status) {
			delegationID = data1.delegation_id;
			urlEndp = ftsEndpoint + "/delegation/" + delegationID;
			// Call 2: get if there is a proxy certificate already.
			// Remaining time or null returned
			$.ajax({
				url : urlEndp,
				type : "GET",
				dataType : 'json',

				success : function(data2, status) {
					if ((data2 != null)
							&& ((Date
									.parse(data2.termination_time) - (new Date()
									.getTime())) >= 999999)) {
						// Call 3:There is already a valid proxy certificate. Do the transfer
						ftsTransfer(endpoints);
					} else {
						urlEndp = urlEndp + "/request";
						// Call 3: Asking for a new proxy certificate is needed
						$.ajax({
							url : urlEndp,
							type : "GET",

							success : function(data3,
									status) {
								var x509Proxy = signRequest(
										data3,
										userPrivateKeyPEM,
										userPassword,
										userDN);
								urlEndp = ftsEndpoint
										+ "/delegation/"
										+ delegationID
										+ '/credential';
								// Call 4: Delegating the signed new proxy certificate
								$.ajax({
									url : urlEndp,
									type : "PUT",
									data : x509Proxy,
									dataType : "text",
									async : false,
									beforeSend : function(
											xhr) {
										xhr.withCredentials = true;
									},

									success : function(
											data4,
											status) {
										// Call 5: Make the transfer
										ftsTransfer(endpoints);
									},
									error : function(
											jqXHR,
											textStatus,
											errorThrown) {
										showError(
												jqXHR,
												textStatus,
												errorThrown,
												"fts(4) delegation with proxy cert failed");
									},

									xhrFields : {
										withCredentials : true
									},
									crossDomain : true,
								});
							},

							error : function(jqXHR,
									textStatus,
									errorThrown) {
								showError(jqXHR,
										textStatus,
										errorThrown,
										"fts(3) delegation + id + request failed");
							},

							xhrFields : {
								withCredentials : true
							},
							crossDomain : true,
						});
					}
				},

				error : function(jqXHR, textStatus, errorThrown) {
					showError(jqXHR, textStatus, errorThrown,
							"fts(2) delegation + id failed");
				},

				xhrFields : {
					withCredentials : true
				},
				crossDomain : true,
			});
		},

		error : function(jqXHR, textStatus, errorThrown) {
			showError(jqXHR, textStatus, errorThrown,
					"fts(1) whoami failed");
		},

		xhrFields : {
			withCredentials : true
		},
		crossDomain : true,
	});
}


