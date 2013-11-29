function loadJobTable(jobList){
	$("#jobResultsTable > tbody").html("");
	$.each(jobList, function(index, value){
		//Transfer row
		var t_row = '<tr class="' + getRowColor(value.job_state) + ' accordion-body" data-toggle="collapse" id="' + value.job_id 
		+ '" data-target="#' + value.job_id + '_row" onclick="toogleDetailRowState(\'' + value.job_id + '_row\')">' + getColumn(value.job_id) + getColumn(value.submit_time) 
		+ getColumn(value.source_se) + getColumn(value.dest_se) + '</tr>'  ;		
		$("#jobResultsTable > tbody:last").append(t_row);
		//Jobs from transfer row (hidden by default)
		t_row = '<tr class="collapse out" style="display: none;" id="' + value.job_id + '_row"><td colspan="4" ><table><tr><td> Demo1</td></tr> </table> </td></tr>';
		$("#jobResultsTable > tbody:last").append(t_row);
	});
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

function toogleDetailRowState(rowId) {	
	if ($("#jobResultsTable > tbody > #" + rowId).css('display') == 'none') {
		$("#jobResultsTable > tbody > #" + rowId).show();
	} else {
		$("#jobResultsTable > tbody > #" + rowId).hide();
	}
}	
