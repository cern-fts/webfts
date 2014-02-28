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
    if (selectedFiles.length > 0){
		var theData = {};
		theData["files"] = [];       	      	  
		for (var i=0; i<selectedFiles.length; i++){
			var files = {};
			files["sources"] = [];
			files["sources"] = getFullPath(selectedFiles[i], document.getElementById(origFolder).value.trim());
			files["destinations"] = [];
			files["destinations"] = getFullPath(selectedFiles[i], document.getElementById(destFolder).value.trim());
			theData["files"].push(files);
		}
		theData["params"] = [];
		  
		runDataTransfer($('#delegation_id').val(), theData);
    }
    return false;
}

function getFullPath(element, endFolder){
	var dList = [];
	if (endFolder.slice(-1) != "/"){
		endFolder += "/";
	}
	dList[0] = endFolder + element;	
	return dList;
}	

function activateTransferButton(epTable, buttonToActivate, endPoint){
	if ((getSelectedFiles(epTable).length > 0) && ($('#' + endPoint).text().length > 0)){ 
		$('#' + buttonToActivate).removeAttr("disabled");
	} else {
		$('#' + buttonToActivate).attr('disabled','disabled');
	}
}


		 
function clearContentTable(containerTable, container, indicator, stateText){
	$("#" + containerTable + " > tbody").html("");
	$('#' + container).show();
	$('#' + indicator).hide();	
	$("#" + stateText).text("");
}

function getPermissionsString(oNumber){	
	var dirString = "-";
	if (oNumber<100000){
		dirString ="d";	
	} 
	var perString ="";
	for (var i=0; i<3; i++){		
		perString = permissionNumberMeaning[oNumber % 10] + perString; 
		oNumber = Math.floor(oNumber / 10);	
	}
	return dirString + perString;
}

function pad (str, max) {
	return str.length < max ? pad("0" + str, max) : str;
}

function getNextFolderContent(endpointInput, container, containerTable, indicator, stateText, folder, filter){
	if ($('#' + endpointInput).val().slice(-1) == "/"){
		$("#" + endpointInput).val($('#' + endpointInput).val() + folder + '/');
	} else {
		$("#" + endpointInput).val($('#' + endpointInput).val() + '/' + folder + '/');
	}
	getEPContent(endpointInput, container, containerTable, indicator, stateText, filter);	
}

function getPreviousFolderContent(endpointInput, container, containerTable, indicator, stateText, filter){
	$("#" + endpointInput).val(getPreviousUrl($('#' + endpointInput).val()));
	getEPContent(endpointInput, container, containerTable, indicator, stateText, filter);	
}

function getPreviousUrl(endpointUrl){
	var foldersStartIndex = endpointUrl.indexOf("://");
	if (foldersStartIndex == -1)
		return null;
	if (endpointUrl.slice(-1) == "/")
		endpointUrl = endpointUrl.substring(0, endpointUrl.length-1);

	var ipath = endpointUrl.substring(endpointUrl.indexOf("://")+3, endpointUrl.length);
	var t = ipath.split("/");	
	if (t.length > 1)
		return newUrl = endpointUrl.substring(0, endpointUrl.indexOf("://")+3) + "" + ipath.substring(0, ipath.lastIndexOf("/"));
	return null;	
}

function loadFolder(endpointInput, container, containerTable, elements, indicator, stateText, filter){
	clearContentTable(containerTable, container, indicator, stateText);	
	var up = getInitialRowContent(endpointInput, container, containerTable, indicator, stateText, filter);
	if (up != null){
		var back_row = [];
		back_row.push(up);
		$('#' + containerTable +' > tbody:last').append(back_row.join(""));
	}	
	$.each(elements, function(index, value){
		var icon = "";
		var t_row = [];

		if (index.slice(-1) == "/"){
			icon ="glyphicon glyphicon-folder-close";
			t_row.push("<tr value='" + index.slice(0,-1).trim() + "' onclick=\"getNextFolderContent('" + endpointInput + "','" + container + "','" + containerTable + "','" + indicator + "','" + stateText + "','" + index.slice(0,-1).trim() + "','" + filter + "')\">");
			t_row.push('<td title="' + index + '"><i class="' + icon + '"/>&nbsp;' + getPrintableFileName(index.slice(0,-1).trim()) + '</td>');
		} else {
			icon ="glyphicon glyphicon-file";	
			t_row.push('<tr value="' + index + '">');
			t_row.push('<td title="' + index + '"><i class="' + icon + '"/>&nbsp;' + getPrintableFileName(index) + '</td>');
		}		
		$.each(value, function(e_index, e_value){
			if (e_index == 'mode'){
				t_row.push('<td>' + getPermissionsString(parseInt(e_value, 10).toString(8)) + '</td>'); //to octal
			} else if (e_index == 'mtime'){
				var fdate = new Date(e_value*1000);
				e_value = getFileDate(fdate);				
				t_row.push('<td>' + e_value + '</td>');
			} else if (e_index == 'size'){				
				t_row.push('<td id=' + e_value + '>' + getReadableFileSizeString(e_value) + '</td>');
			}			
		});
		t_row.push('</tr>'); 
		$('#' + containerTable +' > tbody:last').append(t_row.join(""));
	});
	$("#" + stateText).text($('#' + endpointInput).val());
	$("#" + containerTable + " tbody").finderSelect("update");
}

function getInitialRowContent(endpointInput, container, containerTable, indicator, stateText, filter){
	if (getPreviousUrl($('#' + endpointInput).val()) != null){
		return "<tr value='previous' onclick=\"getPreviousFolderContent('" + endpointInput + "','" + container + "','" + containerTable + "','" + indicator + "','" + stateText + "','" + filter + "')\">" + 
			   "<td><i class='glyphicon glyphicon-circle-arrow-up'/>&nbsp;..</td><td></td><td></td><td></td></tr>";
	} else {
		return null;
	}
}

function renderFolderContent(tableId, countId, container, indicator, stateText){
    // Initialise with the Ctrl Click Functionality as the Default
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

function getEPContent(endpointInput, container, containerTable, indicator, stateText, filter){	
	hideUserReport();
	$('#'+indicator).show();
	$('#'+container).hide();
	$('#'+filter).val('');
	getEndpointContent(endpointInput, container, containerTable, indicator, stateText, filter);
}

function setButtonState(input, button){
	if(input.val().length !=0)
        $('#'+ button).attr('disabled', false);        
    else
    	$('#'+ button).attr('disabled',true);
}

function initialLoadState(input, button){
    $('#'+ button).attr('disabled',true);    
    $('#'+ input).click(function(){        
    	setButtonState($(this), button);
    });
    $('#'+ input).keyup(function(){        
    	setButtonState($(this), button);
    });
    $('#'+ input).on('paste', function(){        
    	setButtonState($(this), button);
    });
}

function hideUserReport(){	
	$('#serverkeyAlert').hide();
	$('#serverkeyAlertSuccess').hide();
}

function getFilteredResults(input, contentTable, option){
	var panelToShow = $('#' + option).val();
	var filter = $('#' + input).val();
	var inputs = $("#" + panelToShow + " :input");
	var checkBoxParent = $('#' + option).parent().parent()[0].id;
	var hideFolders = $("#" + checkBoxParent  + " :checkbox")[0].checked;
	var columnName = $('#' + option).find(":selected").text();
	filterResults(filter, contentTable, inputs, hideFolders, columnName);
}

function filterResults(userfilter, contentTable, inputs, hideFolders, columnName){
    //create a jquery object of the rows
    var jo = $("#" + contentTable + " tbody").find("tr");
    if (userfilter == "" && columnName == "Name") {
        jo.hide();
    	filterFolders(jo,hideFolders);
        return;
    }
    //hide all the rows
    jo.hide();
    
    switch (columnName){
	    case "Name":
	    	filterByName(jo, userfilter.split(" "), hideFolders);
	    	break;
	    case "Date":
    		filterByTime(jo, inputs, hideFolders);
	    	break;
	    case "Size":
    		filterBySize(jo, inputs, hideFolders);
	    	break;
    }
};

function filterBySize(jo, inputs, hideFolders){
    //Recusively filter the jquery object to get results.
    jo.filter(function (i, v) {
    	var $t = $(this);
    	if ($t.children()[0].textContent.indexOf('/') !== -1 && hideFolders) {
             return false;
        } else {
        	if (inputs[0].value !== ""){
        		if (parseInt(inputs[0].value.trim()) <= parseInt($t.children()[3].id)){
        			if (inputs[1].value != ""){
        				if (parseInt(inputs[1].value.trim()) >= parseInt($t.children()[3].id)){
        					return true;
    					}
        				return false;
        			}        			
        			return true;
        		}           	
        	} else if (inputs[1].value !== ""){
        		if (parseInt($t.children()[3].id) <= parseInt(inputs[1].value.trim())){        			
        				return true;        			
        		}           	
        	} else {
        		//Both empty
        		return true;
        	}       	        	
        }
        return false;
    })	
    //show the rows that match.
    .show();	
}

function filterByTime(jo, inputs, hideFolders){
    //Recusively filter the jquery object to get results.
    jo.filter(function (i, v) {
    	var $t = $(this);
    	if ($t.children()[0].textContent.indexOf('/') !== -1 && hideFolders) {
             return false;
        } else {
        	if (inputs[0].value !== ""){
        		if (Date.parse(inputs[0].value.trim()) <= Date.parse($t.children()[2].textContent)){
        			if (inputs[1].value != ""){
        				if (Date.parse(inputs[1].value.trim()) >= Date.parse($t.children()[2].textContent)){
        					return true;
    					}
        				return false;
        			}        			
        			return true;
        		}           	
        	} else if (inputs[1].value !== ""){
        		if (Date.parse($t.children()[2].textContent) <= Date.parse(inputs[1].value.trim())){        			
        				return true;        			
        		}           	
        	} else {
        		//Both empty
        		return true;
        	}       	        	
        }
        return false;
    })	
    //show the rows that match.
    .show();
}

function filterFolders(jo,hideFolders){
    //Recusively filter the jquery object to get results.
    jo.filter(function (i, v) {
    	var $t = $(this);
    	var $r = $t.children()[0].textContent; 
        if ($r.indexOf('/') !== -1 && hideFolders) {
                  return false;
        }        
        return true;
    })	
    //show the rows that match.
    .show();
}

function filterByName(jo, data, hideFolders){
    //Recusively filter the jquery object to get results.
    jo.filter(function (i, v) {
    	var $t = $(this);
    	if ($t.children()[0].textContent.indexOf('/') !== -1 && hideFolders) {
             return false;
        } else { 
        	if (isRegEx(data.toString())){
        		try {
        			var fileName = $t.children()[0].textContent.toString().trim();
        			if (fileName.indexOf('/') !== -1)
        				fileName = fileName.substr(0, fileName.length - 1);
        			if (fileName.match(data) != null) //regex
        				return true;
        		} finally {
        			console.log("Waiting fot reh rest of the regex"); 
        		}
        	} else { 
		        for (var d = 0; d < data.length; ++d) {	        	
		            if ($t.children('td').eq(0).is(":contains('" + data[d] + "')")) {
		                  return true;
		            }
		        }
        	}
        }
        return false;
    })	
    //show the rows that match.
    .show();
}

function isRegEx(data){
	var regChars = {'[':true, ']':true, '(':true, ')':true, '|':true, '^':true, '\\':true, '*':true, '!':true, '?':true};
	for (var d = 0; d < data.length; ++d) {	
		if (regChars[data[d]] != null && regChars[data[d]]){
			return true;
		}
	}
	return false;
}

function initFilters(){
	$('#leftFilterPanel').hide();
	$('#rightFilterPanel').hide();
	
	$('#leftFilterOptionsPanel').hide();
	$('#rightFilterOptionsPanel').hide();	
}

function setFilterShowingOptions(panel, textInput, option, contentTable){	
	$("#" + panel).children().show();
	$("#" + option).siblings().hide();
	if (option.indexOf('1') != -1)
			$('#' + textInput).show();
	else 
		$('#' + textInput).hide();
	$('#' + textInput).val("");
	$('#' + panel + " :input").val("");
	$('#' + panel).show();	
	
	var jo = $("#" + contentTable + " tbody").find("tr");
    jo.show();	
}

function setInitialDatepickers(){
	$("#leftFromRangeFilterDate").datepicker();
	$("#leftToRangeFilterDate").datepicker();
	$("#rightFromRangeFilterDate").datepicker();
	$("#rightToRangeFilterDate").datepicker();	
}

function setFilterPanel(panel, buttonObj){
	buttonObj.text(function(i, text){
        return text === "Show filters" ? "Hide filters" : "Show filters";
	});
	$('#' + panel).toggle();
}

function getReadableFileSizeString(fileSizeInBytes) {

	if (fileSizeInBytes < 1024)
		return fileSizeInBytes + ' B';
	
    var i = -1;
    var byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
    do {
        fileSizeInBytes = fileSizeInBytes / 1024;
        i++;
    } while (fileSizeInBytes > 1024);

    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
};

function getFileDate(fdate){
	//day month hour if it is within the last year
	//day month year if older than one year
	
	var currentDate = new Date();
	var diff = currentDate - fdate;
	var days = Math.round(diff/(1000*60*60*24));
	
	if (days >= 365){
		return pad(fdate.getUTCDate().toString(), 2) + " " +months[fdate.getUTCMonth()] + " "
		       + fdate.getFullYear().toString().substr(2,2);
		
	} else {
		return pad(fdate.getUTCDate().toString(), 2) + " " +months[fdate.getUTCMonth()] + " " 
			   + pad(fdate.getUTCHours().toString(), 2) + ":" + pad(fdate.getUTCMinutes().toString(), 2);
	}	
}

function getPrintableFileName(fileName){
	if (fileName.length > 25){
		return fileName.substring(0, 25)+"...";
	}
	return fileName;
}