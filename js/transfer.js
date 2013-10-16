function runTransfer(){
      console.log("Call to FTS");
      
      theData = {
                   "files": [
                        {
                            "sources": [
                                 "http://lxfsra04a04.cern.ch/dpm/cern.ch//home/dteam/5281"
                            ],
                            "destinations": [
                                 "http://lxfsra10a01.cern.ch/dpm/cern.ch/home/dteam/andresTest"
                            ]
                        }
                      ],
                   "params": {
                      }
                };

      var userPrivatePEM = document.getElementById('pemPkey').value;
      var userPEMPass = document.getElementById('pemPass').value;
      var userDN = document.getElementById('userDN').value;
      ftsTransferRequest(theData, userPrivatePEM, userPEMPass, userDN);
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
}
