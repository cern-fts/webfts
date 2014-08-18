var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
               "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

var endpointsListURL = "https://webfts.cern.ch/endpointList";

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

function runTransfer(container, origFolder, destFolder, CSLeftSelect){
	if (false){ //#TODO: remove "true" and do a check of the expiration time
		$("#warningTransferButton").click({c: container, o: origFolder, d: destFolder, s:CSLeftSelect}, function(e) {
			executeTransfer(e.data.c, e.data.o, e.data.d, e.data.s);
		});			
		$("#expirationModal").show();
	} else {
		executeTransfer(container, origFolder, destFolder, CSLeftSelect);
	}	
}


function executeTransfer(container, origFolder, destFolder, CSLeftSelect){		
	hideUserReport();
	var selectedFiles = getSelectedFiles(container);
        if (selectedFiles.length > 0){
    		var optionSelected = $('#' + CSLeftSelect).data('ddslick'); 
	    	if (optionSelected.selectedIndex > 0){
  	    		runDataTransfer($('#delegation_id').val(), getCSDataTransfer(origFolder, destFolder, selectedFiles, optionSelected.selectedData.text.toLowerCase()));  	    		    				          } 
							else {	    	    		    	    	    	    	    					    		    	    		runDataTransfer($('#delegation_id').val(), getDataTransfer(origFolder, destFolder, selectedFiles));
		}
	
	}    
	return false;
}


//TO REMOVE CAUSE UNUSED
function protocolValidation(o,d){
	var ori = document.getElementById(o).value.trim().split(':')[0];
	var des = document.getElementById(d).value.trim().split(':')[0];
	
	if (ori == des)
		return true;
	else if (ori == "srm" || des == "srm")
		return true;
	else
		return false;
	
	var selectedFiles = getSelectedFiles(container);
    	if (selectedFiles.length > 0){
    	
    	var optionSelected = $('#' + CSLeftSelect).data('ddslick'); 
    	if (optionSelected.selectedIndex > 0){
    		runDataTransfer($('#delegation_id').val(), getCSDataTransfer(origFolder, destFolder, selectedFiles, optionSelected.selectedData.text.toLowerCase()));
    	} else {
    		runDataTransfer($('#delegation_id').val(), getDataTransfer(origFolder, destFolder, selectedFiles));
    	}	
    }
    return false;
}

function getDataTransfer(origFolder, destFolder, selectedFiles) {
	
	var theData = {};
        theData["files"] = [];
	theData["params"] = {};

	for (var i=0; i<selectedFiles.length; i++){
		var files = {};
		files["sources"] = [];
		files["sources"] = getFullPath(selectedFiles[i], document.getElementById(origFolder).value.trim());
		files["destinations"] = [];
		files["destinations"] = getFullPath(selectedFiles[i], document.getElementById(destFolder).value.trim());
		theData["files"].push(files);
	}
	
	if ($('#lfcregistration').prop('checked')) {
                        for (var i=0; i<selectedFiles.length; i++){
                                var files = {};
                                files["sources"] = [];
                                files["sources"] = getFullPath(selectedFiles[i], document.getElementById(destFolder).value.trim());
                                files["destinations"] = [];
                                files["destinations"] = getFullPath(selectedFiles[i], $('#lfcendpoint').val());
                                theData["files"].push(files);
                        }
			
                        theData["params"].multihop = true;
	}
	theData["params"].verify_checksum = $('#checksum').prop('checked');
        theData["params"].overwrite = $('#overwrite').prop('checked');
	
	return theData;	
}

function runTransferFromURL(container, url, destFolder){	  
	hideUserReport();

	var theData = {};
	theData["files"] = [];       	      	  

	var files = {};
	files["sources"] = [];
	var sList = [];
	sList[0] = document.getElementById(url).value.trim();
	files["sources"] = sList;
	files["destinations"] = [];
	files["destinations"] = getFullPath(getFileNameFromURL(document.getElementById(url).value.trim()), document.getElementById(destFolder).value.trim());
	theData["files"].push(files);

	theData["params"] = [];
	  
	runDataTransfer($('#delegation_id').val(), theData);

    return false;
}

function getFileNameFromURL(url){
	return url.substr(url.lastIndexOf("/") + 1);
}

function getFullPath(element, endFolder){
	var dList = [];
	if (endFolder.slice(-1) != "/"){
		endFolder += "/";
	}
	dList[0] = encodeURI(endFolder + element);	
	return dList;
}	

function activateTransferButton(epTable, buttonToActivate, endPoint){
	//check if the checkbox for lfc registration is on and the text is correct
	var lfcSuffix = "lfc://";
	var lfcRegistrationActivate = true;

	if ($('#lfcregistration')[0].checked === true) {
		if (($('#lfcendpoint').val().length >0) &&  ($('#lfcendpoint').val().slice(0, lfcSuffix.length) == lfcSuffix)) {}
		else {	lfcRegistrationActivate = false; }
	}
			
	if (((epTable != null) && (getSelectedFiles(epTable).length > 0) &&  lfcRegistrationActivate && ($('#' + endPoint).text().length > 0 )) || ((epTable == null) && ($('#' + endPoint).text().length > 0))){ 
		$('#' + buttonToActivate).removeAttr("disabled");
	} else {
		$('#' + buttonToActivate).attr('disabled','disabled');
	}
	
}

function clearContentTable(containerTable, container, indicator, stateText){
	$("#" + containerTable + " > tbody").html("");
	$("#" + containerTable + " tbody").finderSelect("update");
	$('#' + container).show();
	$('#' + indicator).hide();	
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
	setInputPath(endpointInput, folder);
	getEPContent(endpointInput, container, containerTable, indicator, stateText, filter);	
}

function setInputPath(endpointInput, folder) {
	var endUrl = ($('#' + endpointInput).val()).trim();
	if (endUrl.slice(-1) == "/"){
		$("#" + endpointInput).val(endUrl + folder + '/').change();
	} else {
		$("#" + endpointInput).val(endUrl + '/' + folder + '/').change();
	}
}

function getPreviousFolderContent(endpointInput, container, containerTable, indicator, stateText, filter){
	$("#" + endpointInput).val(getPreviousUrl(($('#' + stateText).text()).trim()));
	getEPContent(endpointInput, container, containerTable, indicator, stateText, filter);	
}

function getPreviousUrl(endpointUrl){
	var foldersStartIndex = endpointUrl.indexOf("://");
	if (foldersStartIndex == -1)
		return null;
	else if (endpointUrl.slice(-1) == "/")
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
				if (t_row[1].indexOf("folder") != -1){
					//The number of a folder means the number of elements. Not need to be converted
					t_row.push('<td id=' + e_value + '> - </td>');
				} 
				else 
				{
					t_row.push('<td id=' + e_value + '>' + getReadableFileSizeString(e_value) + '</td>');							}	
			}																});
		t_row.push('</tr>');
	        $('#' + containerTable +' > tbody:last').append(t_row.join(""));									});
 	$("#" + stateText).text(($('#' + endpointInput).val()).trim());
        $("#" + containerTable + " tbody").finderSelect("update");
      
   }


function getInitialRowContent(endpointInput, container, containerTable, indicator, stateText, filter){
	if (getPreviousUrl(($('#' + endpointInput).val()).trim()) != null){
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
		selectedList.push(selectedEle[i].attributes.value.value);  		
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
    	if ($t.children()[0].title.indexOf('/') !== -1 && hideFolders) {
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
    	if ($t.children()[0].title.indexOf('/') !== -1 && hideFolders) {
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
    	if ($t.children()[0].title.indexOf('/') !== -1 && hideFolders) {
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

function setFilterPanel(panel, buttonObj){
	buttonObj.text(function(i, text){
        return text === "Show filters" ? "Hide filters" : "Show filters";
	});
	$('#' + panel).toggle();
}

function getReadableFileSizeString(fileSizeInBytes) {

	if (fileSizeInBytes == 0)
		return fileSizeInBytes;
	
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
	if (fileName.length > 18){
		return fileName.substring(0, 18)+"...";
	}
	return fileName;
}
 

function loadEndpointsList(boxes){
	$.ajax({
		url : endpointsListURL,
		type : "GET",
		dataType : 'xml',
		xhrFields : {
			withCredentials : true
		},
		
		success : function(xml) {
			if (xml != null){
				var availableURLs = [];
				$(xml).find("entry").each(function()
						  {
							endpoint = $(this).find("endpoint").text();
							if ($(this).find("type").text() == "SRM"){
								if (endpoint.substring(0,5) == "httpg")
									availableURLs.push("srm" + endpoint.substring(5, endpoint.length));
							} else {
								availableURLs.push(endpoint);
							}
						    $("#output").append($(this).attr("author") + "<br />");
						  });
				for(var i =0; i < boxes.length; i++){
					loadEPList(boxes[i], availableURLs);
				}
			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
			console.log("File with the endpoints list not avaialble or not accesible");
			console.log(jqXHR);
			console.log("ERROR: " + JSON.stringify(jqXHR));
			console.log(textStatus + "," + errorThrown);
		}
	});
	//console.log("The filtered array has " + newArray.length + " elements");
	//return newArray;
}

function getFilter(epurl){	
	return getHost(epurl);
}

function testEP(availableURLs){
	var ok = 0;
	var bad =0;
	var bad400 =0;
	var bad403 =0;
	var bad404 =0;
	var bad419 =0;
	var bad500 =0;
	var bad503 =0;
	console.log("Testing");
	for (var i=0; i<availableURLs.length; i++){		
		var urlEndp = "https://fts3-devel-oracle.cern.ch:8446/dm/list?surl=" + availableURLs[i];		
		$.support.cors = true;
		$.ajax({
			url : urlEndp,
			type : "GET",
			dataType : 'json',
			xhrFields : {
				withCredentials : true
			},			
			success : function(data2, status) {	
				ok++;
				console.log("Total: " + (1*(ok+bad+bad403+bad404+bad419+bad500+bad503+bad400))+ ". ok: " + ok + ", bad : " + bad + ", bad400 : " + bad400 +", bad403 : " + bad403 +", bad404 : " + bad404 +", bad419 : " + bad419 +", bad500 : " + bad500 +", bad503 : " + bad503 + ". " + (ok/(ok+bad))*100  + " success");			
			},
			error : function(jqXHR, textStatus, errorThrown) {
				if (jqXHR.status == 403){
					bad403++;
				} else if (jqXHR.status == 400){
					bad400++;	
				} else if (jqXHR.status == 404){
					bad404++;
				} else if (jqXHR.status == 419){
					bad419++;	
				} else if (jqXHR.status == 500){
					bad500++;
				} else if (jqXHR.status == 503){
					bad503++;
				} else {
					console.log("Other error status: " + jqXHR.status);
					bad++;
				}				
				console.log("Total: " + (1*(ok+bad+bad403+bad404+bad419+bad500+bad503+bad400))+ ". ok: " + ok + ", bad : " + bad + ", bad400 : " + bad400 + ", bad403 : " + bad403 +", bad404 : " + bad404 +", bad419 : " + bad419 +", bad500 : " + bad500 +", bad503 : " + bad503 + ". " + (ok/(ok+bad))*100  + " success");					
			}
		});
	}
}

function getDomain(url){
	 //httpg://duck-03.biocomp.unibo.it:8444/srm/manag?SFN=/dteam
	var d = url.split(":");
	var comp = d[1].split(".");
	var dom = "";
	for (var i=1; i<comp.length; i++){
		dom = dom + "." + comp[i];
	}
	return dom;
}

function getHost(url){
	 //httpg://duck-03.biocomp.unibo.it:8444/srm/manag?SFN=/dteam
	var d = url.split(":");
	return d[1].substring(2, d[1].length);
}

function loadEPList(ep, availableURLs){
	$( "#" + ep ).autocomplete({
		source: availableURLs,
		minLength: 2
	});
}

function getStorageOption(currentSelect, loginDiv, loginForm, contentDiv, loginIndicator, CSName, inputTextbox, loadButton, container, containerTable, indicator, stateText, filter){
	$('#' + loginDiv).hide();
	$('#' + contentDiv).show();
	
	if (currentSelect.selectedIndex > 0){ 
		// Cloud storage, not Grid SE
		//currentSelect.selectedData.text;
		
		$('#' + inputTextbox).prop('readonly', true);
		$('#' + loadButton).prop("disabled",true);
		
		$('#lfcregistration').prop("disabled",true);
		$('#checksum').prop("disabled",true);
		$('#lfcendpoint').prop("disabled",true);
		
		if ((getUrlVars()["service"] != currentSelect.selectedData.text.toLowerCase()) &&
				($('#' + CSName).val().toLowerCase() != currentSelect.selectedData.text.toLowerCase())){
			//clearContentTable(containerTable, container, indicator, stateText);
			$('#' + loginDiv).show();
			$('#' + contentDiv).hide();
			$('#' + loginIndicator).hide();
			$('#' + loginForm).show();
		} else{
			if (getUrlVars().length > 1){
				var factory = new CSFactory();
				var cs = factory.createCS(getUrlVars()["service"]);		
				cs.getCSAccess(loginDiv, contentDiv, "/", container, containerTable, indicator, stateText, filter, inputTextbox, CSName);
			} else {
				getCSFolderContent(loginDiv, contentDiv, currentSelect.selectedData.text.toLowerCase(), inputTextbox, container, containerTable, indicator, stateText, "/", filter, CSName);
			}	
		}		
	} else {		
		if ((getUrlVars()["service"] != null) || ($('#' + CSName).val() != "Grid SE")){
			clearContentTable(containerTable, container, indicator, stateText);				
			$('#' + inputTextbox).val('');
			$('#' + inputTextbox).attr("placeholder", "Endpoint path");
		}		
		$('#' + inputTextbox).prop('readonly', false);
		$('#' + loadButton).prop("disabled",false);
		$('#lfcregistration').prop("disabled",false);
                $('#checksum').prop("disabled",false);
		$('#lfcendpoint').prop("disabled",false)
	}
	$('#' + CSName).val(currentSelect.selectedData.text.toLowerCase());
}

function getLoginCS(CSName, loginDiv, contentDiv, loginForm, loadingPanel, path, container, containerTable, indicator, stateText, filter, endpointInput){
	var factory = new CSFactory();

	var cs = factory.createCS(CSName);
	showRemoteLoader(loginForm, loadingPanel);		
	//cs.getAuthRequest();			
	cs.getCSAccess(loginDiv, contentDiv, path, container, containerTable, indicator, stateText, filter, endpointInput, CSName);
}

function showRemoteLoader(loginForm, loadingPanel){
	$('#' + loginForm).hide();
	$('#' + loadingPanel).show();
} 

function hideRemoteLoader(loginForm, loadingPanel){
	$('#' + loginForm).hide();
	$('#' + loadingPanel).hide();
} 

//=====================================================================
// Methods for Cloud storages
//=====================================================================
function checkCSState(combo, storageDiv, loginForm, loadingLoginPanel, loginPanel,  container, containerTable, indicator, stateText, filter, endpointInput, CSName){
	//Check if there are url parameters
	if (getUrlVars()["service"] != null){
		if (getUrlVars()["service"] == "dropbox"){			
			$('#' + combo).ddslick('select', {index: 1 });				
			$('#' + loginPanel).hide();
			$('#' + storageDiv).show();
			$('#' + indicator).show();
			$('#' + container).hide();
			$('#' + filter).val('');
		}
	}
}

function loadCSFolder(loginDiv, contentDiv, data, path, container, containerTable, indicator, stateText, filter, endpointInput, CSName){
//function loadFolder(endpointInput, container, containerTable, elements, indicator, stateText, filter){
	$('#' + endpointInput).val(data.path); 

	clearContentTable(containerTable, container, indicator, stateText);	
	if (data.path != "/"){
		var previousUrl = getCSPreviousPath(data.path);		
		var row = [];
		row.push("<tr value='previous' onclick=\"getCSFolderContent('" + loginDiv + "','" + contentDiv + "','" + CSName.toLowerCase() + "','" + endpointInput + "','" + container + "','" + containerTable + "','" + indicator + "','" + stateText + "','" + previousUrl + "','" + filter + "','" + CSName +"')\">" + 
		   "<td><i class='glyphicon glyphicon-circle-arrow-up'/>&nbsp;..</td><td></td><td></td><td></td></tr>");
		$('#' + containerTable +' > tbody:last').append(row.join(""));
	}	
	for (var i=0; i<data.contents.length; i++){
		var icon = "";
		var t_row = [];
		var cur = data.contents[i]; 
		if (cur.path == "/.directory")
			continue;
		var filePath = cur.path.substring(cur.path.lastIndexOf("/")+1, cur.path.lenght); 
		if (cur.is_dir == true){
			icon ="glyphicon glyphicon-folder-close";
			t_row.push("<tr value='" + cur.path  + "' onclick=\"getCSFolderContent('" + loginDiv + "','" + contentDiv + "','" + CSName.toLowerCase() + "','" + endpointInput + "','" + container + "','" + containerTable + "','" + indicator + "','" + stateText + "','" + cur.path.trim() + "','" + filter + "','" + CSName + "')\">");
			t_row.push('<td title="' + filePath + '"><i class="' + icon + '"/>&nbsp;' + getPrintableFileName(filePath.trim()) + '</td>');
		} else {
			icon ="glyphicon glyphicon-file";	
			t_row.push('<tr value="' + cur.path + '">');
			t_row.push('<td title="' + filePath + '"><i class="' + icon + '"/>&nbsp;' + getPrintableFileName(filePath.trim()) + '</td>');
		}
		t_row.push('<td>&nbsp;-&nbsp;</td>');
		t_row.push('<td>' + getDropboxDate(cur.modified) + '</td>');
		t_row.push('<td id=' + cur.bytes + '>' + getReadableFileSizeString(cur.bytes) + '</td>');
		
		t_row.push('</tr>'); 
		$('#' + containerTable +' > tbody:last').append(t_row.join(""));
	}
	$("#" + stateText).text(($('#' + endpointInput).val()).trim());
	$("#" + containerTable + " tbody").finderSelect("update");
	$('#' + loginDiv).hide();
	$('#' + contentDiv).show();	
}

function getCSPreviousPath(path) {
	if (path.slice(-1) != "/")
		path = path + "/";
	var dataPa = path.split("/");
	var np = "";
	for (var i=1; i<dataPa.length-2; i++ ){
		np = np + "/" + dataPa[i];
	}
	if (np == "")
		return "/";
	return np;
}

function getDropboxDate(ddate){
	return ddate.substring(5,11) + " " + ddate.substring(17,22); 
}

function getCSFolderContent(loginDiv, contentDiv, service, endpointInput, container, containerTable, indicator, stateText, folder, filter, CSName){
	//setInputPath(endpointInput, folder);
	$('#' + indicator).show();
	$('#' + container).hide();
	$("#" + endpointInput).val(folder);
	var factory = new CSFactory();
	var cs = factory.createCS(service);
	cs.getContent(loginDiv, contentDiv, folder, container, containerTable, indicator, stateText, filter, endpointInput, CSName);		
}

function getCSDataTransfer(origFolder, destFolder, selectedFiles, CSName) {
	var theData = {};
	theData["files"] = [];       	      	  
	for (var i=0; i<selectedFiles.length; i++){
		var files = {};
		files["sources"] = [];
		if (document.getElementById(origFolder).value.trim().lastIndexOf("/", 0) === 0){
			//Cloud storage
			var dList = [];
			dList[0] = encodeURI(CSName + "://www.dropbox.com" + selectedFiles[i]); 
			files["sources"] = dList;
		} else {
			//Grid SE
			files["sources"] = getFullPath(getFileNameFromURL(selectedFiles[i]), document.getElementById(origFolder).value.trim());
		}
		files["destinations"] = [];
		if (document.getElementById(destFolder).value.trim().lastIndexOf("/", 0) === 0){
			//Cloud storage
			var dList = [];
			dList[0] = CSName + "://www.dropbox.com";
			if (document.getElementById(destFolder).value.trim() == "/")
				dList[0] += document.getElementById(destFolder).value.trim() + selectedFiles[i]; 
			else 
				dList[0] += document.getElementById(destFolder).value.trim() + "/" + selectedFiles[i];
			dList[0] = encodeURI(dList[0]);
			files["destinations"] = dList;
		} else {
			//Grid SE
			files["destinations"] = getFullPath(getFileNameFromURL(selectedFiles[i]), document.getElementById(destFolder).value.trim());
		}		
		theData["files"].push(files);
	}
	theData["params"] = {};
	if ((document.getElementById(destFolder).value.trim().lastIndexOf("/", 0) === 0)
			|| (document.getElementById(origFolder).value.trim().lastIndexOf("/", 0) === 0)){
		//Cloud storage
		theData["params"].credential = CSName;
	}
	theData["params"].overwrite = $('#overwrite').prop('checked');	
	  
	return theData;	
}

