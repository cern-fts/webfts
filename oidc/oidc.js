/*
 *  Copyright 2017 CERN
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
*/

if (typeof OIDC == "undefined") OIDC = {};

OIDC.getConfig = function (){
        $.get("oidc/config.xml", function(data){
            $(data).find('config').each(function() {
                sessionStorage.oidc_client_id=$(this).find('client_id').text();
                sessionStorage.oidc_redirect_uri=$(this).find('redirect_uri').text();
                sessionStorage.oidc_login_url=$(this).find('login_url').text();
		sessionStorage.oidc_scope=$(this).find('scope').text();
                sessionStorage.oidc_client_secret=$(this).find('client_secret').text();
                });
        });
}

OIDC.getCertificate = function (code){
        var url = "https://webfts-dev.cern.ch/oidctokens";
	var theData = {};
        theData["grant_type"] = 'authorization_code';
        theData["client_id"] = sessionStorage.oidc_client_id;
        theData["client_secret"] = sessionStorage.oidc_client_secret;
        theData["code"] = code;
        theData["redirect_uri"] = sessionStorage.oidc_redirect_uri;
        theData["state"]= 'test';
        jsondata = JSON.stringify(theData);
        $.support.cors = true;
	return  $.ajax({
		url : url,
		type : "POST",
		data : jsondata,
		processData : false,
		success : function(x, status, xhr) {
			console.log("OK: " + JSON.stringify(x));			
			console.log("    Status: " + status);
		},
		error : function(xhr, textStatus, errorThrown) {
		        console.log("    Status: " + textStatus);
                        console.log("OK: " + JSON.stringify(xhr));
		}

	});	
}	
