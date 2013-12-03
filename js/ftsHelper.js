var ftsEndpoint = "https://fts3devel03.cern.ch:8446";//"https://fts3-pilot.cern.ch:8446";
var certHours = 4; // Hours of live of the certificate
var supportText = "Please, try again and contact support if the error continues";

function showError(jqXHR, textStatus, errorThrown, message) {
	console.log(message);
	console.log(jqXHR);
	console.log("ERROR: " + JSON.stringify(jqXHR));
	//alert("ERROR: " + JSON.stringify(jqXHR));
	console.log(textStatus + "," + errorThrown);
	if (message != null)
		showUserError(message);
}

function getUserJobs(delegationId){
	var urlE = ftsEndpoint + "/jobs?dlg_id=" + delegationId + "&state_in=SUBMITTED,ACTIVE,FINISHED,FAILED,CANCELED";
	$.ajax({
		url : urlE,
		type : "GET",
		dataType : 'json',
		xhrFields : {
			withCredentials : true
		},
		success : function(data1, status) {
			loadJobTable(data1);
		},
		error : function(jqXHR, textStatus, errorThrown) {
			showError(jqXHR, textStatus, errorThrown, "Error retrieving user jobs. "+ supportText);
		}
	});
	
}

function getJobTranfers(jobId){
	var urlE = ftsEndpoint + "/jobs/" + jobId;
	$.ajax({
		url : urlE,
		type : "GET",
		dataType : 'json',
		xhrFields : {
			withCredentials : true
		},
		success : function(data1, status) {
			loadTransferTable(data1, jobId);			
		},
		error : function(jqXHR, textStatus, errorThrown) {
			showError(jqXHR, textStatus, errorThrown, "Error job details. "+ supportText);
		}
	});
	
}

function getJobTransmissions(jobId){
	
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
		dataType : 'json',
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
			showUserSuccess("Transfer sent successfully");
		},
		error : function(xhr, textStatus, errorThrown) {
			showError(xhr, textStatus, errorThrown, "Error submitting the transfer. " + supportText);			
		}
	});	
	return false;
}


function signRequest(sCert, userPrivateKeyPEM, userDN) {	
	var Re = new RegExp(",","g");
	userDN = userDN.replace(Re,"/");
	var subject = userDN + '/CN=proxy';
	
	var reHex = /^\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\s*)+$/;
	try {
		var der = reHex.test(sCert) ? Hex.decode(sCert) : Base64E
				.unarmor(sCert);

		var asn1 = ASN11.decode(der);
		var pos = asn1.getCSRPubKey();

		console.log(sCert);
		
		var rsakey = new RSAKey();
		//The replace is because other wise something like this was 
		//found "01 00 01" and only the last part, "01", was converted. 
		//It was returning 1 instead of 65537
		rsakey.setPublic(pos.modulus.replace(/ /g, ''), pos.exponent.replace(/ /g, ''));

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
		ctime.setUTCHours(ctime.getUTCHours() - 1);
		tbsc.setNotBeforeByParam({
			'str' : getUTCDate(ctime)
		});
		ctime.setUTCHours(ctime.getUTCHours() + 1 + certHours);
		tbsc.setNotAfterByParam({
			'str' : getUTCDate(ctime)
		});

		// Sign and get PEM certificate with CA private key
		var userPrivateKey = new RSAKey();

		// The private RSA key can be obtained from the p12 certificate by using:
		// openssl pkcs12 -in yourCert.p12 -nocerts -nodes | openssl rsa 
		userPrivateKey.readPrivateKeyFromPEMString(userPrivateKeyPEM);
		
		var cert = new KJUR.asn1.x509.Certificate({
			'tbscertobj' : tbsc,
			'rsaprvkey' : userPrivateKey,
			'rsaprvpas' : "empty"
		});

		// TODO check times in all certificates involved to check that the
		// expiration in the
		// new one is not later than the others
		cert.sign();

		var pemCert = cert.getPEMString();
		//console.log(pemCert.replace(/^\s*$[\n\r]{1,}/gm, "\n"));
		
		//In case blank new lines...
		return pemCert.replace(/^\s*$[\n\r]{1,}/gm, "\n");
	} catch (e) {
		console.log("ERROR signing the CSR response: " + e);
	}
}
//Check delegation ID, save it and check if there is a valid proxy 
function getDelegationID(fieldName, delegationNeeded){
	var urlEndp = ftsEndpoint + "/whoami";
	$.ajax({
		url : urlEndp,
		type : "GET",
		dataType : 'json',
		xhrFields : {
			withCredentials : true
		},
		success : function(data1, status) {
			$('input[id='+fieldName+']').val(data1.delegation_id);	
			if (delegationNeeded){
				isDelegated(data1.delegation_id, null);
			} else {
				hideUserError();
				getUserJobs(data1.delegation_id);
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
			showError(jqXHR, textStatus, errorThrown, "Error connecting to the server to obtain the user credentials. "+ supportText);
		}
	});
}

function isDelegated(delegationID){
	return checkAndTransfer(delegationID, null);
}

function runDataTransfer(delegationID, transferData){
	return checkAndTransfer(delegationID, transferData);
}

//Check if there is a valid delegation done. Otherwise, do it 
function checkAndTransfer(delegationID, transferData){
	urlEndp = ftsEndpoint + "/delegation/" + delegationID;
	$.ajax({
		url : urlEndp,
		type : "GET",
		dataType : 'json',
		xhrFields : {
			withCredentials : true
		},
		
		success : function(data2, status) {
			if (data2 == null){
				showDelegateModal();
			} else {
				remainingTime = Date.parse(data2.termination_time) - (new Date().getTime());
				console.log(millisecondsToStr(remainingTime));			
				if (remainingTime < 3600000) { //3600000 = milliseconds in an hour
					showDelegateModal();
				} else {
					showRemainingProxyTime(millisecondsToStr(remainingTime));
					if (transferData != null){				
						ftsTransfer(transferData);
					}
				}						
			}	
		},
		error : function(jqXHR, textStatus, errorThrown) {
			showError(jqXHR, textStatus, errorThrown, "Error connecting to the server to check if there was an existing valid proxy. " + supportText);
		}
	});
}

//Do delegation of credentials
//function doDelegate(delegationID, userPrivateKeyPEM, userPassword, userDN, certChain0, certChain1){
function doDelegate(delegationID, userPrivateKeyPEM, userDN, userCERT){
	urlEndp = ftsEndpoint + "/delegation/" + delegationID + "/request";
	// Call 3: Asking for a new proxy certificate is needed
	$.ajax({
		url : urlEndp,
		type : "GET",
		xhrFields : {
			withCredentials : true
		},
		
		success : function(data3, status) {
			var x509Proxy = signRequest(data3, userPrivateKeyPEM, userDN); 
			x509Proxy += "" + userCERT;
			console.log(x509Proxy);
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
					hideDelegateModal();
					isDelegated(delegationID); //To update remaining proxy time
				},
				error : function(jqXHR, textStatus,	errorThrown) {					
					showError(jqXHR, textStatus, errorThrown, null);
					showDelegateError("Error delegating the user credentials. " + supportText);
				}
			});
		},
		error : function(jqXHR, textStatus, errorThrown) {
			showError(jqXHR, textStatus, errorThrown, "Error connecting to the server for delegating the user credentials. " + supportText);
		}
	});
}


function getEndpointContent(endpointInput, container, containerTable, indicator, stateText, filter){	
	urlEndp = ftsEndpoint + "/dm/list?surl=" + $('#' + endpointInput).val();
	$.ajax({
		url : urlEndp,
		type : "GET",
		dataType : 'json',
		xhrFields : {
			withCredentials : true
		},
		
		success : function(data2, status) {		
			loadFolder(endpointInput, container, containerTable, data2, indicator, stateText, filter);			
		},
		error : function(jqXHR, textStatus, errorThrown) {
			showError(jqXHR, textStatus, errorThrown, "Error connecting to the endpoint: it is not available, the folder does not exist or it has been selected a wrong protocol or address. "  + supportText);
			clearContentTable(containerTable, container, indicator, stateText);
		}
	});
} 

function millisecondsToStr (milliseconds) {
    // TIP: to find current time in milliseconds, use:
    // var  current_time_milliseconds = new Date().getTime();

    // This function does not deal with leap years, however,
    // it should not be an issue because the output is aproximated.

    function numberEnding (number) { //todo: replace with a wiser code
        return (number > 1) ? 's' : '';
    }

    var temp = milliseconds / 1000;
    var years = Math.floor(temp / 31536000);
    if (years) {
        return years + ' year' + numberEnding(years);
    }
    var days = Math.floor((temp %= 31536000) / 86400);
    if (days) {
        return days + ' day' + numberEnding(days);
    }
    var hours = Math.floor((temp %= 86400) / 3600);
    if (hours) {
        return hours + ' hour' + numberEnding(hours);
    }
    var minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) {
        return minutes + ' minute' + numberEnding(minutes);
    }
    var seconds = temp % 60;
    if (seconds) {
        return seconds + ' second' + numberEnding(seconds);
    }
    return 'less then a second'; //'just now' //or other string you like;
}
