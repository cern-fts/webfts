<script>
$( document ).ready(function() {
	getDelegationID("delegation_id", true);

	renderFolderContent("leftEndpointContentTable", "leftSelectedCount", "leftEndpointContent", "left-loading-indicator", "left-ep-text");
	renderFolderContent("rightEndpointContentTable", "rightSelectedCount", "rightEndpointContent", "right-loading-indicator", "right-ep-text");
	
	initialLoadState('leftEndpoint', 'load-left');
	initialLoadState('rightEndpoint', 'load-right');

	//Set initial status
	$('#leftFilterPanel').hide();
	$('#rightFilterPanel').hide();
	$('#leftFilterOptionsPanel').hide();
	$('#rightFilterOptionsPanel').hide();	
	$("#leftFromRangeFilterDate").datepicker();
	$("#leftToRangeFilterDate").datepicker();
	$("#rightFromRangeFilterDate").datepicker();
	$("#rightToRangeFilterDate").datepicker();
	
	$('#leftEndpoint').keypress(function(event){
		if(event.keyCode == 13){
			$('#load-left').click();
		}
	});
	$('#rightEndpoint').keypress(function(event){
		if(event.keyCode == 13){
			$('#load-right').click();
		}
	});

	var ddDataLeft = [
	              {
	                 text: "Grid SE",
	                 value: 1,
	                 selected: true,
	                 description: "Grid Storage Element",
	                 imageSrc: "img/grid_storage.png"
	             },
	             {
	                 text: "Dropbox",
	                 value: 3,
	                 selected: false,
	                 description: "Dropbox",
	                 imageSrc: "img/Dropbox-icon.png"
	             },
	             {
	                 text: "Drive",
	                 value: 4,
	                 selected: false,
	                 description: "Google Drive",
	                 imageSrc: "img/Google-Drive-icon.png" 
	             },
	             {
	                 text: "OneDrive",
	                 value: 5,
	                 selected: false,
	                 description: "Microsoft OneDrive",
	                 imageSrc: "img/skydrive-icon.png"
	             }
	         ];
	         
	$('#leftStorageSelect').ddslick({
	   data: ddDataLeft,
	   width: "100%",
	   imagePosition: "left",
	   selectText: "Select storage",
	   onSelected: function (data) {
	       getStorageOption(data, 'leftStorageLogin', 'leftCSLoginForm', 'leftStorageContent', 'leftLoginIndicator', 'leftCSName', 'leftEndpoint', 'load-left', 'leftEndpointContent', 'leftEndpointContentTable', 'left-loading-indicator', 'left-ep-text', 'leftEpFilter');
	   }
	});

	var ddDataRight = [
		              {
		                 text: "Grid SE",
		                 value: 1,
		                 selected: true,
		                 description: "Grid Storage Element",
		                 imageSrc: "img/grid_storage.png"
		             }
		         ];
		
	$('#rightStorageSelect').ddslick({
		   data: ddDataRight,
		   width: "100%",
		   imagePosition: "left",
		   selectText: "Select storage",
		   onSelected: function (data) {
			   //As for the moment we consider only one...
			   //getStorageOption(data);
		   }
	});  
	$('#rightStorageSelect').prop('disabled', true);

	$('#leftStorageLogin').hide();
	$('#rightStorageLogin').hide();

	checkCSState('leftStorageSelect', 'leftStorageContent', 'leftCSLoginForm', 'leftLoginIndicator', 'leftStorageLogin', 'leftEndpointContent', 'leftEndpointContentTable', 'left-loading-indicator', 'left-ep-text', 'leftEpFilter', 'leftEndpoint', 'leftCSName');	
	console.log( "ready!" );	
});

$("#leftEndpointContentTable tbody").on("click", function(e){
	activateTransferButton('leftEndpointContentTable', 'transfer-from-left', 'right-ep-text');    
});

$("#rightEndpointContentTable tbody").on("click", function(e){
	activateTransferButton('rightEndpointContentTable', 'transfer-from-right', 'left-ep-text');    
});

$(function(){
	   $("#modal_content").load("modal.html");
	   $("#warning_modal_content").load("expirationWarningModal.html");  
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
	<div id="warning_modal_content"></div>
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
	<div class="row">
		<div class="btn-group-vertical col-xs-5 col-lg-5 col-md-5">
			<select id="leftStorageSelect"></select>
			
			<div id="leftStorageLogin" class="panel panel-primary">
				<div class="panel-body">
					<input type="hidden" id="leftCSName" value="">
					<form class="form" id="leftCSLoginForm">
<!-- 						<input type="text" name="leftCSUsername" placeholder="username"> -->
<!-- 						<input type="password" name="leftCSPassword" placeholder="password"> -->																						
						<button type="button" id="leftCSLoginBtn" class="btn btn-primary center-block" onclick="getLoginCS( $('#leftCSName').val(), 'leftStorageLogin', 'leftStorageContent', 'leftCSLoginForm', 'leftLoginIndicator', '/', 'leftEndpointContent', 'leftEndpointContentTable', 'left-loading-indicator', 'left-ep-text', 'leftEpFilter', 'leftEndpoint')">Login</button> 						
					</form>
					<div id="leftLoginIndicator" style="display: none" class="row">
						<ul class="pager">
							<li><label class="text-center"> Connecting...</label>&nbsp;<img
								class="pagination-centered" src="img/ajax-loader.gif" /></li>
						</ul>
					</div>
				</div>	
			</div>
			<div id="leftStorageContent">			
				<div class="input-group">
					<input id="leftEndpoint" type="text" placeholder="Endpoint path"
						class="form-control"
						value="gsiftp://lxfsra10a01.cern.ch/dpm/cern.ch/home/"> <span
						class="input-group-btn">
		
						<button class="btn btn-primary" type="button" id="load-left"
							onclick="getEPContent('leftEndpoint', 'leftEndpointContent', 'leftEndpointContentTable', 'left-loading-indicator', 'left-ep-text', 'leftEpFilter')">Load</button>
					</span>
				</div>
		
				<div class="panel panel-primary">
					<div class="panel-heading">
						<div class="btn-toolbar">
							<div class="btn-group ">
								<button type="button" class="btn btn-sm"
									onclick="selectAllFiles('leftEndpointContent')">Select
									All</button>
								<button type="button" class="btn btn-sm"
									onclick="selectNoneFiles('leftEndpointContent')">None</button>
							</div>
							<div class="btn-group">
								<button type="button" class="btn btn-sm"
									onclick="getEPContent('leftEndpoint', 'leftEndpointContent', 'leftEndpointContentTable', 'left-loading-indicator', 'left-ep-text', 'leftEpFilter')">
									<i class="glyphicon glyphicon-refresh" />&nbsp;Refresh
								</button>
							</div>
							<div class="btn-group">
								<button type="button" id="leftShowFilterButton" class="btn btn-sm"
									onclick="setFilterPanel('leftFilterPanel', $(this));">Show
									filters</button>
							</div>
							<div class="btn-group">
								<div id="leftFilterPanel">
									<div class="row formRowCustom">
										<form class="form-inline" id="leftSelectingOptions">
											<div class="form-group">
												<select id="leftFilterField" class="form-control input-sm"
													data-width="auto"
													onchange="setFilterShowingOptions('leftFilterOptionsPanel', 'leftEpFilter', $('#leftFilterField').val(), 'leftEndpointContentTable')">
													<option value="left1">Name</option>
													<option value="left2">Date</option>
													<option value="left3">Size</option>
												</select>
											</div>
											<div class="form-group">
												<input type="text" class="form-control input-sm"
													placeholder="Filter" id="leftEpFilter"
													onkeyup="getFilteredResults('leftEpFilter', 'leftEndpointContentTable', 'leftFilterField')"
													data-toggle="tooltip"
													title="Accepted format for regular expressions: http://www.w3schools.com/jsref/jsref_obj_regexp.asp">
											</div>
											<div class="form-group">
												<label> <input type="checkbox"
													onclick="getFilteredResults('leftEpFilter', 'leftEndpointContentTable', 'leftFilterField')" />
													Hide folders
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
												<input type="text" class="form-control input-sm-a"
													placeholder="From date" id="leftFromRangeFilterDate"
													onchange="getFilteredResults(null, 'leftEndpointContentTable', 'leftFilterField')">
											</div>
											<div class="form-group">
												<label> and </label>
											</div>
											<div class="form-group">
												<input type="text" class="form-control input-sm-a"
													placeholder="To date" id="leftToRangeFilterDate"
													onchange="getFilteredResults(null, 'leftEndpointContentTable', 'leftFilterField')">
											</div>
										</form>
										<form class="form-inline" id="left3">
											<div class="form-group">
												<label>Between </label>
											</div>
											<div class="form-group">
												<input type="text" class="form-control input-sm-a"
													placeholder="From bytes" id="leftFromRangeFilterSize"
													onkeyup="getFilteredResults(null, 'leftEndpointContentTable', 'leftFilterField')">
											</div>
											<div class="form-group">
												<label> and </label>
											</div>
											<div class="form-group">
												<input type="text" class="form-control input-sm-a"
													placeholder="To bytes" id="leftToRangeFilterSize"
													onkeyup="getFilteredResults(null, 'leftEndpointContentTable', 'leftFilterField')">
											</div>
											<div class="form-group">
												<label> bytes </label>
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
							<table class="table table-condensed" id="leftEndpointContentTable">
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
		</div>	
		<div class="btn-group btn-group-vertical col-xs-2 col-lg-2 col-md-2">
			<button type="button" class="btn btn-primary btn-block"
				name="transfer-from-left" id="transfer-from-left"
				onclick="runTransfer('leftEndpointContentTable', 'leftEndpoint', 'rightEndpoint', 'leftStorageSelect')"
				disabled>
				<i class="glyphicon glyphicon-chevron-right"></i>
			</button>
			<button type="button" class="btn btn-primary btn-block"
				name="transfer-from-right" id="transfer-from-right"
				onclick="runTransfer('rightEndpointContentTable', 'rightEndpoint', 'leftEndpoint', 'leftStorageSelect')"
				disabled>
				<i class="glyphicon glyphicon-chevron-left glyphicon-white"></i>
			</button>
		</div>
	
		<div class="btn-group-vertical col-xs-5 col-lg-5 col-md-5">
			<select id="rightStorageSelect"></select>
			<div id="rightStorageLogin"></div>
			<div id="rightStorageContent">
				<div id="leftStorageContent">
				<div class="input-group">
					<input id="rightEndpoint" type="text" placeholder="Endpoint path" value="gsiftp://lxfsra10a01.cern.ch/dpm/cern.ch/home/"
						class="form-control"> <span class="input-group-btn">
						<button class="btn btn-primary" type="button" id="load-right"
							onclick="getEPContent('rightEndpoint', 'rightEndpointContent', 'rightEndpointContentTable', 'right-loading-indicator', 'right-ep-text', 'rightEpFilter')">Load</button>
					</span>
				</div>
		
				<div class="panel panel-primary">
					<div class="panel-heading">
						<div class="btn-toolbar">
							<div class="btn-group ">
								<button type="button" class="btn btn-sm"
									onclick="selectAllFiles('rightEndpointContent')">Select
									All</button>
								<button type="button" class="btn btn-sm"
									onclick="selectNoneFiles('rightEndpointContent')">None</button>
							</div>
							<div class="btn-group">
								<button type="button" class="btn btn-sm"
									onclick="getEPContent('rightEndpoint', 'rightEndpointContent', 'rightEndpointContentTable', 'right-loading-indicator', 'right-ep-text', 'rightEpFilter')">
									<i class="glyphicon glyphicon-refresh" />&nbsp;Refresh
								</button>
							</div>
							<div class="btn-group">
								<button type="button" id="rightShowFilterButton"
									class="btn btn-sm"
									onclick="setFilterPanel('rightFilterPanel', $(this));">Show
									filters</button>
							</div>
							<div class="btn-group">
								<div id="rightFilterPanel">
									<div class="row formRowCustom">
										<form class="form-inline" id="rightSelectingOptions">
											<div class="form-group">
												<select id="rightFilterField" class="form-control input-sm"
													data-width="auto"
													onchange="setFilterShowingOptions('rightFilterOptionsPanel', 'rightEpFilter', $('#rightFilterField').val(), 'rightEndpointContentTable')">
													<option value="right1">Name</option>
													<option value="right2">Date</option>
													<option value="right3">Size</option>
												</select>
											</div>
											<div class="form-group">
												<input type="text" class="form-control input-sm"
													placeholder="Filter" id="rightEpFilter"
													onkeyup="getFilteredResults('rightEpFilter', 'rightEndpointContentTable', 'rightFilterField')"
													data-toggle="tooltip"
													title="Accepted format for regular expressions: http://www.w3schools.com/jsref/jsref_obj_regexp.asp">
											</div>
											<div class="form-group">
												<label> <input type="checkbox"
													onclick="getFilteredResults('rightEpFilter', 'rightEndpointContentTable', 'rightFilterField')" />
													Hide folders
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
												<input type="text" class="form-control input-sm-a"
													placeholder="From date" id="rightFromRangeFilterDate"
													onchange="getFilteredResults(null, 'rightEndpointContentTable', 'rightFilterField')">
											</div>
											<div class="form-group">
												<label> and </label>
											</div>
											<div class="form-group">
												<input type="text" class="form-control input-sm-a"
													placeholder="To date" id="rightToRangeFilterDate"
													onchange="getFilteredResults(null, 'rightEndpointContentTable', 'rightFilterField')">
											</div>
										</form>
										<form class="form-inline" id="right3">
											<div class="form-group">
												<label>Between </label>
											</div>
											<div class="form-group">
												<input type="text" class="form-control input-sm-a"
													placeholder="From bytes" id="rightFromRangeFilterSize"
													onkeyup="getFilteredResults(null, 'rightEndpointContentTable', 'rightFilterField')">
											</div>
											<div class="form-group">
												<label> and </label>
											</div>
											<div class="form-group">
												<input type="text" class="form-control input-sm-a"
													placeholder="To bytes" id="rightToRangeFilterSize"
													onkeyup="getFilteredResults(null, 'rightEndpointContentTable', 'rightFilterField')">
											</div>
											<div class="form-group">
												<label> bytes </label>
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
							<table class="table table-condensed" id="rightEndpointContentTable">
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
	</div>		
</div>	