function Dropbox(){
	this.dropboxEndpoint = "https://www.dropbox.com/1";
	/*this.dropboxApi = "https://api.dropbox.com/1";
	this.dropboxApiContent = "https://api-content.dropbox.com/1";*/

	this.getCSAccess = function(loginDiv, contentDiv, path, container, containerTable, indicator, stateText, filter, endpointInput, CSName){
		//Step 1: check if the user has asked for access
		var urlE = sessionStorage.ftsRestEndpoint + "/cs/access_request/dropbox";
		var header = getAuthzHeader();
		var useCredentials =  (header == "");
		$.support.cors = true;
		$.ajax({
			url : urlE,
			type : "GET",
			headers : header,
			dataType : 'json',
			xhrFields : {
				withCredentials : useCredentials
			},
			success : function(data1, status) {				
				//Check if user has already access
				var urlE = sessionStorage.ftsRestEndpoint + "/cs/registered/dropbox";
				$.support.cors = true;
				$.ajax({
					url : urlE,
					type : "GET",
					headers : header,
					dataType : 'json',
					xhrFields : {
						withCredentials : useCredentials
					},
					success : function(data1, status) {
						if (data1 == null || data1 != true){
							//Request tokens requested, but not access tokens yet
							new Dropbox().getAccessTokens(loginDiv, contentDiv, path, container, containerTable, indicator, stateText, filter, endpointInput, CSName);
						} else {
							new Dropbox().getContent(loginDiv, contentDiv, path, container, containerTable, indicator, stateText, filter, endpointInput, CSName);
						}
					},
					error : function(jqXHR, textStatus, errorThrown) {
						showError(jqXHR, textStatus, errorThrown, "Error checking if the user has access granted. ");
					}
				});				
			},
			error : function(jqXHR, textStatus, errorThrown) {
				if (jqXHR.status == "404"){
					new Dropbox().getRequestTokens();
				}else {
					showError(jqXHR, textStatus, errorThrown, "Error checking if Dropbox is supported. ");
				}	
			}
		});
	};
	
	this.getRequestTokens = function (){		
		var urlEndp = sessionStorage.ftsRestEndpoint + "/cs/access_request/dropbox/request";
		var ep = this.dropboxEndpoint;
		var header = getAuthzHeader();
                var useCredentials =  (header == "");
		$.support.cors = true;
		$.ajax({
			url : urlEndp,
			type : "GET",
			headers : header,
			//dataType : 'json',
			xhrFields : {
				withCredentials : useCredentials
			},
			success : function(data1, status) {				
				var urlAuth = ep + "/oauth/authorize?oauth_token=" + data1.split('&')[1].split('=')[1] + "&oauth_callback=" + encodeURIComponent(document.URL+"?service=dropbox");
				console.log(urlAuth);
				$(location).attr('href',urlAuth);
			},
			error : function(jqXHR, textStatus, errorThrown) {
				showError(jqXHR, textStatus, errorThrown, "Error obtaining request tokens. ");
			}
		});
	};
	
	this.getAccessTokens = function (loginDiv, contentDiv, path, container, containerTable, indicator, stateText, filter, endpointInput, CSName){		
		var urlEndp = sessionStorage.ftsRestEndpoint + "/cs/access_grant/dropbox";
		var header = getAuthzHeader();
		var useCredentials =  (header == "");
		$.support.cors = true;
		$.ajax({
			url : urlEndp,
			//dataType : 'text',
			type : "GET",
			headers : header,
			xhrFields : {
				withCredentials : useCredentials
			},
			success : function(data1, status) {				
				console.log("Tokens obtained successfuly");	
				new Dropbox().getContent(loginDiv, contentDiv, path, container, containerTable, indicator, stateText, filter, endpointInput, CSName);
			},
			error : function(jqXHR, textStatus, errorThrown) {
				showError(jqXHR, textStatus, errorThrown, "Error obtaining request tokens. ");
			}
		});
	};
	
	this.getContent = function (loginDiv, contentDiv, path, container, containerTable, indicator, stateText, filter, endpointInput, CSName){			
		var urlEndp = sessionStorage.ftsRestEndpoint + "/cs/remote_content/dropbox?surl=" + path; //+ "/metadata/dropbox" + path + "?list=true";
		var header = getAuthzHeader();
		var useCredentials =  (header == "");
		$.support.cors = true;
		$.ajax({
			url : urlEndp,
			type : "GET",
			headers : header,
			dataType : 'json',
			processData : false,
			xhrFields : {
				withCredentials : useCredentials
			},
			success : function(data1, status) {								
				loadCSFolder(loginDiv, contentDiv, data1, path, container, containerTable, indicator, stateText, filter, endpointInput, CSName);				
			},
			error : function(jqXHR, textStatus, errorThrown) {
				showError(jqXHR, textStatus, errorThrown, "Error connecting to Dropbox to load files. ");
			}
		});
	};
	
	//this.submit = function (fileList, urlList, destFolder){		
	//	runDataTransfer($('#delegation_id').val(), getCSDataTransfer(destFolder, selectedFiles, "dropbox"));
	//};
	//================================================"
/*	
	this.getAuthRequest = function(){
		var ep = this.dropboxEndpoint;
		var cb = this.callbackUrl;
		var urlEndp = ep + '/oauth/request_token';
		$.support.cors = true;
		$.ajax({
			url : urlEndp,
			headers : { 'Authorization' : 'OAuth oauth_version="1.0", oauth_signature_method="PLAINTEXT", oauth_consumer_key="' + this.app_key + '", oauth_signature="' + this.app_secret + '"' },	
			type : "POST",
			success : function(data1, status) {
				//console.log("Connected: " + data1);
				//TODO: request_secret_token, called rst, should not be here. Should be kept secret!!!!!!!!!!!!!!!!!!!!!!!!!!! Only for testing.
				var urlAuth = ep + "/oauth/authorize?oauth_token=" + data1.split('&')[1].split('=')[1] + "&oauth_callback=" + encodeURIComponent(cb + "?service=dropbox&rst=" + data1.split('&')[0].split('=')[1]);
				console.log("request_secret_token=" + data1.split('&')[0].split('=')[1]);
				console.log(urlAuth);
				$(location).attr('href',urlAuth);
			},
			error : function(jqXHR, textStatus, errorThrown) {
				showError(jqXHR, textStatus, errorThrown, "Error connecting to Dropbox to obtain auth tokens. ");
			}
		});
	};

	this.getAccessRequest = function (oauth_token, request_secret_token){
		var cb = this.callbackUrl;
		var urlEndp = this.dropboxEndpoint + '/oauth/access_token';
		$.support.cors = true;
		$.ajax({
			url : urlEndp,
			headers : { 'Authorization' : 'OAuth oauth_version="1.0", oauth_signature_method="PLAINTEXT", oauth_consumer_key="' + this.app_key + '", oauth_token="' + oauth_token + '", oauth_signature="' + this.app_secret + request_secret_token + '"'},		
			type : "POST",
			success : function(data1, status) {
				console.log(data1);
				var urlAuth = cb + "?service=dropbox&" + data1;
				console.log(urlAuth);
				$(location).attr('href',urlAuth);
			},
			error : function(jqXHR, textStatus, errorThrown) {
				showError(jqXHR, textStatus, errorThrown, "Error connecting to Dropbox to obtain access tokens. ");
			}
		});
	};
	
	this.getMetadata = function (oauth_token, oauth_token_secret, path, container, containerTable, indicator, stateText, filter, endpointInput){		
		var urlEndp = this.dropboxApi + '/metadata/dropbox' + path + "?list=true";
		$.support.cors = true;
		$.ajax({
			url : urlEndp,
			//dataType : 'json',
			headers : { 'Authorization' : 'OAuth oauth_version="1.0", oauth_signature_method="PLAINTEXT", oauth_consumer_key="' + this.app_key + '", oauth_token="' + oauth_token + '", oauth_signature="' + this.app_secret + oauth_token_secret + '"'},		
			type : "GET",
			dataType : 'json',
			success : function(data1, status) {				
				//console.log("Sucess loaded content: " + data1);				
				//return data1;
				loadCSFolder(data1, path, container, containerTable, indicator, stateText, filter, endpointInput);
			},
			error : function(jqXHR, textStatus, errorThrown) {
				showError(jqXHR, textStatus, errorThrown, "Error connecting to Dropbox to load files. ");
			}
		});
	};
	
	this.getShareLinkAndSubmit = function (oauth_token, oauth_token_secret, fileList, urlList, destFolder){		
		//var urlEndp = this.dropboxApi + '/shares/dropbox' + fileList[0] + "?short_url=true";
		var urlEndp = this.dropboxApi + '/media/dropbox' + fileList[0] ;
		$.support.cors = true;
		$.ajax({
			url : urlEndp,
			dataType : 'json',
			headers : { 'Authorization' : 'OAuth oauth_version="1.0", oauth_signature_method="PLAINTEXT", oauth_consumer_key="' + this.app_key + '", oauth_token="' + oauth_token + '", oauth_signature="' + this.app_secret + oauth_token_secret + '"'},		
			type : "POST",			
			success : function(data1, status) {				
				fileList.splice(0, 1);
				urlList.push(data1);
				var factory = new CSFactory();
		    	var cs = factory.createCS("dropbox");				
				if (fileList.length == 0){
					//All urls obtained. Submit!
					var selectedFiles = [];
					for (var i=0; i<urlList.length; i++){
						selectedFiles.push(urlList[i].url);
					}
					//TODO: sacar el directorio de ortigen y borrar dicho directorio del path de los files
					var myData = getCSDataTransfer(destFolder, selectedFiles);
					runDataTransfer($('#delegation_id').val(), myData);
				} else {
					cs.getShareLinkAndSubmit(oauth_token, oauth_token_secret, fileList, urlList, destFolder);
				}	
			},
			error : function(jqXHR, textStatus, errorThrown) {
				showError(jqXHR, textStatus, errorThrown, "Error connecting to Dropbox to load files. ");
			}
		});
	};
	
	this.uploadFile = function (oauth_token, oauth_token_secret, file, fileName, destFolder, overwrite){		
		//var urlEndp = this.dropboxApi + '/shares/dropbox' + fileList[0] + "?short_url=true";
		var urlEndp = this.dropboxApiContent + '/files_put/dropbox' + destFolder + fileName +"?overwrite=" + overwrite;
		$.support.cors = true;
		$.ajax({
			url : urlEndp,
			dataType : 'json',
			data: file,
			headers : { 'Authorization' : 'OAuth oauth_version="1.0", oauth_signature_method="PLAINTEXT", oauth_consumer_key="' + this.app_key + '", oauth_token="' + oauth_token + '", oauth_signature="' + this.app_secret + oauth_token_secret + '"'},		
			type : "PUT",			
			success : function(data1, status) {				
//				fileList.splice(0, 1);
//				urlList.push(data1);
//				var factory = new CSFactory();
//		    	var cs = factory.createCS("dropbox");				
//				if (fileList.length == 0){
//					//All urls obtained. Submit!
//					var selectedFiles = [];
//					for (var i=0; i<urlList.length; i++){
//						selectedFiles.push(urlList[i].url);
//					}
//					//TODO: sacar el directorio de ortigen y borrar dicho directorio del path de los files
//					var myData = getCSDataTransfer(destFolder, selectedFiles);
//					runDataTransfer($('#delegation_id').val(), myData);
//				} else {
//					cs.getShareLinkAndSubmit(oauth_token, oauth_token_secret, fileList, urlList, destFolder);
//				}	
				
			},
			error : function(jqXHR, textStatus, errorThrown) {
				showError(jqXHR, textStatus, errorThrown, "Error connecting to Dropbox to load files. ");
			}
		});
	};*/
}
