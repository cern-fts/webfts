var NO_DELEGATION_DETECTED = "No delegation detected";
var EXISTING_PROXY_DETECTED = "Your current proxy is valid for ";
var VO_DETECTED = "for the VO ";

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


    if (!sessionStorage.userCert || sessionStorage.userCert =="") {
        $.get("ssoGetAssertion.php", function(data) {
	console.log("getting assertion");
        //checking assertion lifetime 
        if (ssoAssertionTimeLeft(data) < 60) {
                console.log("refreshing sso");
                //we have to refresh the assertion
                var currenturl = document.URL;
                currentpage = currenturl.substring(currenturl.lastIndexOf('/')+1);
                window.open(sessionStorage.ssoLogin+currentpage,"_self");
        }
        
        // Let's check if we really got an assertion
        var err = ssoErrorString(data);
        if(err) {
                console.log(err);
                getDelegationID("delegation_id", delegationNeeded);
                return;
        }
	$('#load-indicator').show();
        // We will now generate an RSA keypair *** THIS DOES NOT WORK WITH STS YET ***
//      var kp = KEYUTIL.generateKeypair("RSA", 2048);
//      sessionStorage.userKey = hextob64(KEYUTIL.getHexFromPEM(KEYUTIL.getPEM(kp["prvKeyObj"], "PKCS8PRV")));

        // We will now wrap fetched assertion in SOAP envelope
        // Third parameter to this function is an optional public key from our side (BASE64-encoded)
//      var req = ssoSoapReq(data, sessionStorage.stsAddress, hextob64(KEYUTIL.getHexFromPEM(KEYUTIL.getPEM(kp["pubKeyObj"]))), []);
        var req = ssoSoapReq(data, sessionStorage.stsAddress);

        // We will now send our SOAP request to STS
        if(req) {
                $.ajax({
                url: "/sts",
                type: "POST",
                contentType: "text/xml; charset=utf-8",
                headers: {SOAPAction: sessionStorage.stsAddress},
                data: req,
                success : function(data2, status) {
                        var err = ssoErrorString(data2);
                        if(err) {
                                console.log(err);
                                getDelegationID("delegation_id", delegationNeeded);
                                return;
                        }
                        // This function returns BASE64-encoded string of generated certificate
                        var cert = ssoGetCertificate(data2);
                        sessionStorage.userCert = cert;
                        // This function returns BASE64-encoded string of generated private key
                        var pkey = ssoGetPrivateKey(data2);
                        if(pkey) { // STS provided us a key
                                sessionStorage.userKey = pkey;
                        } else { // Use our own key
                                pkey = sessionStorage.userKey;
                        }
                        getDelegationIDSTS("delegation_id", delegationNeeded, cert, pkey);
			$('#load-indicator').hide();
                },
                error : function(jqXHR, textStatus, errorThrown) {
                        showError(jqXHR, textStatus, errorThrown, "Error contacting STS to request credendials");
			$('#load-indicator').hide();
                        }
                });
            }
        });
    } else getDelegationIDSTS("delegation_id", delegationNeeded, sessionStorage.userCert, sessionStorage.userKey);
}

