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
