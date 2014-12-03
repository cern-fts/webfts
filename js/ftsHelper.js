var supportText = "Please, try again and contact support if the error persists";

function getConfig(){
	$.get("../config.xml", function(data){
	    $(data).find('config').each(function() {
		sessionStorage.stsAddress=$(this).find('stsAddress').text();
		sessionStorage.ssoLogout=$(this).find('ssoLogout').text();
		sessionStorage.ssoLogin=$(this).find('ssoLogin').text();
		sessionStorage.ftsRestEndpoint=$(this).find('ftsAddress').text();
		sessionStorage.jobsToList=$(this).find('jobToList').text();
		sessionStorage.endpointsUrl=$(this).find('endpointListUrl').text();
		sessionStorage.proxyCertHours=$(this).find('proxyCertHours').text();
		sessionStorage.cernboxBaseUrl=$(this).find('cernboxBaseUrl').text();
		});
	});
}

function showError(jqXHR, textStatus, errorThrown, message) {
	console.log(message);
	console.log(jqXHR);
	console.log("ERROR: " + JSON.stringify(jqXHR));
	//alert("ERROR: " + JSON.stringify(jqXHR));
	console.log(textStatus + "," + errorThrown);
	if (jqXHR.status > 0)
		message += ". Reason: " + jqXHR.status + ": " + jqXHR.responseText;
		
	if (message != null)
		showUserError(message);	
	return message;
}

function getUserJobs(delegationId){
	var urlE = sessionStorage.ftsRestEndpoint + "/jobs?dlg_id=" + delegationId + "&state_in=SUBMITTED,ACTIVE,FINISHED,FAILED,CANCELED&limit="+ sessionStorage.jobsToList;
	var header = getAuthzHeader();
	$.support.cors = true;
	$.ajax({
		url : urlE,
		type : "GET",
		headers : header,
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

function getJobTranfers(jobId, isResubmit, overwrite, compare_checksum,resubmitAll){
	var urlE = sessionStorage.ftsRestEndpoint + "/jobs/" + jobId + "/files";
	var header = getAuthzHeader();
	$.support.cors = true;
	$.ajax({
		url : urlE,
		type : "GET",
		headers : header,
		dataType : 'json',
		xhrFields : {
			withCredentials : true
		},
		success : function(data1, status) {
			if (isResubmit){
				rerunTransfer(data1, overwrite,compare_checksum,resubmitAll);
			} else {
				loadTransferTable(data1, jobId);
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
			showError(jqXHR, textStatus, errorThrown, "Error job details. "+ supportText);
		}
	});
	
}

function removeTransfer(jobID){
	var urlEndp = sessionStorage.ftsRestEndpoint + "/jobs/" + jobID;
	var header = getAuthzHeader();
	$.support.cors = true;
	$.ajax({
		url : urlEndp,
		//type : "DELETE" <-- use directly this is not working
		data: {"_method":"delete"},
		headers : header,
		dataType:'script', 
		type : "POST",
		xhrFields : {
			withCredentials : true
		},
		success : function(data1, status) {						
			showUserSuccess("Transfer removed successfully");	
		},
		error : function(jqXHR, textStatus, errorThrown) {
			showError(jqXHR, textStatus, errorThrown, "Error removing the transfer. "+ supportText);
		}
	});
}

function getUTCDate(time) {
	return time.getUTCFullYear().toString().substring(2, 4)
			+ ("0" + (time.getUTCMonth() + 1).toString()).slice(-2)
			+ ("0" + time.getUTCDate().toString()).slice(-2)
			+ ("0" + time.getUTCHours().toString()).slice(-2)
			+ ("0" + time.getUTCMinutes().toString()).slice(-2)
			+ ("0" + time.getUTCSeconds().toString()).slice(-2)
			+ "Z";
}

// Call to make the transfer between two endpoints
function ftsTransfer(theData) {
	var urlE = sessionStorage.ftsRestEndpoint + "/jobs";
	theData = JSON.stringify(theData);
	var header = getAuthzHeader();
	$.support.cors = true;
	outPut = $.ajax({
		url : urlE,
		type : "POST",
		headers : header,
		data : theData,
		contentType : "application/json", 
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

function signRequest(sCert, userPrivateKeyPEM, userDN, userCERT) {
	var Re = new RegExp(",","g");
	userDN = userDN.replace(Re,"/");
	var subject = userDN + '/CN=proxy';
	
	var reHex = /^\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\s*)+$/;
	try {
		var derServer = reHex.test(sCert) ? Hex.decode(sCert) : Base64E.unarmor(sCert);

		var derUser = reHex.test(userCERT) ? Hex.decode(userCERT) : Base64E.unarmor(userCERT);

		var asn1 = ASN11.decode(derServer);
		var pos = asn1.getCSRPubKey();
		//console.log(sCert);
		
		var ct = new X509();
		ct.readCertPEM(userCERT);
		var oIssuer = ct.getIssuerHex();
		var oSerial = ct.getSerialNumberHex();
		//console.log(oIssuer);
		
		var rsakey = new RSAKey();
		//The replace is because other wise something like this was 
		//found "01 00 01" and only the last part, "01", was converted. 
		//It was returning 1 instead of 65537
		rsakey.setPublic(pos.modulus.replace(/ /g, ''), pos.exponent.replace(/ /g, ''));

		// TODO: verify sign
		var tbsc = new KJUR.asn1.x509.TBSCertificate();

		// Time
		tbsc.setSerialNumberByParam({
			'int' : oSerial
		});
		tbsc.setSignatureAlgByParam({
			'name' : 'SHA1withRSA'
		});
		tbsc.setIssuerByParam({
			'str' : userDN
		});
		
		tbsc.asn1Issuer.hTLV = ct.getSubjectHex();
		
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
		ctime.setUTCHours(ctime.getUTCHours() + 1 + parseInt(sessionStorage.proxyCertHours));
		tbsc.setNotAfterByParam({
			'str' : getUTCDate(ctime)
		});
		
		tbsc.appendExtension(new KJUR.asn1.x509.BasicConstraints({'cA': false, 'critical': true}));
		// 101 to set 'Digital Signature, Key Encipherment'. 0 means disabled 'Non Repudiation'
		tbsc.appendExtension(new KJUR.asn1.x509.KeyUsage({'bin':'101', 'critical':true}));

		var s = KEYUTIL.getPEM(rsakey);
	    	var sHashHex = getSubjectKeyIdentifier(derUser);
	    	var paramAKI = {'kid': {'hex': sHashHex }, 'issuer': oIssuer, 'critical': false};
		tbsc.appendExtension(new KJUR.asn1.x509.AuthorityKeyIdentifier(paramAKI));
		
		// Sign and get PEM certificate with CA private key
		var userPrivateKey = new RSAKey();

		// The private RSA key can be obtained from the p12 certificate by using:
		// openssl pkcs12 -in yourCert.p12 -nocerts -nodes | openssl rsa 
		userPrivateKey.readPrivateKeyFromPEMString(userPrivateKeyPEM);
		
		var cert = new KJUR.asn1.x509.Certificate({
			'tbscertobj' : tbsc,
			'rsaprvkey' : userPrivateKey,
			'prvkey' : userPrivateKey,			
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

function getSubjectKeyIdentifier(der) {
	var asn1 = ASN11.decode(der);
	var dom = asn1.toDOM();
	return getSKID(dom, "2.5.29.14");
};

function getSKID(dom, skid){	
	if (dom.textContent.indexOf(skid) > -1){ 
		var n = dom.textContent.indexOf(skid);
		var n2 = dom.textContent.indexOf(skid, n+1);
		//Output should be like:
		//2.5.29.35authorityKeyIdentifierX.509 extensionOCTET STRING(1 elem)Offset: 654Length: 2+24(encapsulates)Value:(1 elem)SEQUENCE(1 elem)Offset: 656Length: 2+22(constructed)Value:(1 elem)[0](20 byte) 98CC92D04630368CB0ED980D7251A9474CAABE21
		var ext = dom.textContent.substring(n2, n2 + 300);
		var n3 = ext.indexOf("20 byte");
		return ext.substring(n3 + 9, n3 + 49);		
	}
	if (dom.childNodes.length > 0){
		for (var i=0; i<dom.childNodes.length; i++){				
			getAKI(dom.childNodes[i]);
		}	
	} 
}

//Check delegation ID, save it and check if there is a valid proxy
function getDelegationIDSTS(fieldName, delegationNeeded, cert, key){
	var urlEndp = sessionStorage.ftsRestEndpoint + "/whoami";
	var header = ssoAuthString(cert, key);
	$.support.cors = true;
	$.ajax({
		url : urlEndp,
		type : "GET",
		dataType : 'json',
		headers : { Authorization: header},
		xhrFields : {
			withCredentials : true
		},
		success : function(data1, status) {
			console.log("Delegation obtained");
			$('input[id='+fieldName+']').val(data1.delegation_id);
			$("#userDN").val(data1.user_dn);
			if (!delegationNeeded){
				hideUserReport();
				getUserJobs(data1.delegation_id);
			}
			isDelegated(data1.delegation_id, delegationNeeded);
		},
		error : function(jqXHR, textStatus, errorThrown) {
			showError(jqXHR, textStatus, errorThrown, "Error connecting to the FTS server to obtain the user credentials. Check if you have installed a valid copy of the CERN ROOT CA certificate."+ supportText);
		}
	});
}

//Check delegation ID, save it and check if there is a valid proxy 
function getDelegationID(fieldName, delegationNeeded){
	var urlEndp = sessionStorage.ftsRestEndpoint + "/whoami";
	$.support.cors = true;
	$.ajax({
		url : urlEndp,
		type : "GET",
		dataType : 'json',
		xhrFields : {
			withCredentials : true
		},
		success : function(data1, status) {
			console.log("Delegation obtained");
			$('input[id='+fieldName+']').val(data1.delegation_id);
			if (!delegationNeeded){
				hideUserReport();
				getUserJobs(data1.delegation_id);
			}
			isDelegated(data1.delegation_id, delegationNeeded);
		},
		error : function(jqXHR, textStatus, errorThrown) {
			showError(jqXHR, textStatus, errorThrown, "Error connecting to the FTS server to obtain the user credentials. Check if you have installed a valid copy of the CERN ROOT CA certificate."+ supportText);
		}
	});
}

function isDelegated(delegationID, showModal){
	return checkAndTransfer(delegationID, null, showModal);
}

function runDataTransfer(delegationID, transferData){
	return checkAndTransfer(delegationID, transferData, true);
}

function getAuthzHeader(){
	var authzheader;
	if (sessionStorage.userCert && sessionStorage.userCert != "")
        {
                authzheader = ssoAuthString(sessionStorage.userCert,sessionStorage.userKey);
	}
        header = authzheader ? { Authorization : authzheader } : "";
	return header;
}

function removeDelegation(delegationID, showRemoveDelegationMessage){
	var urlEndp = sessionStorage.ftsRestEndpoint + "/delegation/" + delegationID;
	var header = getAuthzHeader();
	$.support.cors = true;
	$.ajax({
		url : urlEndp,
		//type : "DELETE" <-- use directly this is not working
		data: {"_method":"delete"},
		dataType:'script', 
		headers : header,
		type : "POST",
		xhrFields : {
			withCredentials : true
		},
		success : function(data1, status) {
			if (showRemoveDelegationMessage)
				console.log("delegation removed correctly");
			showDelegateModal();
			showNoProxyMessages();
		},
		error : function(jqXHR, textStatus, errorThrown) {
			showError(jqXHR, textStatus, errorThrown, "Error removing the existing delegation. "+ supportText);
		}
	});
}

//Check if there is a valid delegation done. Otherwise, do it 
function checkAndTransfer(delegationID, transferData, showModal){
	var urlEndp = sessionStorage.ftsRestEndpoint + "/delegation/" + delegationID;
	var header = getAuthzHeader();
	$.support.cors = true;
	$.ajax({
		url : urlEndp,
		type : "GET",
		dataType : 'json',
		headers : header,
		xhrFields : {
			withCredentials : true
		},
		
		success : function(data2, status) {
			if (data2 == null){
				showNoProxyMessages();
				if (sessionStorage.userCert) {
					//dostsdelegation
					cert="-----BEGIN CERTIFICATE-----\r\n" + sessionStorage.userCert.match(/.{1,64}/g).join("\r\n") + "\r\n-----END CERTIFICATE-----\r\n";
                        		key = KEYUTIL.getPEM(KEYUTIL.getKeyFromPlainPrivatePKCS8Hex(b64tohex(sessionStorage.userKey)), "PKCS1PRV");
					doDelegate(delegationID, key, $("#userDN").val(), cert, "");
				}
				else if (showModal){
					showDelegateModal();
				}
			} else {
				var noOffset = function(s) {
					  var day= s.slice(0,-5).split(/\D/).map(function(itm){
					    return parseInt(itm, 10) || 0;
					  });
					  day[1]-= 1;
					  day= new Date(Date.UTC.apply(Date, day));
					  var offsetString = s.slice(-5);
					  var offset = parseInt(offsetString,10)/100;
					  if (offsetString.slice(0,1)=="+") offset*=-1;
					  day.setHours(day.getHours()+offset);
					  return day.getTime();
					};
					
				// The termination time is calculated using noOffset to avoid a problem in Firefox 
				// in operations with dates.
				// More info:
				//	http://stackoverflow.com/questions/5802461/javascript-which-browsers-support-parsing-of-iso-8601-date-string-with-date-par
				remainingTime = noOffset(data2.termination_time) - (new Date().getTime());
				if (remainingTime < 3600000) { //3600000 = milliseconds in an hour
					showNoProxyMessages();
					if (showModal){
						showDelegateModal();
					}
				} else {
					var vo = data2.voms_attrs[0];
					showRemainingProxyTime(millisecondsToStr(remainingTime),vo);
					sessionStorage.remainingProxyLifetime=remainingTime;
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
function doDelegate(delegationID, userPrivateKeyPEM, userDN, userCERT, user_vo){
	var urlEndp = sessionStorage.ftsRestEndpoint + "/delegation/" + delegationID + "/request";
	var header = getAuthzHeader();
	$.support.cors = true;
	// Call 3: Asking for a new proxy certificate is needed
	$.ajax({
		url : urlEndp,
		type : "GET",
		headers : header,
		xhrFields : {
			withCredentials : true
		},
		
		success : function(data3, status) {
			var x509Proxy = signRequest(data3, userPrivateKeyPEM, userDN, userCERT);
			x509Proxy += "" + userCERT;
			urlEndp = sessionStorage.ftsRestEndpoint + "/delegation/" + delegationID + '/credential';
			// Call 4: Delegating the signed new proxy certificate
			$.ajax({
				url : urlEndp,
				type : "POST",
				headers : header,
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
					if (user_vo == null || user_vo == ""){
						hideDelegateModal();
						isDelegated(delegationID, true); //To update remaining proxy time
					} else {
						getVOMSCredentials(delegationID, user_vo);
					}	
				},
				error : function(jqXHR, textStatus, errorThrown) {
					var derror = "Error delegating the user credentials. " + supportText;
					var emessage = showError(jqXHR, textStatus, errorThrown, derror);
					showDelegateError(emessage);
				}
			});
		},
		error : function(jqXHR, textStatus, errorThrown) {
			showError(jqXHR, textStatus, errorThrown, "Error connecting to the server for delegating the user credentials. " + supportText);
		}
	});
}

function getVOMSCredentials(delegationID, user_vo){
	var urlEndp = sessionStorage.ftsRestEndpoint + "/delegation/" + delegationID + "/voms";
	$.support.cors = true;
	var uvo = '["' + user_vo + '"]';
	var header = getAuthzHeader();
	$.ajax({
		url : urlEndp,									
		type : "POST",
		headers : header,
		contentType : "text/plain; charset=UTF-8", 
		dataType : 'text',
		data: uvo,
		processData : false,
		beforeSend : function(xhr) {
			xhr.withCredentials = true;
		},
		xhrFields : {
			withCredentials : true
		},
				
		success : function(data4, status) {
			hideDelegateModal();
			isDelegated(delegationID, true); //To update remaining proxy time
		},
		error : function(jqXHR, textStatus, errorThrown) {
			removeDelegation(delegationID, false);
			var verror = "Error obtaining VOMS credentials. " + supportText;
			var emessage = showError(jqXHR, textStatus, errorThrown, verror);
			showDelegateError(emessage);
		}
	});
}

function getEndpointContent(endpointInput, container, containerTable, indicator, stateText, filter){
        urlEndp = sessionStorage.ftsRestEndpoint + "/dm/list?surl=" + ($('#' + endpointInput).val()).trim();
	var header = getAuthzHeader();
	$.support.cors = true;
	$.ajax({
		url : urlEndp,
		type : "GET",
		headers : header,
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

