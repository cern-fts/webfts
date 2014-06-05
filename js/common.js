var NO_DELEGATION_DETECTED = "No delegation detected";
var EXISTING_PROXY_DETECTED = "Your current proxy is still valid for ";

function supportsHtml5Storage() {
	try {
		return 'localStorage' in window && window.localStorage !== null;
		} catch (e) {
			return false;
		}
}

function showRemainingProxyTime(timeText){
	$('#proxyTimeSpan').text(EXISTING_PROXY_DETECTED + timeText + " ");	
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
	$('#delegationModal').modal('show');
	if (!supportsHtml5Storage) {
		$('#deleteCacheButton').hide();
		$('#pemPkeyPW').hide();
	} else if (!existsCertInLocalStorage()) {
		$('#deleteCacheButton').prop("disabled", true);
	} else {
		$('#deleteCacheButton').show();
		$('#deleteCacheButton').prop("disabled", false);
	}
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
