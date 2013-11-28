var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
               "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

var permissionNumberMeaning = {
	    0 : '---',
	    1 : '--x',
	    2 : '-w-',
	    3 : '-wx',
	    4 : 'r--',
	    5 : 'r-x',
	    6 : 'rw-',
	    7 : 'rwx'
	};

function runTransfer(container, origFolder, destFolder){	  
	hideUserReport();
	var selectedFiles = getSelectedFiles(container);
    //TODO: check that the destination is a FOLDER!!!!!!!!
    if (selectedFiles.length > 0){
		var theData = {};
		theData["files"] = [];       	  
		theData["files"].push({});    	  
		theData["files"][0]["sources"] = [];
		theData["files"][0]["sources"] = getFullPathList(selectedFiles, document.getElementById(origFolder).value);
		theData["files"][0]["destinations"] = [];
		theData["files"][0]["destinations"] = getFullPathList(selectedFiles, document.getElementById(destFolder).value);
		theData["params"] = [];
		  
		runDataTransfer($('#delegation_id').val(), theData);
    }
    return false;
}

function getFullPathList(slist, endFolder){
	var dList = [];
	for (var i = 0; i < slist.length; i++){	
		dList[i] = endFolder + '/' + slist[i];
	}
	return dList;
}	

function activateTransferButton(epTable, buttonToActivate, endPoint){
	if ((getSelectedFiles(epTable).length > 0) && ($('#' + endPoint).text().length > 0)){ 
		$('#' + buttonToActivate).removeAttr("disabled");
	} else {
		$('#' + buttonToActivate).attr('disabled','disabled');
	}
}

function showRemainingProxyTime(timeText){
	$('#proxyTimeSpan').text("Your current proxy is still valid for " + timeText);	
}

function clearContentTable(containerTable, container, indicator, stateText){
	$("#" + containerTable + " > tbody").html("");
	$('#' + container).show();
	$('#' + indicator).hide();	
	$("#" + stateText).text("");
}

function getPermissionsString(oNumber){	
	var dirString = "";
	var maxIt = 0;
	if (oNumber>1000){
		dirString ="d";
		maxIt = 40;
	} else {
		dirString ="-";
	}
	var perString ="";
	while (oNumber > maxIt){		
		perString = permissionNumberMeaning[oNumber % 10] + perString; 
		oNumber = Math.floor(oNumber / 10);	
	}
	return dirString + perString;
}

function pad (str, max) {
	return str.length < max ? pad("0" + str, max) : str;
}

function loadFolder(endpointpath, container, containerTable, elements, indicator, stateText){
	clearContentTable(containerTable, container, indicator, stateText);
	$.each(elements, function(index, value){
		var icon = "";
		if (index.slice(-1) == "/"){
			icon ="glyphicon glyphicon-folder-close";
		} else {
			icon ="glyphicon glyphicon-file";				
		}
		var t_row = '<tr value="' + index + '"><td><i class="' + icon + '"/>&nbsp;' + index + '</td>';
		$.each(value, function(e_index, e_value){
			if (e_index == 'mode'){
				e_value = getPermissionsString(parseInt(e_value, 10).toString(8)); //to octal 
			} else if (e_index == 'mtime'){
				var fdate = new Date(e_value*1000);
				e_value = months[fdate.getUTCMonth()] + " " + pad(fdate.getUTCDate().toString(), 2) + " " + 
						  pad(fdate.getUTCHours().toString(), 2) + ":" + pad(fdate.getUTCMinutes().toString(), 2); 
			}
			t_row += '<td>' + e_value + '</td>';
		});
		t_row += '</tr>'; 
		$('#' + containerTable +' > tbody:last').append(t_row);
	});
	$("#" + stateText).text(checkLength(endpointpath));
	$("#" + containerTable + " tbody").finderSelect("update");
}

function renderFolderContent(tableId, countId, container, indicator, stateText){
    // Initialise the Demo with the Ctrl Click Functionality as the Default
    $("#" + tableId + " tbody").finderSelect({enableDesktopCtrlDefault:true, totalSelector:"."+countId , selectClass:'label-info'});   
    clearContentTable(tableId, container, indicator, stateText);
}

function selectAllFiles(container){ 
	$("#" + container + " tbody").finderSelect('highlightAll');
	$("#" + container + " tbody").finderSelect("update");
}

function selectNoneFiles(container){ 
	$("#" + container + " tbody").finderSelect('unHighlightAll');
	$("#" + container + " tbody").finderSelect("update");
}

function getSelectedFiles(container){
	var selectedList = [];
	var selectedEle = $("#" + container + " tbody").finderSelect('selected');
	for (var i = 0; i < selectedEle.length; i++){
		selectedList.push(selectedEle[i].attributes.value.nodeValue);  		
	}
	return selectedList;
}

function getEPContent(endpointInput, container, containerTable, indicator, stateText){	
	hideUserReport();
	$('#'+indicator).show();
	$('#'+container).hide();
	getEndpointContent($('#' + endpointInput).val(), container, containerTable, indicator, stateText);
}

function initialLoadState(input, button){
    $('#'+ button).attr('disabled',true);    
    $('#'+ input).keyup(function(){        
        if($(this).val().length !=0){
            $('#'+ button).attr('disabled', false);
        }
        else
        $('#'+ button).attr('disabled',true);
    });
}

function hideUserReport(){	
	$('#serverkeyAlert').hide();
	$('#serverkeyAlertSuccess').hide();
}

function showUserError(message){
	$('#serverErrorText').text(message);
	$('#serverkeyAlert').show();
}

function showUserSuccess(message){
	$('#serverSuccessText').text(message);
	$('#serverkeyAlertSuccess').show();	
}

function showDelegateError(message){
	$('#serverDelegateErrorText').text(message);
	$('#serverDelegateAlert').show();
}

function hideDelegateModal(){
	$('#delegationModal').modal('hide');
	$('#serverDelegateAlert').hide();
}

function showDelegateModal(){
	$('#delegationModal').modal('show');
}
	
function checkLength(text) {
	var maxlength = 60;
    if(text.length > maxlength) {
    	return text.substring(0, maxlength-1) + "...";
    }
    return text;
}

function getFilteredResults(input, contentTable){
	var filter = $('#' + input).val();
	filterResults(filter, contentTable);
}

function filterResults(userfilter, contentTable){
    //split the current value of searchInput
    var data = userfilter.split(" ");
	
    //create a jquery object of the rows
    var jo = $("#" + contentTable + " tbody").find("tr");
    if (userfilter == "") {
        jo.show();
        return;
    }
    //hide all the rows
    jo.hide();

    //Recusively filter the jquery object to get results.
    jo.filter(function (i, v) {
    	var $t = $(this);
        for (var d = 0; d < data.length; ++d) {
            if ($t.is(":contains('" + data[d] + "')")) {
                  return true;
            }
        }
        return false;
    })
    //show the rows that match.
    .show();
};