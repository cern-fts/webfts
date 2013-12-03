function loadTransferTable(transferList, jobId){
	$('#' + jobId + '-loading-indicator').hide();
	$('#' + jobId + '-table-details').show();
	$("#" + jobId + "-table-details > tbody").html("");
	$.each(transferList.files, function(index, value){
		//Transfer row
		var t_row = '<tr class="' + getRowColor(value.file_state) + '">' + getColumn(value.file_id) + getColumn(value.transferhost) 
		+ getColumn(value.source_surl) + getColumn(value.dest_surl) + getColumn(value.filesize) + getColumn(value.throughput) 		
		+ getColumn(value.start_time).replace("T", " ") + getColumn(value.finish_time).replace("T", " ") + '</tr>'  ;		
		$("#" + jobId + "-table-details > tbody:last").append(t_row);		
	});
}

function loadJobTable(jobList){
	$("#jobResultsTable > tbody").html("");
	$.each(jobList, function(index, value){
		//Job row
		var t_row = '<tr class="' + getRowColor(value.job_state) + ' accordion-body" data-toggle="collapse" id="' + value.job_id 
		+ '" data-target="#' + value.job_id + '_row" onclick="toogleDetailRowState(\'' + value.job_id + '_row\', \'' + value.job_id + '\')">' + getColumn(value.job_id) + getColumn(value.submit_time) 
		+ getColumn(value.source_se) + getColumn(value.dest_se) + '</tr>'  ;		
		$("#jobResultsTable > tbody:last").append(t_row);
		
		//Transfers from job row (hidden by default)
		t_row = '<tr class="collapse out" style="display: none;" id="' + value.job_id + '_row"><td colspan="4" >';
		t_row += '<div id="' + value.job_id + '-loading-indicator" style="display:none" class="row"><ul class="pager"><li><label class="text-center">'
				+ 'Loading...</label>&nbsp;<img class="pagination-centered" src="img/ajax-loader.gif"/></li></ul></div>';
		t_row += '<table id="' + value.job_id + '-table-details" class="table table-bordered table-condensed table-hover transfers-table">';
		t_row += '<thead><tr><th style="width: 6%;">File ID</th><th style="width: 10%;">Transfer Host</th><th style="width: 25%;">Source URL</th>';
		t_row += '<th style="width: 25%;">Dest. URL</th><th style="width: 9%;">File Size</th>';
		t_row += '<th style="width: 9%;">Throughput</th><th style="width: 8%;">Start Time</th><th style="width: 8%;">End Time</th></tr></thead><tbody></tbody></table>'; 
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
