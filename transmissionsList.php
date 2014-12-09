<script>
$( document ).ready(function() {

  //trying to check if a cert from STS has been already stored in the session,
  //otherwise it tries to get one, if it fails goes back to old delegation method
  if (!sessionStorage.userCert) {
        $.get("ssoGetAssertion.php", function(data) {

        // Let's check if we really got an assertion
        var err = ssoErrorString(data);
        if(err) {
                console.log(err);
                getDelegationID("delegation_id", false);
                return;
        }

	// We will now generate an RSA keypair *** THIS DOES NOT WORK WITH STS YET ***
//	var kp = KEYUTIL.generateKeypair("RSA", 2048);
//	sessionStorage.userKey = hextob64(KEYUTIL.getHexFromPEM(KEYUTIL.getPEM(kp["prvKeyObj"], "PKCS8PRV")));

	// We will now wrap fetched assertion in SOAP envelope
	// Third parameter to this function is an optional public key from our side (BASE64-encoded)
//	var req = ssoSoapReq(data, sessionStorage.stsAddress, hextob64(KEYUTIL.getHexFromPEM(KEYUTIL.getPEM(kp["pubKeyObj"]))), []);
	var req = ssoSoapReq(data, sessionStorage.stsAddress);

        // We will now send our SOAP request to STS
        if(req) {
                $.ajax({url: "/sts",
                type: "POST",
                contentType: "text/xml; charset=utf-8",
                headers: {SOAPAction: sessionStorage.stsAddress},
                data: req}).done(
                function(data) {

                        // Let's check if STS was happy with our assertion

                        var err = ssoErrorString(data);
                        if(err) {
                                console.log(err);
                                getDelegationID("delegation_id", false);
                                return;
                        }

                        // This function returns BASE64-encoded string of generated certificate
                        var cert = ssoGetCertificate(data);
                        sessionStorage.userCert = cert;

                        // This function returns BASE64-encoded string of generated private key
                        var pkey = ssoGetPrivateKey(data);
                        if(pkey) { // STS provided us a key
                                sessionStorage.userKey = pkey;
                        } else { // Use our own key
                                pkey = sessionStorage.userKey;
                        }

                        getDelegationIDSTS("delegation_id", false, cert, pkey);

                });
                }
        });
   } else getDelegationIDSTS("delegation_id", false, sessionStorage.userCert, sessionStorage.userKey);

	//Reload page every 5 minutes (5 * 60 * 1000)
	var intervalID = window.setInterval(reloadJobs, 300000);
});

$(function(){
	$("#modal_content").load("modal.html"); 
});
</script>
<div class="row">
<div>&nbsp;</div>
<input type="hidden" id="userDN" value="">
<?php
	foreach($_SERVER as $h=>$v){
		if ($h == "SSL_CLIENT_CERT")
			echo "<input type=\"hidden\" id=\"clientCERT\" value=\"$v\">";
	}
?>

<input type="hidden" id="delegation_id" value="">
<!-- <ul class="pagination pagination pagination-sm"> -->
<!-- 	<li class="disabled"><a href="#">&laquo;</a></li> -->
<!-- 	<li class="active"><a href="#">1</a></li> -->
<!-- 	<li><a href="#">2</a></li> -->
<!-- 	<li><a href="#">3</a></li> -->
<!-- 	<li><a href="#">4</a></li> -->
<!-- 	<li><a href="#">5</a></li> -->
<!-- 	<li><a href="#">&raquo;</a></li> -->
<!-- </ul> -->
<div id="modal_content"></div>
<div class="alert alert-danger" id="serverkeyAlert" style="display:none" >
	<button type="button" class="close" data-dismiss="alert" onclick="$('#serverkeyAlert').hide()">&times;</button>
	<small id="serverErrorText"></small>
</div>
<div class="alert alert-success" id="serverkeyAlertSuccess"	style="display: none">
	<button type="button" class="close" data-dismiss="alert" onclick="$('serverkeyAlertSuccess').hide()">&times;</button>
	<small id="serverSuccessText"></small>
</div>
<div id="idjobsTable">
 	<table class="table table-bordered table-condensed table-hover" id="jobResultsTable">
		<thead>
			<tr>
				<th>Job ID
					<div class="btn-group pull-right">
						<button type="button" class="btn btn-xs btn-primary" onclick="getDelegationID('delegation_id', false)">
							<i class="glyphicon glyphicon-refresh"/>&nbsp;Refresh
						</button>
					</div>
				</th>
				<th>Submit Time</th>
				<th>Source SE</th>
				<th>Dest. SE</th>
			</tr>
		</thead>
		<tbody>
		</tbody>
	</table>
</div>
</div>
