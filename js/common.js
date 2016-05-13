var NO_DELEGATION_DETECTED = "No delegation detected";
var EXISTING_PROXY_DETECTED = "Your current proxy is valid for ";
var VO_DETECTED = "for the VO ";
var NO_URL_DETECTED = "No Endpoint detected, please load an endpoint!";
var NO_FILE_SELECTED = "No file/folder selected, please select one file/folder!"
var MULTIPLE_FILE_SELECTED = "Multiple selections is not supported, please select only one file/folder";

function showRemainingProxyTime(timeText,vo){
	$('#proxyTimeSpan').text(EXISTING_PROXY_DETECTED + timeText + " ");
	if (vo !== "")	
		$('#proxyTimeSpan').append(VO_DETECTED + vo + " ");	
	else 
		$('#proxyTimeSpan').append(" with No VO Extensions");
	updateProxyButtons('proxyTimeSpan');
}

function showNoProxyMessages(){
	$('#proxyTimeSpan').text(NO_DELEGATION_DETECTED);
	updateProxyButtons('proxyTimeSpan');
}

function updateProxyButtons(button){
	if ($("#" + button).text() == NO_DELEGATION_DETECTED){
		$("#delegate_again_link").removeClass("disabled");
		$("#delegate_remove_link").addClass("disabled");
	} else if ($("#" + button).text().match(EXISTING_PROXY_DETECTED)){
		$("#delegate_again_link").addClass("disabled");
		$("#delegate_remove_link").removeClass("disabled");
	} else {
		$("#delegate_again_link").removeClass("disabled");
		$("#delegate_remove_link").removeClass("disabled");
	}
}

function showDelegateError(message){
	$('#delegating-indicator').hide();
	$('#delegateDelegateErrorText').text(message);
	$('#serverDelegateAlert').show();
}

function hideDelegateModal(){
	hideUserReport();
	$('#delegating-indicator').hide();
	$('#delegationModal').modal('hide');
	$('#serverDelegateAlert').hide();
}

function showDelegateModal(){
	//if sso is used do delegation othwrise use the modal
 	//getDelegation(true);       
	$('#delegationModal').modal('show');
}

function removeExistingDelegation(){
	removeDelegation($('#delegation_id').val(), true);
}

function showUserError(message){
	$('#serverErrorText').text(message);
	$('#serverkeyAlert').show();
}

function showUserSuccess(message){
	$('#serverSuccessText').text(message);
	$('#serverkeyAlertSuccess').show();	
}

function hideUserReport(){	
	$('#serverkeyAlert').hide();
	$('#serverkeyAlertSuccess').hide();
}

function showRevokeCSModal() {
       $('#revokeCSAcccessModal').modal('show');
}

function hideRevokeCSModal() {
       $('#revokeCSAcccessModal').modal('hide');
}

function getQueryParams(qs) {
    qs = qs.split("+").join(" ");

    var params = {}, tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }

    return params;
}

function getUrlVars(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function showVOMSModal() {
       $('#vomsModal').modal('show');
} 

function showRevokeCSModal() {
       $('#revokeCSAcccessModal').modal('show');
}

function hideRevokeCSModal() {
       $('#revokeCSAcccessModal').modal('hide');
}

function getDelegation(delegationNeeded) {
    
    //check if there is a user cert or login
    if (!sessionStorage.ssoLoggedin ) {
           if ( $('#clientCERT').val() == "") {
                      alert("Please provide a user certificate or Login to SSO first to access WebFTS functionalities");
		      return;
      		}	
   }

    //check if there is already a cert in the session and if it's still valid, otherwise clean the session object
    if (sessionStorage.userCert && sessionStorage.userCert !="") {
		if (!certValid(sessionStorage.userCert)) {
			sessionStorage.removeKey(userCert);
			sessionStorage.removeKey(userKey);
		}else console.log("cert valid");
    }

    if (!sessionStorage.userCert || sessionStorage.userCert =="") {
	$('#load-indicator').show();
	var jqxhr  = Kipper.getAssertion();
	var voString = sessionStorage.stsVO +":/"+ sessionStorage.stsVO
        jqxhr.complete(function(data){
                if (Kipper.ssoAssertionTimeLeft(data.responseXML) < 60) {
                //we have to refresh the assertion, for instance reloading the login page
                     $('#load-indicator').hide();
                     alert("The session has expired please Logout and Login again from SSO")
                     return null
                }
                
	        // Let's check if we really got an assertion
        	var err = Kipper.ssoErrorString(data.responseXML);
	        if(err) 
		{
        		console.log(err);
		        $('#load-indicator').hide();
			getDelegationID("delegation_id", delegationNeeded);
		}
		else {	
	        	var kp = KEYUTIL.generateKeypair("RSA", 2048);
	        	// We will now wrap fetched assertion in SOAP envelope
        		var req = Kipper.ssoSoapReq(data.responseXML, sessionStorage.stsAddress, hextob64(KEYUTIL.getHexFromPEM(KEYUTIL.getPEM(kp["pubKeyObj"]))),voString);
        		if (req == null) {
				console.log("failed to generate the SOAP request")
				$('#load-indicator').hide();
				getDelegationID("delegation_id", delegationNeeded);
				
			}
			else {
		        	jqxhr  = Kipper.getCredentials(req,sessionStorage.stsAddress);
				jqxhr.complete(function(creds){
			 	if (creds == null) {
					alert("Error contacting STS to request credendials");
					$('#load-indicator').hide();
					getDelegationID("delegation_id", delegationNeeded);	
		
	        		}else {
					sessionStorage.userProxy = Kipper.ssoGetProxy(creds.responseXML);
					sessionStorage.userCert = Kipper.ssoGetCertificate(creds.responseXML);
                                        sessionStorage.userKey = hextob64(KEYUTIL.getHexFromPEM(KEYUTIL.getPEM(kp["prvKeyObj"], "PKCS8PRV")));
		        	        getDelegationIDSTS("delegation_id", delegationNeeded, sessionStorage.userCert, sessionStorage.userKey);
					$('#load-indicator').hide();
	       	    		}
			});
			}
		}
		});
	} else getDelegationIDSTS("delegation_id", delegationNeeded, sessionStorage.userCert, sessionStorage.userKey);
}

function showDataManagementModal(type, url, side, container){
	if (url =="") {
		  $('#renameModal').hide();
                  $('#removeModal').hide();
                  $('#createFolderModal').hide();
		  $('#errorString').val(NO_URL_DETECTED); 
	          $('#errorModal').show();
	} else if (type != 'create' && getSelected(container).length != 1) {
		if (getSelected(container).length ==0) {
		  $('#errorString').val(NO_FILE_SELECTED);				
		} else {
		  $('#errorString').val(MULTIPLE_FILE_SELECTED);
		}
		  $('#renameModal').hide();
                  $('#removeModal').hide();
                  $('#createFolderModal').hide();
		  $('#errorModal').show();
	}
	else  {	  
	    $('#errorModal').hide();
	    $('#sideModal').val(side);
	    //add slash at the end of the url
	    if (url.slice(-1) != "/")
		url = url+ "/";

	    switch(type) {
    		case 'create':
			$('#renameModal').hide();
			$('#removeModal').hide();
			$('#createFolderModal').show();
			if (side=='left' && sessionStorage.leftCSIndex && sessionStorage.leftCSIndex > 0)
				$('#createFolderEndpoint').val("dropbox://www.dropbox.com"+url);
			else
				$('#createFolderEndpoint').val(url);
        	break;
    		case 'remove':
			$('#renameModal').hide();
			$('#createFolderModal').hide();
			$('#removeModal').show();
			if (side == 'left' && sessionStorage.leftCSIndex && sessionStorage.leftCSIndex > 0)
				$('#removeEndpoint').val("dropbox://www.dropbox.com/"+getSelected(container)[0]);
			else
				$('#removeEndpoint').val(url+getSelected(container)[0]);
        	break;
		case 'rename':
			$('#createFolderModal').hide();
			$('#removeModal').hide();
			$('#renameModal').show();	
			$('#oldname').val(getSelected(container)[0]);
			if (side == 'left' && sessionStorage.leftCSIndex && sessionStorage.leftCSIndex > 0)
				$('#basePath').val("dropbox://www.dropbox.com/"+url);
			else
				$('#basePath').val(url);
    		break;
	  }
	}
       $('#dataManagement').modal('show');
}

function hideDatamanagementModal(){
        $('#dataManagement').modal('hide');
	$('#loading-indicator').hide();
}
