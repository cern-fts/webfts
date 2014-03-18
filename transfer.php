<script>
$( document ).ready(function() {
	getDelegationID("delegation_id", true);
// 	var urlParams = getQueryParams(document.location.search);
// 	if (urlParams.length > 0){
// 		if (urlParams["service"] == "dropbox"){
// 			console.log("Dropbox");
// 		}
// 	}

	console.log( "ready!" );	
});

$(function(){
	$("#submit_options").load("submitOption.html");
	$("#ep_ep").load("ep-ep.html");
	$("#url_ep").load("url-ep.html");  
	$("#modal_content").load("modal.html"); 
});
</script>
<h2>Transfer files</h2>
<div class="btn-group pull-right">
	<button class="btn btn-primary dropdown-toggle pull-right"
		type="button" data-toggle="dropdown">
		<span id="proxyTimeSpan">Loading proxy... </span><span class="caret"></span>
	</button>
	<ul class="dropdown-menu" role="menu">
		<li role="presentation" class="dropdown-header">Proxy actions</li>
		<li id="delegate_again_link"><a href="#" onclick="showDelegateModal()">Delegate
				again</a></li>
		<li id="delegate_remove_link"><a href="#"
			onclick="removeExistingDelegation()">Remove existing delegation</a></li>
	</ul>
</div>
<input type="hidden" id="delegation_id" value="">
<div class="row">
	<div id="modal_content"></div>
	<?php
	foreach($_SERVER as $h=>$v){
			if ($h == "SSL_CLIENT_S_DN")
				echo "<input type=\"hidden\" id=\"userDN\" value=\"$v\">";
			else if ($h == "SSL_CLIENT_CERT")
				echo "<input type=\"hidden\" id=\"clientCERT\" value=\"$v\">";
		}
		?>
	<legend>
		<h4>
			Please specify your transfer source and destination <small>(Including
				protocol. Example: gsiftp://sra10a01.myinstitute.com/myfolder)</small>
		</h4>
	</legend>
	<div class="alert alert-danger" id="serverkeyAlert"
		style="display: none">
		<button type="button" class="close" data-dismiss="alert"
			onclick="$('serverkeyAlert').hide()">&times;</button>
		<small id="serverErrorText"></small>
	</div>
	<div class="alert alert-success" id="serverkeyAlertSuccess"
		style="display: none">
		<button type="button" class="close" data-dismiss="alert"
			onclick="$('serverkeyAlertSuccess').hide()">&times;</button>
		<small id="serverSuccessText"></small>
	</div>
	<div id="submit_options"></div>
	<div id="ep_ep" style="display: none"></div>
	<div id="url_ep" style="display: none"></div>
</div>	