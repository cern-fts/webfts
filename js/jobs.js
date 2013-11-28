function loadJobTable(jobList){
//	job_id 
//	submit_time
//	source_se
//	dest_se
//	
//	job_state
	$("#jobResultsTable > tbody").html("");
	$.each(jobList, function(index, value){
		var t_row = '<tr class="' + getRowColor(value.job_state) + '" value="' + value.job_id + '">' + getColumn(value.job_id) 
					+ getColumn(value.submit_time) + getColumn(value.source_se) + getColumn(value.dest_se) + '</tr>'  ;		
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