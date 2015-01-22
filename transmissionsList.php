<script>
$( document ).ready(function() {

  //trying to check if a cert from STS has been already stored in the session,
  //otherwise it tries to get one, if it fails goes back to old delegation method
  getDelegation(false);
  //Reload page every 5 minutes (5 * 60 * 1000)
  var intervalID = window.setInterval(reloadJobs, 300000);

});

$(function(){
           $("#warning_modal_content").load("expirationWarningModal.html");
           $("#modal_content").load("modal.html");
	   $("#voms_modal_content").load("vomsRequestModal.html");

});

function refresh(){
	if (!sessionStorage.userCert){
		getDelegationID("delegation_id", false);
	}
	else {
		getDelegationIDSTS("delegation_id", false, sessionStorage.userCert, sessionStorage.userKey);
	}
}
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
<div id="warning_modal_content"></div>
<div id="voms_modal_content"></div>
<div id="modal_content"></div>
<div id="load-indicator" style="display: none" class="row">
                         <ul class="pager">
                                      <li><label class="text-center">Loading Proxy...</label>&nbsp;<img
                                       class="pagination-centered" src="img/ajax-loader.gif" /></li>
                          </ul>
</div>
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
						<button type="button" class="btn btn-xs btn-primary" onclick="refresh()">
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
