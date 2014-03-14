var supportText = "Please, try again and contact support if the error continues";
var dropboxEndpoint = "https://www.dropbox.com/1";
var callbackUrl = "https://webfts-dev.cern.ch:8446/submit.php";

var app_key="i83u62d392aazla";
var app_secret="zcaqcc8kcbim5na&";

function getDropboxAuthAndContent(){
	var urlEndp = dropboxEndpoint + '/oauth/request_token';
	$.ajax({
		url : urlEndp,
		headers : { 'Authorization' : 'OAuth oauth_version="1.0", oauth_signature_method="PLAINTEXT", oauth_consumer_key="' + app_key + '", oauth_signature="' + app_secret + '"' },	
		type : "POST",
		success : function(data1, status) {
			//console.log("Connected: " + data1);
			var urlAuth = dropboxEndpoint + "/oauth/authorize?oauth_token=" + data1.split('&')[1].split('=')[1] + "&oauth_callback=" + callbackUrl + "?service=dropbox";
			console.log(urlAuth);
			$(location).attr('href',urlAuth);
		},
		error : function(jqXHR, textStatus, errorThrown) {
			showError(jqXHR, textStatus, errorThrown, "Error connecting to Dropbox. "+ supportText);
		}
	});
}

function getDropboxContent(oauth_token){
	var urlEndp = dropboxEndpoint + '/oauth/access_token';
	$.ajax({
		url : urlEndp,
		headers : { 'Authorization' : 'OAuth oauth_version="1.0", oauth_signature_method="PLAINTEXT", oauth_consumer_key="' + app_key + '", oauth_token="' + oauth_token + '", oauth_signature="' + app_secret + '"<request-token-secret>"' },		
		type : "POST",
		success : function(data1, status) {
			//console.log("Connected: " + data1);
			
			console.log(urlAuth);
			$(location).attr('href',urlAuth);
		},
		error : function(jqXHR, textStatus, errorThrown) {
			showError(jqXHR, textStatus, errorThrown, "Error connecting to Dropbox. "+ supportText);
		}
	});
}