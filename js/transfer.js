function runTransfer(container, destFolder){	  
      var sourceList = getSelectedFiles(container);
      if (sourceList.length > 0){
	      theData = {
	    		   		"files":[
	    		            {
	    		               "sources":[
	    		                  sourceList
	    		               ],
	    		               "destinations":[
	    		                  document.getElementById(destFolder).value
	    		               ],
	    		            }
	    		         ],
	    		         "params":{}
	    		      };      
	      runDataTransfer(theData);
      }
      //ftsTransferRequest(theData, userPrivatePEM, userPEMPass, userDN);
      return false;
}

function activateTransferButton(epTable, buttonToActivate, endPoint){
	if ((getSelectedFiles(epTable).length > 0) && ($('#' + endPoint).text().length > 0)){ 
		$('#' + buttonToActivate).removeAttr("disabled");
	} else {
		$('#' + buttonToActivate).attr('disabled','disabled');
	}
}

function addTransmissionLine(tableId,fromPath, type, toPath){		
	var line ='<tr><td><input type="checkbox" class="transferCheckId" value=' 
			+ fromPath + '@@@TO@@@' + toPath + ' id="transferCheckId">&nbsp;' + fromPath + '&nbsp;<i class="glyphicon glyphicon-arrow-right"/>&nbsp;';
	
	if (type === "folder"){
		line += '<i class="glyphicon glyphicon-folder-close"/>';
	} else {
		line += '<i class="glyphicon glyphicon-file"/>';
	}
	line += '&nbsp;<i class="glyphicon glyphicon-arrow-right"/>&nbsp;<span style=" vertical-align: middle;">' + toPath; 
	$('#' + tableId + ' > tbody:last').append(line);
	updateNumber();	
	checkTableVisibility();		
}

function showRemainingProxyTime(timeText){
	$('#proxyTimeSpan').text("Your current proxy is still valid for " + timeText);	
}

function loadFolder(endpointpath, container, containerTable, elements, indicator, stateText){
	$("#" + containerTable + " > tbody").html("");
	$('#' + container).show();
	$('#' + indicator).hide();	
	for (var i = 0; i < elements.length; i++)
	{
		if (elements[i].slice(-1) == "/"){
			$('#' + containerTable +' > tbody:last').append('<tr value="' +elements[i].slice(-1) + '"><td><i class="glyphicon glyphicon-folder-close"/>&nbsp;' + elements[i].slice(-1) + '</td></tr>');
		} else {
			$('#' + containerTable +' > tbody:last').append('<tr value="' +elements[i] + '"><td><i class="glyphicon glyphicon-file"/>&nbsp;' + elements[i] + '</td></tr>');
		}
	}
	var ep = endpointpath.split(':');
	var eptext = "";
	for (var i=1; i< ep.length; i++){
		eptext += ep[i];
	}
	$("#" + stateText).text("Content of " + eptext);	
}

function renderFolderContent(tableId, countId){
    // Initialise the Demo with the Ctrl Click Functionality as the Default
    $("#" + tableId + " tbody").finderSelect({enableDesktopCtrlDefault:true, totalSelector:"."+countId , selectClass:'label-info'});   
    $("#" + tableId + " > tbody").html("");
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
	var selectedList = "";
	var selectedEle = $("#" + container + " tbody").finderSelect('selected');
	for (var i = 0; i < selectedEle.length; i++){
		if (i==0){
			selectedList = selectedEle[i].attributes.value.nodeValue;  
		} else {
			selectedList += ',' + selectedEle[i].attributes.value.nodeValue;
		}
	}
	return selectedList;
}

function getEPContent(endpointInput, container, containerTable, indicator, stateText){	
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