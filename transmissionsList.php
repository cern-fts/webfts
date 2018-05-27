<script>
$( document ).ready(function() {	
	getDelegationID("delegation_id", false);	
	//getDelegationID("delegation_id", true);
	
	//Reload page every 5 minutes (5 * 60 * 1000)
	var intervalID = window.setInterval(reloadJobs, 300000);
});	

</script>
<div class="row">
<div>&nbsp;</div>
<?php
	foreach($_SERVER as $h=>$v){
		if ($h == "SSL_CLIENT_S_DN")
			echo "<input type=\"hidden\" id=\"userDN\" value=\"$v\">";
		else if ($h == "SSL_CLIENT_CERT")
			echo "<input type=\"hidden\" id=\"clientCERT\" value=\"$v\">";
	}
?>

<input type="hidden" id="delegation_id" value="">		
<div id="modal_content"></div>
<div class="alert alert-danger" id="serverkeyAlert" style="display:none" >
	<button type="button" class="close" data-dismiss="alert" onclick="$('#serverkeyAlert').hide()">&times;</button>
	<small id="serverErrorText"></small>
</div>
<div class="alert alert-success" id="serverkeyAlertSuccess"	style="display: none">
	<button type="button" class="close" data-dismiss="alert" onclick="$('serverkeyAlertSuccess').hide()">&times;</button>
	<small id="serverSuccessText"></small>
</div>
<div>
  <div class="container-fluid border-element" align='center'>
    <button class="btn btn-primary" type="button" id="submit-transfers" onclick="window.location='#includedContentTransfer'">Submit New transfers</button>
  </div>
</div>
<div>&nbsp;</div>
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
