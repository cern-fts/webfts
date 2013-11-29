function loadJobTable(jobList){
	$("#jobResultsTable > tbody").html("");
	$.each(jobList, function(index, value){
		//Transfer row
		var t_row = '<tr class="' + getRowColor(value.job_state) + ' accordion-body" data-toggle="collapse" id="' + value.job_id 
		+ '" data-target="#' + value.job_id + '_row" onclick="toogleDetailRowState(\'' + value.job_id + '_row\', \'' + value.job_id + '\')">' + getColumn(value.job_id) + getColumn(value.submit_time) 
		+ getColumn(value.source_se) + getColumn(value.dest_se) + '</tr>'  ;		
		$("#jobResultsTable > tbody:last").append(t_row);
		
		//Jobs from transfer row (hidden by default)
		t_row = '<tr class="collapse out" style="display: none;" id="' + value.job_id + '_row"><td colspan="4" >';
		t_row += '<div id="' + value.job_id + '-loading-indicator" style="display:none" class="row"><ul class="pager"><li><label class="text-center">'
				+ 'Loading...</label>&nbsp;<img class="pagination-centered" src="img/ajax-loader.gif"/></li></ul></div>';
		t_row += '<table id="' + value.job_id + '-table-details"><thead><tr><th>JOB ID</th><th>SUBMIT TIME</th><th>SOURCE SE</th><th>DEST SE</th></tr></thead></table>'; 
		t_row += '</td></tr>';
		$("#jobResultsTable > tbody:last").append(t_row);
	});
}

function reloadJobs(){
	console.log("reloading...");
	getDelegationID("delegation_id", false);
}

function getColumn(columnName){
	return "<td>" + columnName + "</td>";
}

function getRowColor(job_state){
	if (job_state=="FAILED"){
		return "danger";		
	} else if (job_state=="FINISHED"){
		return "success";
	} else {
		return "warning";
	}
}

function showUserError(message){
	$('#serverErrorText').text(message);
	$('#serverkeyAlert').show();
}

function hideUserError(){	
	$('#serverkeyAlert').hide();
}

function toogleDetailRowState(rowId, jobId) {	
	if ($("#jobResultsTable > tbody > #" + rowId).css('display') == 'none') {
		$("#jobResultsTable > tbody > #" + rowId).show();
		$('#' + jobId + '-table-details').hide();
		$('#' + jobId + '-loading-indicator').show();		
		getJobTranfers(jobId);
	} else {
		$("#jobResultsTable > tbody > #" + rowId).hide();
	}
}	

function loadJobDetails(transfers){
	$('#' + indicator + '-loading-indicator').hide();
	$('#' + value.job_id + '-table-details').show();
	alert("Hola");
}
