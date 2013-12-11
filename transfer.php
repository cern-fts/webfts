<script>
jQuery.validator.addMethod("checkCert", function (value, element) {
    return value.substring(0,31)=="-----BEGIN RSA PRIVATE KEY-----";
}, "The private key must start with -----BEGIN RSA PRIVATE KEY-----");
$(function(event) {											
	 $('#pinfo-form').validate(
	  {
	  rules: {
	    pemPkey: {
	      minlength: 256,
	      required: true,
	      checkCert: true
	    }
	  },
	  highlight: function(element) {
	    $(element).closest('.control-group').addClass('has-error');
	  },
      unhighlight: function(element) {
        $(element).closest('.control-group').removeClass('has-error');
      },
	  success: function(element) {
	    element.text('OK!').addClass('valid').closest('.control-group').removeClass('has-error');
	  }											 
	 });
}); 

$( document ).ready(function() {	
	getDelegationID("delegation_id", true);

	renderFolderContent("leftEndpointContentTable", "leftSelectedCount", "leftEndpointContent", "left-loading-indicator", "left-ep-text");
	renderFolderContent("rightEndpointContentTable", "rightSelectedCount", "rightEndpointContent", "right-loading-indicator", "rifht-ep-text");
	
	initialLoadState('leftEndpoint', 'load-left');
	initialLoadState('rightEndpoint', 'load-right');

	initFilters();	

	setInitialDatepickers();
	
	console.log( "ready!" );	
});

$("#pinfo-form").submit(function(event){
  event.preventDefault();	
  if ($("#pinfo-form").valid()){ 	
	doDelegate($("#delegation_id").val(), $("#pemPkey").val(),
			$("#userDN").val(), $("#clientCERT").val());
	$("#pemPkey").val("");  
  }	
  return false;
});

$( "#delegateButton" ).click(function() {
	$( "#pinfo-form" ).submit();
});
		
$('#popoverDelegate').popover();

//To prevent the modal window to be closed by pressing ESC or clicking outside
// $('#delegationModal').modal({
// 	  show: false,	
// 	  backdrop: 'static',
// 	  keyboard: false
// });

//To do the validation of the form even on paste
$("#pemPkey").bind('input propertychange', function(){
	$("#pinfo-form").valid();
});

$("#leftEndpointContentTable tbody").on("click", function(e){
	activateTransferButton('leftEndpointContentTable', 'transfer-from-left', 'right-ep-text');    
});

$("#rightEndpointContentTable tbody").on("click", function(e){
	activateTransferButton('rightEndpointContentTable', 'transfer-from-right', 'left-ep-text');    
});

// $("#leftShowFilterButton").click(function() {
// 	$('#leftFilterPanel').toggle();
// });

</script>
	<h2>Transfer files</h2>
	<div class="btn-group pull-right">
          <button class="btn btn-primary dropdown-toggle pull-right" type="button" data-toggle="dropdown" >
            <span id="proxyTimeSpan">Loading proxy...  </span><span class="caret"></span>
          </button>
          <ul class="dropdown-menu" role="menu">
            <li><a href="#" onclick="showDelegateModal()">Delegate again</a></li>            
            <li><a href="#" onclick="removeExistingDelegation()">Remove existing delegation</a></li>
          </ul>
    </div>
	</div>
	<div class="row">
	<div class="modal fade" id="delegationModal"  tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	  <div class="modal-dialog">
	    <div class="modal-content">
	      <form action="" id="pinfo-form" name="pinfo-form" class="form-horizontal" method="post">
		     <div class="modal-body">		          	      	     
				    <h4 class="modal-title">
				        Credentials delegation	        
		        		<a id="popoverDelegate" class="btn" href="#" data-content="There is not an existing valid proxy. You have to delegate your credentials to create a new one." rel="popover" data-placement="right" data-trigger="hover">?</a>
					</h4>
					<div class="alert alert-success" id="obtainkeyAlert">
						<button type="button" class="close" data-dismiss="alert" onclick="$('obtainkeyAlert').hide()">&times;</button>
						<small>The private RSA key can be obtained from the p12 certificate you have
						installed in your browser by using:<br /> <i>&nbsp;&nbsp;&nbsp;openssl
							pkcs12 -in yourCert.p12 -nocerts -nodes | openssl rsa </i></small>
					</div>
					<div class="alert alert-warning">
						<strong>DISCLAIMER</strong>: <small>the private key WILL NOT BE TRANSMITTED ANYWHERE. It is only used locally
							(within the user's browser) to generate the proxies needed to have
							access to the FTS services.</small>   
					</div>			
					<div class="alert alert-danger" id="serverDelegateAlert" style="display:none" >
						  <label id="delegateDelegateErrorText"></label> 
					</div>	
					<div class="row control-group">			
						<label class="control-label" for="privateKey">Private key</label>
						<textarea id="pemPkey" name="pemPkey" class="field form-control" rows="5" placeholder="RSA private key" ></textarea>
					</div>			
					<input type="hidden" id="delegation_id" value="">				
		      </div>
		      <div class="modal-footer ">
		      	<div class="controls center">
		      		<button type="button" class="btn btn-primary" name="delegateButton" id="delegateButton">Delegate</button>
		      	</div>
		      </div>	      
	      </form>
		</div>					   
	  </div><!-- /.modal-dialog -->
	</div><!-- /.modal -->
	
	<?php
		foreach($_SERVER as $h=>$v){
			if ($h == "SSL_CLIENT_S_DN")
				echo "<input type=\"hidden\" id=\"userDN\" value=\"$v\">";
			else if ($h == "SSL_CLIENT_CERT")
				echo "<input type=\"hidden\" id=\"clientCERT\" value=\"$v\">";				
		}
	?>
	<legend><h4>Please specify your transfer source and destination <small>(Including protocol. Example: gsiftp://sra10a01.myinstitute.com/myfolder)</small></h4></legend>
	<div class="alert alert-danger" id="serverkeyAlert" style="display:none" >
		<button type="button" class="close" data-dismiss="alert" onclick="$('serverkeyAlert').hide()">&times;</button>
		<small id="serverErrorText"></small>
	</div>
	<div class="alert alert-success" id="serverkeyAlertSuccess" style="display:none" >
		<button type="button" class="close" data-dismiss="alert" onclick="$('serverkeyAlertSuccess').hide()">&times;</button>
		<small id="serverSuccessText"></small>
	</div>
	<div class="row">
		<div class="btn-group-vertical col-lg-5">
			<div class="input-group">
				<input id="leftEndpoint" type="text" placeholder="Endpoint path" class="form-control" value="gsiftp://lxfsra10a01.cern.ch/dpm/cern.ch/home/"> <span class="input-group-btn">
					<button class="btn btn-primary" type="button" id="load-left" onclick="getEPContent('leftEndpoint', 'leftEndpointContent', 'leftEndpointContentTable', 'left-loading-indicator', 'left-ep-text', 'leftEpFilter')">Load</button>
				</span>
			</div>

			<div class="panel panel-primary">
				<div class="panel-heading">
					<div class="btn-toolbar">
						<div class="btn-group ">
							<button type="button" class="btn btn-sm" onclick="selectAllFiles('leftEndpointContent')">Select All</button>
							<button type="button" class="btn btn-sm" onclick="selectNoneFiles('leftEndpointContent')">None</button>
						</div>
						<div class="btn-group">
							<button type="button" class="btn btn-sm" onclick="getEPContent('leftEndpoint', 'leftEndpointContent', 'leftEndpointContentTable', 'left-loading-indicator', 'left-ep-text', 'leftEpFilter')">
								<i class="glyphicon glyphicon-refresh" />&nbsp;Refresh
							</button>
						</div>
						<div class="btn-group">
							<button type="button" id="leftShowFilterButton" class="btn btn-sm" onclick="setFilterPanel('leftFilterPanel', $(this));">Show filters</button>							
						</div>						
						<div class="btn-group">
							<div id="leftFilterPanel">
								<div class="row formRowCustom">
									<form class="form-inline" id="leftSelectingOptions">
										<div class="form-group">
											<select id="leftFilterField" class="form-control input-sm"
												data-width="auto" onchange="setFilterShowingOptions('leftFilterOptionsPanel', 'leftEpFilter', $('#leftFilterField').val(), 'leftEndpointContentTable')">
												<option value="left1">Name</option>
												<option value="left2">Date</option>
												<option value="left3">Size</option>
											</select>
										</div>
										<div class="form-group">
											<input type="text" class="form-control input-sm" placeholder="Filter" id="leftEpFilter"
												onkeyup="getFilteredResults('leftEpFilter', 'leftEndpointContentTable', 'leftFilterField')"
												 data-toggle="tooltip" title="Accepted format for regular expressions: http://www.w3schools.com/jsref/jsref_obj_regexp.asp">												
										</div>
										<div class="form-group">
											<label> 
												<input type="checkbox" onclick="getFilteredResults('leftEpFilter', 'leftEndpointContentTable', 'leftFilterField')"/> Hide folders
											</label>
										</div>
									</form>
								</div>
								<div class="row formRowCustom" id="leftFilterOptionsPanel">
									<form class="form-inline" id="left1"></form>
									<form class="form-inline" id="left2">
										<div class="form-group">
											<label>Between </label>
										</div>
										<div class="form-group">
											<input type="text" class="form-control input-sm" placeholder="From date" id="leftFromRangeFilterDate"
												onchange="getFilteredResults(null, 'leftEndpointContentTable', 'leftFilterField')">
										</div>
										<div class="form-group">
											<label> and </label>
										</div>
										<div class="form-group">
											<input type="text" class="form-control input-sm" placeholder="To date" id="leftToRangeFilterDate"
												onchange="getFilteredResults(null, 'leftEndpointContentTable', 'leftFilterField')">
										</div>
									</form>
									<form class="form-inline" id="left3">
										<div class="form-group">
											<label>Between </label>
										</div>
										<div class="form-group">
											<input type="text" class="form-control input-sm" placeholder="From bytes" id="leftFromRangeFilterSize"
												onkeyup="getFilteredResults(null, 'leftEndpointContentTable', 'leftFilterField')">
										</div>
										<div class="form-group">
											<label> and </label>
										</div>
										<div class="form-group">
											<input type="text" class="form-control input-sm" placeholder="To bytes" id="leftToRangeFilterSize"
												onkeyup="getFilteredResults(null, 'leftEndpointContentTable', 'leftFilterField')">
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="panel-body">
					<div id="left-loading-indicator" style="display: none" class="row">
						<ul class="pager">
							<li><label class="text-center"> Loading...</label>&nbsp;<img
								class="pagination-centered" src="img/ajax-loader.gif" /></li>
						</ul>
					</div>
					<div id="leftEndpointContent">
						<table class="table table-condensed"
							id="leftEndpointContentTable">
							<thead>
								<tr>
									<td>Name</td>
									<td>Mode</td>
									<td>Date</td>
									<td>Size</td>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
								</tr>
							</tbody>
						</table>
						<span> <span class="leftSelectedCount"> 0 </span> File(s)
							Selected &nbsp; <input type="hidden" id="left-ep-text">
						</span>
					</div>
				</div>
			</div>
		</div>
		<div class="btn-group btn-group-vertical col-md-2">
			<button type="button" class="btn btn-primary btn-block"	name="transfer-from-left" id="transfer-from-left" onclick="runTransfer('leftEndpointContentTable', 'leftEndpoint', 'rightEndpoint')" disabled>			
				<i class="glyphicon glyphicon-chevron-right"></i>
			</button>
			<button type="button" class="btn btn-primary btn-block" name="transfer-from-right" id="transfer-from-right"onclick="runTransfer('rightEndpointContentTable', 'rightEndpoint', 'leftEndpoint')" disabled> 
				<i class="glyphicon glyphicon-chevron-left glyphicon-white"></i>
			</button>
		</div>

		<div class="btn-group-vertical col-lg-5">
			<div class="input-group">
				<input id="rightEndpoint" type="text" placeholder="Endpoint path" class="form-control"> <span class="input-group-btn">
					<button class="btn btn-primary" type="button" id="load-right" onclick="getEPContent('rightEndpoint', 'rightEndpointContent', 'rightEndpointContentTable', 'right-loading-indicator', 'right-ep-text', 'rightEpFilter')">Load</button>
				</span>
			</div>

			<div class="panel panel-primary">
				<div class="panel-heading">
					<div class="btn-toolbar">
						<div class="btn-group ">
							<button type="button" class="btn btn-sm" onclick="selectAllFiles('rightEndpointContent')">Select All</button>
							<button type="button" class="btn btn-sm" onclick="selectNoneFiles('rightEndpointContent')">None</button>
						</div>
						<div class="btn-group">
							<button type="button" class="btn btn-sm" onclick="getEPContent('rightEndpoint', 'rightEndpointContent', 'rightEndpointContentTable', 'right-loading-indicator', 'right-ep-text', 'rightEpFilter')">
								<i class="glyphicon glyphicon-refresh" />&nbsp;Refresh
							</button>
						</div>
						<div class="btn-group">
							<button type="button" id="rightShowFilterButton" class="btn btn-sm" onclick="setFilterPanel('rightFilterPanel', $(this));">Show filters</button>							
						</div>						
						<div class="btn-group">
							<div id="rightFilterPanel">
								<div class="row formRowCustom">
									<form class="form-inline" id="rightSelectingOptions">
										<div class="form-group">
											<select id="rightFilterField" class="form-control input-sm"
												data-width="auto" onchange="setFilterShowingOptions('rightFilterOptionsPanel', 'rightEpFilter', $('#rightFilterField').val(), 'rightEndpointContentTable')">
												<option value="right1">Name</option>
												<option value="right2">Date</option>
												<option value="right3">Size</option>
											</select>
										</div>
										<div class="form-group">
											<input type="text" class="form-control input-sm" placeholder="Filter" id="rightEpFilter"
												onkeyup="getFilteredResults('rightEpFilter', 'rightEndpointContentTable', 'rightFilterField')"
												data-toggle="tooltip" title="Accepted format for regular expressions: http://www.w3schools.com/jsref/jsref_obj_regexp.asp">												
										</div>
										<div class="form-group">
											<label> 
												<input type="checkbox" onclick="getFilteredResults('rightEpFilter', 'rightEndpointContentTable', 'rightFilterField')"/> Hide folders
											</label>
										</div>
									</form>
								</div>
								<div class="row formRowCustom" id="rightFilterOptionsPanel">
									<form class="form-inline" id="right1"></form>
									<form class="form-inline" id="right2">
										<div class="form-group">
											<label>Between </label>
										</div>
										<div class="form-group">
											<input type="text" class="form-control input-sm" placeholder="From date" id="rightFromRangeFilterDate"
												onchange="getFilteredResults(null, 'rightEndpointContentTable', 'rightFilterField')">
										</div>
										<div class="form-group">
											<label> and </label>
										</div>
										<div class="form-group">
											<input type="text" class="form-control input-sm" placeholder="To date" id="rightToRangeFilterDate"
												onchange="getFilteredResults(null, 'rightEndpointContentTable', 'rightFilterField')">
										</div>
									</form>
									<form class="form-inline" id="right3">
										<div class="form-group">
											<label>Between </label>
										</div>
										<div class="form-group">
											<input type="text" class="form-control input-sm" placeholder="From bytes" id="rightFromRangeFilterSize"
												onkeyup="getFilteredResults(null, 'rightEndpointContentTable', 'rightFilterField')">
										</div>
										<div class="form-group">
											<label> and </label>
										</div>
										<div class="form-group">
											<input type="text" class="form-control input-sm" placeholder="To bytes" id="rightToRangeFilterSize"
												onkeyup="getFilteredResults(null, 'rightEndpointContentTable', 'rightFilterField')">
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="panel-body">
					<div id="right-loading-indicator" style="display: none" class="row">
						<ul class="pager">
							<li><label class="text-center"> Loading...</label>&nbsp;<img
								class="pagination-centered" src="img/ajax-loader.gif" /></li>
						</ul>
					</div>
					<div id="rightEndpointContent">
						<table class="table table-condensed"
							id="rightEndpointContentTable">
							<thead>
								<tr>
									<td>Name</td>
									<td>Mode</td>
									<td>Date</td>
									<td>Size</td>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
								</tr>
							</tbody>
						</table>
						<span> <span class="rightSelectedCount"> 0 </span> File(s)
							Selected &nbsp; <input type="hidden" id="right-ep-text">
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
<!-- </form> -->
