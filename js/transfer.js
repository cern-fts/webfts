function runTransfer(){	  
      console.log("Call to FTS");
      
      theData = {
    		   "files":[
    		            {
    		               "sources":[
    		                  "http://lxfsra04a04.cern.ch/dpm/cern.ch//home/dteam/5281"
    		               ],
    		               "destinations":[
    		                  "http://lxfsra10a01.cern.ch/dpm/cern.ch/home/dteam/andresTest"
    		               ],
    		            "metadata": "User defined metadata",   
    		            "filesize": 1024,                      
    		            "checksum": 'adler32:1234',  
    		            }
    		         ],
    		         "params":{}
    		      };      
      runDataTransfer(theData);
      //ftsTransferRequest(theData, userPrivatePEM, userPEMPass, userDN);
      return false;
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

function checkTableVisibility(){
	 if ($('#transfersTable tr').length >0){
		 $('#selectedFiles').show();
	 }
}

function getLeft(){
	//TODO: add right path
	return '/left/path';	
}

function getRight(){
	//TODO: add right path
	return '/right/path';	
}

function getType(){
	//TODO: add right type
	var a = Math.floor((Math.random()*2));
	if (a == 0)
		return 'file';
	return 'folder';
}

function select(op){
	//op have to be true or false	
     $('.transferCheckId').each(function () {    	 
    	 $(this).prop('checked', op);                         
     });
}

function removeSelected(){
	$('.transferCheckId').each(function () {   		
   	 if ($(this).prop('checked')){
   		$(this).parent().parent().remove();
   	 }                            	 
    });
	updateNumber();
}

function updateNumber(){
	$('.filesNumber').text($('#transfersTable tr').length);
}

function showRemainingProxyTime(timeText){
	$('#proxyTimeSpan').text("Your current proxy is still valid for " + timeText);	
}

function loadFolder(container, containerTable, elements, indicator){
	$("#" + containerTable +" > tbody").html("");
	$('#'+container).show();
	$('#'+indicator).hide();	
	for (var i = 0; i < elements.length; i++)
	{
		if (elements[i].slice(-1) == "/"){
			$('#' + containerTable +' > tbody:last').append('<tr value="' +elements[i].slice(-1) + '"><td><i class="glyphicon glyphicon-folder-close"/>&nbsp;' + elements[i].slice(-1) + '</td></tr>');
		} else {
			$('#' + containerTable +' > tbody:last').append('<tr value="' +elements[i] + '"><td><i class="glyphicon glyphicon-file"/>&nbsp;' + elements[i] + '</td></tr>');
		}
	}
}

function renderFolderContent(tableId, countId){
    // Initialise the Demo with the Ctrl Click Functionality as the Default
    $('#' + tableId + ' tbody').finderSelect({enableDesktopCtrlDefault:true, totalSelector:"."+countId , selectClass:'label-info'});    
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
	var selectedEle = $("#" + container + " tbody").finderSelect('selected');
	for (var i = 0; i < selectedEle.length; i++){
		selectedEle[i].attributes.value.nodeValue;  //<-- How to get the value of each selected 
	}
}

function getEPContent(endpointInput, container, containerTable, indicator){	
	$('#'+indicator).show();
	$('#'+container).hide();
	getEndpointContent($('#' + endpointInput).val(), container, containerTable, indicator);
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