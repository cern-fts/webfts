function createFolder(basePath, folder, side){
        var urlEndp = "/api/fts3/dir";
        var theData = {};
        theData["base"] = encodeURI(basePath);
        theData["dir_name"] = encodeURI(folder);
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
        var urlEndp = "/api/fts3/dir";
        var theData = {};
        theData["surl"] = encodeURI(endpoint);
        dataString= JSON.stringify(theData);
        console.log(dataString);
        $.support.cors = true;
        $.ajax({
                url : urlEndp,
                type : "DELETE",
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
        var urlEndp = "/api/fts3/file";
        var theData = {};
        theData["surl"] = encodeURI(endpoint);
        dataString= JSON.stringify(theData);
        console.log(dataString);
        $.support.cors = true;
        $.ajax({
                url : urlEndp,
                type : "DELETE",
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
        var urlEndp = "/api/fts3/rename";
        var theData = {};
        theData["base"] = encodeURI(base);
        theData["old"] = encodeURI(old);
        theData["new"] = encodeURI(newname);
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
