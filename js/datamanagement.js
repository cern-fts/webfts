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
			if (side == 'left')
			   refreshFiles();
			else
                           $('#load-'+side).trigger("click");
			$('#createFolderPath').val("");
                },
                error : function(jqXHR, textStatus, errorThrown) {
                        showError(jqXHR, textStatus, errorThrown, "Error creating the folder: "+ newurl );
			 $('#createFolderPath').val("");
			hideDatamanagementModal();
                }
        });
}

function removeFolder(endpoint, side){
        var urlEndp = sessionStorage.ftsRestEndpoint + "/dm/rmdir";
        var theData = {};
        theData["surl"] = encodeURI(endpoint);
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
                        console.log("folder removed");
                        hideDatamanagementModal();
			if (side == 'left')
                           refreshFiles();
                        else
                           $('#load-'+side).trigger("click");
                },
                error : function(jqXHR, textStatus, errorThrown) {
                        showError(jqXHR, textStatus, errorThrown, "Error removing the folder: "+ endpoint );
                        hideDatamanagementModal();
                }
        });
}


function removeFile(endpoint, side){
	var urlEndp = sessionStorage.ftsRestEndpoint + "/dm/unlink";
        var theData = {};
        theData["surl"] = encodeURI(endpoint);
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
                        console.log("file removed");
                        hideDatamanagementModal();
			if (side == 'left')
                           refreshFiles();
                        else
                           $('#load-'+side).trigger("click");
                },
                error : function(jqXHR, textStatus, errorThrown) {
                        showError(jqXHR, textStatus, errorThrown, "Error removing the file : "+ endpoint );
                        hideDatamanagementModal();
                }
        });
}

function rename(base, old, newname, side){
        var urlEndp = sessionStorage.ftsRestEndpoint + "/dm/rename";
        var theData = {};
        theData["old"] = encodeURI(base+old);
	theData["new"] = encodeURI(base+newname);
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
                        console.log("file renamed");
                        hideDatamanagementModal();
			 if (side == 'left')
                           refreshFiles();
                        else
                           $('#load-'+side).trigger("click");
                },
                error : function(jqXHR, textStatus, errorThrown) {
                        showError(jqXHR, textStatus, errorThrown, "Error renaming the file : "+ old );
                        hideDatamanagementModal();
                }
        });
}
