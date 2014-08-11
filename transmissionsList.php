<script>
$( document ).ready(function() {	
	getDelegationID("delegation_id", false);	
	//getDelegationID("delegation_id", true);
	
	//Reload page every 5 minutes (5 * 60 * 1000)
	var intervalID = window.setInterval(reloadJobs, 300000);
});	

$(function(){
	   $("#modal_content").load("modal.html"); 
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
<div 	data-step="1" 
		data-intro="<h4>In this area are going to be displayed all your submitted jobs! Check the live status of your submittions whenever you want!</br><strong>Are you ready to start?</strong></h4>"
		data-position="bottom-middle-aligned">
	<table class="table table-bordered table-condensed table-hover" id="jobResultsTable">
	<!-- <table class="table table-condensed" id="jobResultsTable" style="border-collapse:collapse;"> -->
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

	<script type="text/javascript" src="/site-tour/intro.js/intro.js"></script>


</div>
