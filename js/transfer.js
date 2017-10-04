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

function runTransfer(container, origFolder, destFolder, CSLeftSelect){
	if (sessionStorage.remainingProxyLifetime && parseInt(sessionStorage.remainingProxyLifetime) < 3600*1000*2 ){//2 hours 
		$("#warningTransferButton").click({c: container, o: origFolder, d: destFolder, s:CSLeftSelect}, function(e) {
			executeTransfer(e.data.c, e.data.o, e.data.d, e.data.s);
			$("#expirationModal").modal('hide');
		});
		$("#doDelegateButton").click(function(e) {
              		showDelegateModal(); 
			$("#expirationModal").modal('hide');
                });
					
		$("#expirationModal").modal('show');
	} else {
		executeTransfer(container, origFolder, destFolder, CSLeftSelect);
	}	
}


function executeTransfer(container, origFolder, destFolder, CSLeftSelect){
    hideUserReport();
    var selectedFiles = getSelectedFiles(container);
    if (selectedFiles.length > 0){
        var optionSelected = $('#' + CSLeftSelect).data('ddslick');
        if (optionSelected.selectedIndex == 1){ //Dropbox
            runDataTransfer($('#delegation_id').val(), getCSDataTransfer(origFolder, destFolder, selectedFiles, optionSelected.selectedData.text.toLowerCase()));}
        else {
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

function runTransferFromURL(container, url, destFolder) {
    hideUserReport();

    var theData = {};
    theData["files"] = [];

    var files = {};
    files["sources"] = [];
    var sList = [];
    sList[0] = url;
    files["sources"] = sList;
    files["destinations"] = [];
    files["destinations"] = getFullPath(sList, document.getElementById(destFolder).value.trim());
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
	if (oNumber<100000 && oNumber !=  0){
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
		var perm_td = "";
		var mtime_td = "";
		var size_td = "";
		var encodedFolder= encodeURI(index.slice(0,-1).trim());
                var encodedFile = encodeURI(index);

		if (index.slice(-1) == "/"){
			icon ="glyphicon glyphicon-folder-close";
			t_row.push("<tr title=\'folder\' value='" + encodedFolder + "' ondblclick=\"getNextFolderContent('" + endpointInput + "','" + container + "','" + containerTable + "','" + indicator + "','" + stateText + "','" + encodedFolder + "','" + filter + "')\">");
			t_row.push('<td title="' + encodedFolder + '"><i class="' + icon + '"/>&nbsp;' + getPrintableFileName(encodedFolder) + '</td>');
		} else {
			icon ="glyphicon glyphicon-file";	
			t_row.push('<tr title=\'file\' value="' + encodedFile + '">');
			t_row.push('<td title="' + encodedFile + '"><i class="' + icon + '"/>&nbsp;' + getPrintableFileName(encodedFile) + '</td>');
		}		
		$.each(value, function(e_index, e_value){
			if (e_index == 'mode'){
				perm_td = '<td>' + getPermissionsString(parseInt(e_value, 10).toString(8)) +'</td>'; //to octal
			} else if (e_index == 'mtime'){
				var fdate = new Date(e_value*1000);
				e_value = getFileDate(fdate);				
				mtime_td= '<td>' + e_value + '</td>';
			} else if (e_index == 'size'){				
				if (t_row[1].indexOf("folder") != -1){
					//The number of a folder means the number of elements. Not need to be converted
					size_td = '<td id=' + e_value + '> - </td>';
				} 
				else 
				{
					size_td = '<td id=' + e_value + '>' + getReadableFileSizeString(e_value) + '</td>';							
				}	
		  	}
		});
		t_row.push(perm_td);
		t_row.push(mtime_td);
                t_row.push(size_td);
		t_row.push('</tr>');
	        $('#' + containerTable +' > tbody:last').append(t_row.join(""));									
		});
 	$("#" + stateText).text(($('#' + endpointInput).val()).trim());
        $("#" + containerTable + " tbody").finderSelect("update");
      
   }


function getInitialRowContent(endpointInput, container, containerTable, indicator, stateText, filter){
	if (getPreviousUrl(($('#' + endpointInput).val()).trim()) != null){
		return "<tr title='../' value='previous' ondblclick=\"getPreviousFolderContent('" + endpointInput + "','" + container + "','" + containerTable + "','" + indicator + "','" + stateText + "','" + filter + "')\">" + 
			   "<td><i class='glyphicon glyphicon-circle-arrow-up'/>&nbsp;..</td><td></td><td></td><td></td></tr>";
	} else {
		return null;
	}
}

function renderFolderContent(tableId, countId, container, indicator, stateText){
        // Initialise with the Ctrl Click Functionality as the Default
        $("#" + tableId + " tbody").finderSelect({enableDesktopCtrlDefault:true, totalSelector:"."+countId , selectClass:'label-info'});
        $("#" + tableId + " tbody").finderSelect('addHook','highlight:after', function(element, options) { 
    	for (var i=0; i < element.length; i++){
    		//Avoid selecting elements outside the filters
    		if (($(element[i]).css("display") != null) && ($(element[i]).css("display") == "none")){
    			$(element[i]).removeClass(options.selectClass);
    			$(element[i]).addClass(options.unSelectClass);
    		}
    		//Do not select previous url button
    		if (element[i].firstChild.title == ""){
    			$(element[i]).removeClass(options.selectClass);
    			$(element[i]).addClass(options.unSelectClass);
    		}
    	}
    	});
	clearContentTable(tableId, container, indicator, stateText);
}

function selectAllFiles(container){ 
    	//Recusively filter the jquery object to get results.
        var files = $("#" + container + "  tbody").find("tr").filter(function (i,v) {
        	var $t = $(this);
        	if ($t.attr('title') == 'folder') {
			return true;
        	}
       		return false;

        }).hide();
	$("#" + container + " tbody").finderSelect('highlightAll');
	$("#" + container + " tbody").finderSelect("update");
}

function selectNoneFiles(container){ 
	$("#" + container + " tbody").find("tr").show();
	$("#" + container + " tbody").finderSelect('unHighlightAll');
	$("#" + container + " tbody").finderSelect("update");
}

function getSelectedFiles(container){
	var selectedList = [];
	var selectedEle = $("#" + container + " tbody").finderSelect('selected');
	for (var i = 0; i < selectedEle.length; i++){
		 if (selectedEle[i].attributes.title.value == "file")
			selectedList.push(selectedEle[i].attributes.value.value);  		
	}
	return selectedList;
}

function getSelected(container){
        var selectedList = [];
        var selectedEle = $("#" + container + " tbody").finderSelect('selected');
        for (var i = 0; i < selectedEle.length; i++){
		if (selectedEle[i].attributes.title.value == "folder")
                	selectedList.push(selectedEle[i].attributes.value.value+"/");
		else 
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
    	if ($t.attr('title') == 'folder' && hideFolders) {
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
    	if ($t.attr('title') == 'folder' && hideFolders) {
             return false;
        } else {
		var $filedate =  $t.children()[2].textContent
                var $tokens= $filedate.split(" ")
                for (var i=0; i<$tokens.length; i++){
                     if ($tokens[i].indexOf(':') > -1) {
                           $filedate = $filedate.replace($tokens[i],new Date().getFullYear())
                     }
                }
        	if (inputs[0].value !== ""){
        		if (Date.parse(inputs[0].value.trim()) <= Date.parse($filedate)){
        			if (inputs[1].value != ""){
        				if (Date.parse(inputs[1].value.trim()) >= Date.parse($filedate)){
        					return true;
    					}
        				return false;
        			}        			
        			return true;
        		}           	
        	} else if (inputs[1].value !== ""){
        		if (Date.parse($filedate) <= Date.parse(inputs[1].value.trim())){        			
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
    	var $r = $t.attr('title'); 
        if ($r == 'folder' && hideFolders) {
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
    	if ($t.attr('title') == 'folder' && hideFolders) {
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
	var currentDate = new Date();
	if (fdate.getFullYear().toString() != currentDate.getFullYear().toString()) {
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
 
function loadEndpointsList(){
	availableURLs = []
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", sessionStorage.endpointsUrl, true);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;                
                var availableURLs = allText.split('\n');
                for (var i=0; i<availableURLs.length; i++){
                	if (availableURLs[i].substring(0,5) == "httpg"){
                		availableURLs[i] = "srm" + availableURLs[i].substring(5, availableURLs[i].length);
                	} else {
                		availableURLs[i] = availableURLs[i].replace("?SFN=","");
                	}                	
                }
                availableURLs = applyTestingFilter(availableURLs);
				$( "#leftEndpoint" ).autocomplete({
					source: availableURLs,
					minLength: 2
				});
				$( "#rightEndpoint" ).autocomplete({
					source: availableURLs,
					minLength: 2
				});
	  }
        }
    }
 rawFile.send(null);
}

function applyTestingFilter(uArray){
	var found_set = {};
	var epurl = "";
	var newArray = [];
	for (var i=0; i<uArray.length; i++){
		epurl = uArray[i];
		if ((epurl == "") || (epurl.indexOf("UNDEFINED") != -1)) 
			continue;
		var ele = getFilter(epurl);		
		if (found_set[ele]){
			console.log(ele + " is already in the set");
		} else {
			found_set[ele] = true;
			newArray.push(epurl);
		}
	}
	console.log("The filtered array has " + newArray.length + " elements");
	return newArray;
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
	var d = url.split(":");
	var comp = d[1].split(".");
	var dom = "";
	for (var i=1; i<comp.length; i++){
		dom = dom + "." + comp[i];
	}
	return dom;
}

function getHost(url){
	var d = url.split(":");
	return d[1].substring(2, d[1].length);
}

function loadEPList(ep, availableURLs){
	$( "#" + ep ).autocomplete({
		source: availableURLs,
		minLength: 2
	});
}

function getStorageOption(currentSelect, localUpload, loginDiv, loginForm, contentDiv, loginIndicator, CSName, inputTextbox, loadButton, container, containerTable, indicator, stateText, filter,side){
	$('#' + loginDiv).hide();
	$('#' + localUpload).hide();
	$('#' + contentDiv).show();
	
	if (currentSelect.selectedIndex > 0){
		if (side == "left") {
            // Dropbox
            if (currentSelect.selectedIndex == 1) {
                $('#' + inputTextbox).prop('readonly', true);
                $('#' + loadButton).prop("disabled",true);

                $('#lfcregistration').prop("disabled",true);
                $('#checksum').prop("disabled",true);
                $('#lfcendpoint').prop("disabled",true);

                if ((getUrlVars()["service"] != currentSelect.selectedData.text.toLowerCase()) &&
                        ($('#' + CSName).val().toLowerCase() != currentSelect.selectedData.text.toLowerCase()) && !sessionStorage.csLogin ){
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
                // Local file upload
                $('#' + localUpload).show();
            }
            //CERNBOX
        } else {
			$('#' + inputTextbox).prop('readonly', true);
                	$('#' + loadButton).prop("disabled",true);
                	$('#lfcregistration').prop("disabled",true);
                	$('#checksum').prop("disabled",true);
                	$('#lfcendpoint').prop("disabled",true);
			//creating the path
			var pathFirst= sessionStorage.clientCN.substring(0,1);
			
			path = sessionStorage.cernboxBaseUrl+pathFirst+"/"+sessionStorage.clientCN;
			console.log(path);

			$('#' + inputTextbox).val(path);
			$('#' + loadButton).click();
			$("#" + stateText).text(($('#' + inputTextbox).val()).trim());
		}
	}  else {		
		if ((getUrlVars()["service"] != null) || ($('#' + CSName).val() != "Grid SE")){
			clearContentTable(containerTable, container, indicator, stateText);				
			$('#' + inputTextbox).val('');
			$('#' + inputTextbox).attr("placeholder", "Endpoint path");
		}		
		$('#' + inputTextbox).prop('readonly', false);
		$('#' + loadButton).prop("disabled",false);
		$('#lfcregistration').prop("disabled",false);
                $('#checksum').prop("disabled",false);
		$('#lfcendpoint').prop("disabled",false);
		$('#leftRemoveCSAccessBtn').hide();
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

function removeCSAccess(CSName, loginDiv,contentDiv, loginForm,loadingPanel){
        var factory = new CSFactory();

        var cs = factory.createCS(CSName);
        cs.removeAccessTokens(loginDiv,  CSName, contentDiv,loginForm,loadingPanel);
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
	$('#' + endpointInput).val(data.path); 

	sessionStorage.csLogin=1;
	clearContentTable(containerTable, container, indicator, stateText);	
	if (data.path != "/"){
		var previousUrl = getCSPreviousPath(data.path);		
		var row = [];
		row.push("<tr title='../' value='previous' ondblclick=\"getCSFolderContent('" + loginDiv + "','" + contentDiv + "','" + CSName.toLowerCase() + "','" + endpointInput + "','" + container + "','" + containerTable + "','" + indicator + "','" + stateText + "','" + previousUrl + "','" + filter + "','" + CSName +"')\">" + 
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
		var encodedPath= encodeURI(cur.path.trim());
		var encodedFilePath = encodeURI(filePath);
		if (cur.is_dir == true){
			icon ="glyphicon glyphicon-folder-close";
			t_row.push("<tr  title=\'folder\' value='" + encodedPath  + "' ondblclick=\"getCSFolderContent('" + loginDiv + "','" + contentDiv + "','" + CSName.toLowerCase() + "','" + endpointInput + "','" + container + "','" + containerTable + "','" + indicator + "','" + stateText + "','" + encodedPath + "','" + filter + "','" + CSName + "')\">");
			t_row.push('<td title="' + encodedFilePath + '\/"><i class="' + icon + '"/>&nbsp;' + getPrintableFileName(filePath.trim()) + '</td>');
		} else {
			icon ="glyphicon glyphicon-file";	
			t_row.push('<tr title=\'file\' value="' + encodedPath + '">');
			t_row.push('<td title="' + encodedFilePath + '"><i class="' + icon + '"/>&nbsp;' + getPrintableFileName(filePath.trim()) + '</td>');
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
	$('#leftRemoveCSAccessBtn').show();
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

