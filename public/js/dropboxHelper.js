function Dropbox(){ 
	this.dropboxEndpoint = "https://www.dropbox.com/1";
	/*this.dropboxApi = "https://api.dropbox.com/1";
	this.dropboxApiContent = "https://api-content.dropbox.com/1";*/

	this.getCSAccess = function(loginDiv, contentDiv, path, container, containerTable, indicator, stateText, filter, endpointInput, CSName){
		//Step 1: check if the user has asked for access
		var urlE = sessionStorage.ftsRestEndpoint + "/cs/access_request/dropbox";
		$.support.cors = true;
		$.ajax({
			url : urlE,
			type : "GET",
			dataType : 'json',
			xhrFields : {
				withCredentials : true
			},
			success : function(data1, status) {				
				//Check if user has already access
				var urlE = sessionStorage.ftsRestEndpoint + "/cs/registered/dropbox";
				$.support.cors = true;
				$.ajax({
					url : urlE,
					type : "GET",
					dataType : 'json',
					xhrFields : {
						withCredentials : true
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
		$.support.cors = true;
		$.ajax({
			url : urlEndp,
			type : "GET",
			//dataType : 'json',
			xhrFields : {
				withCredentials : true
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
		$.support.cors = true;
		$.ajax({
			url : urlEndp,
			//dataType : 'text',
			type : "GET",
			//dataType : 'json',
			xhrFields : {
				withCredentials : true
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

	 this.removeAccessTokens = function (loginDiv, CSName,contentDiv,loginForm,loadingPanel){
                var urlEndp = sessionStorage.ftsRestEndpoint + "/cs/access_grant/dropbox";
                $.support.cors = true;
                $.ajax({
                        url : urlEndp,
                        type : "DELETE",
                        xhrFields : {
                                withCredentials : true
                        },
                        success : function(data1, status) {
                                console.log("Tokens removed successfuly");
				sessionStorage.removeItem("csLogin");
				$('#' + loginForm).show();
				$('#' + loginDiv).show();
				$('#' + contentDiv).hide();
				$('#' + loadingPanel).hide();
				hideRevokeCSModal();

                        },
                        error : function(jqXHR, textStatus, errorThrown) {
                                showError(jqXHR, textStatus, errorThrown, "Error removing tokens. ");
                        	hideRevokeCSModal();
			}
                });
        };

	
	this.getContent = function (loginDiv, contentDiv, path, container, containerTable, indicator, stateText, filter, endpointInput, CSName){			
		var urlEndp = sessionStorage.ftsRestEndpoint + "/cs/remote_content/dropbox?surl=" + path; //+ "/metadata/dropbox" + path + "?list=true";
		/*if (path == "/")
			urlEndp += "null";
		else
			urlEndp += encodeURIComponent(path);*/
		$.support.cors = true;
		$.ajax({
			url : urlEndp,
			type : "GET",
			dataType : 'json',
			processData : false,
			xhrFields : {
				withCredentials : true
			},
			success : function(data1, status) {								
				loadCSFolder(loginDiv, contentDiv, data1, path, container, containerTable, indicator, stateText, filter, endpointInput, CSName);				
			},
			error : function(jqXHR, textStatus, errorThrown) {
				showError(jqXHR, textStatus, errorThrown, "Error connecting to Dropbox to load files. ");
			}
		});
	};
	
}
