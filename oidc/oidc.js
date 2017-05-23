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
	$.ajax({
		url : url,
		type : "POST",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data : theData,
		success : function(resp, status) {
			var json =  JSON.parse(resp)
                        var kp = KEYUTIL.generateKeypair("RSA", 2048);
			var csri = new KJUR.asn1.csr.CertificationRequestInfo();
			csri.setSubjectByParam({'str': '/C=US/O=Test/CN=example.com'});
			csri.setSubjectPublicKeyByGetKey( kp["pubKeyObj"]);
			
			var csr = new KJUR.asn1.csr.CertificationRequest({'csrinfo': csri});
			csr.sign("SHA256withRSA", kp["prvKeyObj"]);
			sessionStorage.prvKey=  hextob64(KEYUTIL.getHexFromPEM(KEYUTIL.getPEM(kp["prvKeyObj"], "PKCS8PRV")));
			
			certPEM = csr.getPEMString();
			certPEM = certPEM.replace("-----END CERTIFICATE REQUEST-----","");
			certPEM = certPEM.replace("-----BEGIN CERTIFICATE REQUEST-----","");
			console.log(certPEM)
			var postData = {};
			postData["client_id"] =  sessionStorage.oidc_client_id;
			postData["client_secret"] = sessionStorage.oidc_client_secret;
			postData["access_token"] = json["access_token"];
			postData["certreq"] = certPEM;
			postData["state"]= 'test';
			var postUrl = "https://webfts-dev.cern.ch/oidcgetcert"; 
			$.ajax({
                               url : postUrl,
			       type : "POST",
                               headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                               data : postData,
			       success : function(cert, status, xhr) {
	                           console.log("OK: " + cert);
				   sessionStorage.cert = cert;
				   // similar behavior as an HTTP redirect
				   window.location.replace("https://webfts-dev.cern.ch");
			       },
                               error : function(xhr, textStatus, errorThrown) {
                                   console.log("    Status: " + textStatus);
                                   console.log("ERROR: " + JSON.stringify(xhr));
                               }
			 });
	
		},
		error : function(xhr, textStatus, errorThrown) {
		        console.log("    Status: " + textStatus);
                        console.log("ERROR: " + JSON.stringify(xhr));
		}

	});	
}	
