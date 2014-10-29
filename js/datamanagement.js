function createFolder(basePath, folder, side){
        var urlEndp = sessionStorage.ftsRestEndpoint + "/dm/mkdir";
	var newurl= basePath+folder;
	var theData = {};
        theData["surl"] = encodeURI(newurl); 
	dataString= JSON.stringify(theData);
	console.log(dataString);
        $.support.cors = true;
        $.ajax({
                url : urlEndp,
		type : "POST",
		contentType : "application/json",
                dataType : "json",
		data: dataString,
                processData : false,
		beforeSend : function(xhr) {
                        xhr.withCredentials = true;
                },
                xhrFields : {
                        withCredentials : true
                },
                success : function(data1, status) {
                        console.log("folder created");
			hideDatamanagementModal();
			$('#load-'+side).trigger("click");
                },
                error : function(jqXHR, textStatus, errorThrown) {
                        showError(jqXHR, textStatus, errorThrown, "Error creating the folder: "+ newurl );
			hideDatamanagementModal();
                }
        });
}

