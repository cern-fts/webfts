var supportText = "Please, try again and contact support if the error persists";

function getConfig(){
	$.get("../config.xml", function(data){
	    $(data).find('config').each(function() {
		sessionStorage.ftsRestEndpoint=$(this).find('ftsAddress').text();
		sessionStorage.jobsToList=$(this).find('jobToList').text();
	    	sessionStorage.endpointsUrl=$(this).find('endpointListUrl').text();
	    	sessionStorage.proxyCertHours=$(this).find('proxyCertHours').text();
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
	$.support.cors = true;
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

function getJobTranfers(jobId, isResubmit, overwrite, compare_checksum,resubmitAll){
	var urlE = sessionStorage.ftsRestEndpoint + "/jobs/" + jobId + "/files";
	$.support.cors = true;
	$.ajax({
		url : urlE,
		type : "GET",
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
	$.support.cors = true;
	$.ajax({
		url : urlEndp,
		//type : "DELETE" <-- use directly this is not working
		data: {"_method":"delete"},
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


// Call to make the transfer between two endpoints
function ftsTransfer(theData) {
	var urlE = sessionStorage.ftsRestEndpoint + "/jobs";
	theData = JSON.stringify(theData);
	$.support.cors = true;
	outPut = $.ajax({
		url : urlE,
		type : "POST",
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

function removeDelegation(delegationID, showRemoveDelegationMessage){
	var urlEndp = sessionStorage.ftsRestEndpoint + "/delegation/" + delegationID;
	$.support.cors = true;
	$.ajax({
		url : urlEndp,
		//type : "DELETE" <-- use directly this is not working
		data: {"_method":"delete"},
		dataType:'script', 
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
	$.support.cors = true;
	$.ajax({
		url : urlEndp,
		type : "GET",
		dataType : 'json',
		xhrFields : {
			withCredentials : true
		},
		
		success : function(data2, status) {
			if (data2 == null){
				showNoProxyMessages();
				if (showModal){
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
	$.support.cors = true;
	// Call 3: Asking for a new proxy certificate is needed
	$.ajax({
		url : urlEndp,
		type : "GET",
		xhrFields : {
			withCredentials : true
		},
		
		success : function(data3, status) {
			var asn1 = ProxyJS.Util.pem2asn1(data3);
			var certificate = new X509();
    			try {
        		   certificate.readCertPEM(userCERT);
    			}
    			catch (err) {
        			throw "Invalid or malformed X509 user certificate (contact site administrator)";
   			}
                        var privateKey = new RSAKey();
    			try {
        			privateKey.readPrivateKeyFromPEMString(userPrivateKeyPEM);
    			}
    			catch (err) {
        			throw "Invalid or malformed RSA private key";
    			}
			var x509Proxy = ProxyJS.signRequest(asn1,userDN, certificate,privateKey,parseInt(sessionStorage.proxyCertHours)); 
			var proxyPem = x509Proxy.getPEMString().replace(/\r/g, "").replace(/^\s*$[\n\r]{1,}/gm, "\n");

    			// Append certificate
    			//proxyPem += "\n" + userCERT;
                        proxyPem +=userCERT;
			console.log(proxyPem);
			urlEndp = sessionStorage.ftsRestEndpoint + "/delegation/" + delegationID + '/credential';
			// Call 4: Delegating the signed new proxy certificate
			$.ajax({
				url : urlEndp,									
				type : "POST",
				contentType : "text/plain; charset=UTF-8", 
				dataType : 'text',
				data: proxyPem,
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
				error : function(jqXHR, textStatus,	errorThrown) {		
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
	
	$.ajax({
		url : urlEndp,									
		type : "POST",
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
		error : function(jqXHR, textStatus,	errorThrown) {
			removeDelegation(delegationID, false);
			var verror = "Error obtaining VOMS credentials. " + supportText;
			var emessage = showError(jqXHR, textStatus, errorThrown, verror);
			showDelegateError(emessage);
		}
	});
}

function getEndpointContent(endpointInput, container, containerTable, indicator, stateText, filter){
        urlEndp = sessionStorage.ftsRestEndpoint + "/dm/list?surl=" + ($('#' + endpointInput).val()).trim();
	$.support.cors = true;
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

