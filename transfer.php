<!-A-dd IntroJs styles -->
<link href="/site-tour/introJs/introjs.css" rel="stylesheet">
<link rel="stylesheet" type="text/css" href="css/site-tour-styles/custom-site-tour.css">

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
	         ];
	         
	//workaround to make the session loading work
        var setSession= false;

        $('#leftStorageSelect').ddslick({
           data: ddDataLeft,
           width: "100%",
           imagePosition: "left",
           selectText: "Select storage",
           onSelected: function (data) {
               getStorageOption(data, 'leftStorageLogin', 'leftCSLoginForm', 'leftStorageContent', 'leftLoginIndicator', 'leftCSName', 'leftEndpoint', 'load-left', 'leftEndpointContent', 'leftEndpointContentTable', 'left-loading-indicator', 'left-ep-text', 'leftEpFilter','left');
               $('#leftCSName').val(data.selectedData.text.toLowerCase());
		if (setSession) {
                        sessionStorage.leftCSIndex=data.selectedIndex;
                }
           }
        });


	var ddDataRight = [
	             {
	                text: "Grid SE",
                 	value: 1,
		        selected: true,
		        description: "Grid Storage Element",
		        imageSrc: "img/grid_storage.png"
		     },
		     {
                      	text: "CERNBox",
                       	value: 2,
                       	selected: false,
                       	description: "CERNBox Service (Beta)",
                       	imageSrc: "img/CERNBox-icon.png"
                      },
		        ];
		
	$('#rightStorageSelect').ddslick({
	   data: ddDataRight,
	   width: "100%",
	   imagePosition: "left",
	   selectText: "Select storage",
	   onSelected: function (data) {
		$('#rightCSName').val(data.selectedData.text.toLowerCase());
		if (!sessionStorage.clientCN) {
				  $.ajax({
                    			url: 'getcn.php',
                    			success: function(data)
                    			{
						if (data != "") {
							sessionStorage.clientCN=data.substring(3).trim();
						}
						else {
							alert("WebFTS could not retrieve your credentials to access CERNBox, are you a CERNBOX user?");
							return;
						}
                    			},
					error: function(xhr, desc, err) 
					{ 
                                           alert("WebFTS could not retrieve your credentials to access CERNBox, are you a CERNBOX user?");
					   return;
					},	
                		});	
			}	
		   getStorageOption(data, 'rightStorageLogin', 'rightCSLoginForm', 'rightStorageContent', 'rightLoginIndicator', 'rightCSName', 'rightEndpoint', 'load-right', 'rightEndpointContent', 'rightEndpointContentTable', 'right-loading-indicator', 'right-ep-text', 'rightEpFilter','right');
		   if (setSession) {
                       	sessionStorage.rightCSIndex=data.selectedIndex;
               	   }
	   }
	});  

	setSession= true;

        //reload from session
        if (sessionStorage.leftCSIndex ) {
                var i = parseInt(sessionStorage.leftCSIndex);
                $('#leftStorageSelect').ddslick('select', {index: i});
                 
        }
        if (sessionStorage.rightCSIndex) {
                var i = parseInt(sessionStorage.rightCSIndex);
                $('#rightStorageSelect').ddslick('select', {index: i});
        
        }


	loadEndpointsList()
	
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
	
	if(typeof(Storage)!=="undefined"){
	 if (sessionStorage.checksum || sessionStorage.overwrite || sessionStorage.lfcregistration) {
		(sessionStorage.checksum === "true")? $('#checksum')[0].checked= true : $('#checksum')[0].checked= false;
		(sessionStorage.overwrite === "true")? $('#overwrite')[0].checked= true : $('#overwrite')[0].checked= false;
		(sessionStorage.lfcregistration === "true")? $('#lfcregistration')[0].checked= true : $('#lfcregistration')[0].checked= false;
		
	  }
	 if (sessionStorage.lfcendpoint) {
		 $('#lfcendpoint').val(sessionStorage.lfcendpoint);
	 }else {
		sessionStorage.lfcendpoint="";
		$('#lfcendpoint').val("lfc://");
	   }
	 //reloading the endpoint only if SE GRid
         if (sessionStorage.seEndpointLeft && (parseInt(sessionStorage.leftCSIndex) ==0) ) {
		 $('#leftEndpoint').val(sessionStorage.seEndpointLeft);
		 if (sessionStorage.seEndpointLeft !== "") {
			$('#load-left').trigger("click");	
		 }
	  }

	 if (sessionStorage.seEndpointRight) {
		 $('#rightEndpoint').val(sessionStorage.seEndpointRight);
		 if (sessionStorage.seEndpointRight !== "") {
                        $('#load-right').trigger("click");
                 }  
	  }
	}

	//$('#leftStorageLogin').hide();

	checkCSState('leftStorageSelect', 'leftStorageContent', 'leftCSLoginForm', 'leftLoginIndicator', 'leftStorageLogin', 'leftEndpointContent', 'leftEndpointContentTable', 'left-loading-indicator', 'left-ep-text', 'leftEpFilter', 'leftEndpoint', 'leftCSName');	
	console.log( "ready!" );	

	//needed to center buttons
	$('#dmtoolbarleft').css('display', 'inline-block');
	$('#dmtoolbarright').css('display', 'inline-block');
	$('#filtertoolbarleft').css('display', 'inline-block');
	$('#filtertoolbarright').css('display', 'inline-block');

});


$('#lfcendpoint').popover({
    content: $('#lfcendpoint').val(),
    placement: 'auto',
    html: true,
    trigger : 'hover'
});


$("#leftEndpointContentTable tbody").on("click", function(e){
	activateTransferButton('leftEndpointContentTable', 'transfer-from-left', 'right-ep-text');    
});

$("#rightEndpointContentTable tbody").on("click", function(e){
	activateTransferButton('rightEndpointContentTable', 'transfer-from-right', 'left-ep-text');    
});

$("#selectAllLeft").on("click", function(e) {
	activateTransferButton('leftEndpointContentTable', 'transfer-from-left', 'right-ep-text');
});

$("#selectNoneLeft").on("click", function(e) {
        activateTransferButton('leftEndpointContentTable', 'transfer-from-left', 'right-ep-text');
});

$("#selectAllRight").on("click", function(e) {
	activateTransferButton('rightEndpointContentTable', 'transfer-from-right', 'left-ep-text');
});

$("#selectNoneRight").on("click", function(e) {
	activateTransferButton('rightEndpointContentTable', 'transfer-from-right', 'left-ep-text');
});


$("#lfcregistration").on("click", function(e){
	activateTransferButton('leftEndpointContentTable', 'transfer-from-left', 'right-ep-text');
        activateTransferButton('rightEndpointContentTable', 'transfer-from-right', 'left-ep-text');
});

$("#lfcendpoint").on("change", function(e){
	activateTransferButton('leftEndpointContentTable', 'transfer-from-left', 'right-ep-text');
        activateTransferButton('rightEndpointContentTable', 'transfer-from-right', 'left-ep-text');
	setLFCendpoint();
});

$(function(){
	   $("#modal_content").load("modal.html");
	   $("#warning_modal_content").load("expirationWarningModal.html");  
});

$(function(){
           $("#datamanagement_modal_content").load("dataManagement.html");
});

function setLFCendpoint(){
	if (typeof(Storage)!=="undefined") {
	    sessionStorage.lfcendpoint= $('#lfcendpoint').val();
	}
}

function setSEpath() {
	 if (typeof(Storage)!=="undefined") {
	    sessionStorage.seEndpointLeft = $('#leftEndpoint').val();
	    sessionStorage.seEndpointRight = $('#rightEndpoint').val();
	}

}

function saveCheckboxState() {
	if (typeof(Storage)!=="undefined") {
		sessionStorage.checksum = Boolean($('#checksum').prop('checked'));
	        sessionStorage.overwrite = Boolean($('#overwrite').prop('checked'));			
		sessionStorage.lfcregistration = Boolean($('#lfcregistration').prop('checked'));
	}	
}

function refreshFiles() {
        if (sessionStorage.leftCSIndex && sessionStorage.leftCSIndex > 0 ) {
                $('#left-loading-indicator').show();
                $('#leftEpFilter').val('');
                getLoginCS( $('#leftCSName').val(), 'leftStorageLogin', 'leftStorageContent', 'leftCSLoginForm', 'leftLoginIndicator', $('#leftEndpoint').val(), 'leftEndpointContent', 'leftEndpointContentTable', 'left-loading-indicator', 'left-ep-text', 'leftEpFilter', 'leftEndpoint');
                 }
        else {
                getEPContent('leftEndpoint', 'leftEndpointContent', 'leftEndpointContentTable', 'left-loading-indicator', 'left-ep-text', 'leftEpFilter');
        }

}


$('#overwrite').popover();
$('#lfcregistration').popover();
$('#checksum').popover();

</script>
<input type="hidden" id="delegation_id" value="">
<div class="row">
	<div id="modal_content"></div>
	<div id="warning_modal_content"></div>
	<div id="datamanagement_modal_content"></div>
	<?php
		foreach($_SERVER as $h=>$v){
			if ($h == "SSL_CLIENT_S_DN")
				echo "<input type=\"hidden\" id=\"userDN\" value=\"$v\">";
			else if ($h == "SSL_CLIENT_CERT")
				echo "<input type=\"hidden\" id=\"clientCERT\" value=\"$v\">";
		}
	?>
         <legend> 
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
	<div class="row" id="id12"><!-- 
			data-step="12" 
			data-intro="<h3><strong>Congratulations!</strong></h3><h4>That's all! You have finished with success your file(s) submittion!<br/><strong>Let's see live all your submited jobs and their status! Click on the button below to continue!</strong></h4>"
			data-position="bottom-middle-aligned"> -->
		<div class="btn-group-vertical col-xs-5 col-lg-5 col-md-5" id="id5"><!-- 
			data-step="5" 
			data-intro="<h3><strong>Step 5:</strong></h3><h4>Here is the area where is going to be displayed your folder's content.</h4>"
			data-position="bottom"> -->
			
				<div class="" id="id3"><!-- 
					data-step="3" 
					data-intro="<h3><strong>Step 3:</strong></h3><h4>And actually that's it! You can start submitting your jobs!<br/>Here you can choose the storage type of your desire*!<br/>In case you selected the <strong>Dropbox transfer</strong>, the very first step is to <strong>log-in</strong> with your account in order to use this service!<br/>On the other way, if you choose the <strong>&quot;Grid SE&quot;</strong> you have to define the endpoint for the transfer!</h4><h5>*During this tour you will not be asked to choose something.</h5>"
					data-position="bottom">-->
					<select id="leftStorageSelect"></select>
				</div>
			
			
			<div id="leftStorageLogin" class="panel panel-primary">
				<div class="panel-body">
					<input type="hidden" id="leftCSName" value="">
					<form class="form" id="leftCSLoginForm">
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
				<div class="input-group" id="id4">
					<input id="leftEndpoint" type="text" placeholder="Endpoint path"
						class="form-control"
						value="gsiftp://lxfsra10a01.cern.ch/dpm/cern.ch/home/" onchange="setSEpath()" > <span
						class="input-group-btn">
		
						<button class="btn btn-primary" type="button" id="load-left"
							onclick="getEPContent('leftEndpoint', 'leftEndpointContent', 'leftEndpointContentTable', 'left-loading-indicator', 'left-ep-text', 'leftEpFilter')">Load</button>
					</span>
				</div>
				<div class="panel panel-primary" id="dmpanelleft">
                                         <div class="panel-heading text-center">
						<div class="btn-toolbar" id="dmtoolbarleft">
							<div class="btn-group">
                                                                <button type="button"  id="createFolderLeft" class="btn btn-sm"
                                                                        onclick="showDataManagementModal('create',$('#leftEndpoint').val(), 'left','leftEndpointContentTable')">Create 
                                                                        Folder</button>
                                                        </div>
							<div class="btn-group">
                                                                <button type="button"  id="removeLeft" class="btn btn-sm"
                                                                        onclick="showDataManagementModal('remove', $('#leftEndpoint').val(),'left','leftEndpointContentTable')"><i class="glyphicon glyphicon-remove" />&nbsp;Delete
                                                                        </button>
                                                        </div>
							<div class="btn-group">
                                                                <button type="button"  id="renameLeft" class="btn btn-sm"
                                                                        onclick="showDataManagementModal('rename',$('#leftEndpoint').val(), 'left','leftEndpointContentTable')">Rename
                                                                        </button>
                                                        </div>
                                                </div>
					</div>
				</div>
				<div class="panel panel-primary">
					<div class="panel-heading text-center">
						<div class="btn-toolbari" id="filtertoolbarleft">
							<div class="btn-group ">
								<button type="button"  id="selectAllLeft" class="btn btn-sm"
									onclick="selectAllFiles('leftEndpointContent')">Select
									All Files</button>
								<button type="button"  id="selectNoneLeft" class="btn btn-sm"
									onclick="selectNoneFiles('leftEndpointContent')">None</button>
							</div>
							<div class="btn-group">
								<button type="button" class="btn btn-sm"
									onclick="refreshFiles()">
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
		<div class="btn-group btn-group-vertical  col-xs-2 col-lg-2 col-md-2">
			<div class="transfer-buttons" id="id11">
<!-- 				data-step="11" 
				data-intro="<h3><strong>Step 11:</strong></h3><h4>These are the main buttons for the transfer! Choose your files and then click on one of these buttons accordingly in which direction is going to be the tranfer of your desire!</h4>"
				data-position="bottom">
 -->				<button type="button" class="btn btn-primary btn-block"
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
				<br>
			<div class="more-center-options" id="id10">
<!-- 				data-step="10" 
				data-intro="<h3><strong>Step 10:</strong></h3><h4>In this area you have the option to enable/disable some of these additional options!</h4>"
				data-position="right">	
 -->				<table class="table">
				<tr>
					<td>
					   <div>
						<p class="text-left">
			      			<span>
			      			  <input id="overwrite" type="checkbox" onclick="saveCheckboxState()" data-content="If activated tells the system to overwite the file(s) at destination if present"
								rel="popover" data-placement="center" data-trigger="hover" ><b> Overwrite Files</b></input>
			      			</span>	
						</p>
						</div>
					</td>
				</tr>
				<tr>
					<td>
					   <div >
						<p class="text-left">
		      				<span>
		      			  	<input id="checksum" type="checkbox" onclick="saveCheckboxState()"  data-content="If activated tells the system to compare the file checksums after the transfer"
								rel="popover" data-placement="center" data-trigger="hover" ><b>Compare Checksums</b></input>
		      				</span>	
		      				</p>
					  </div>
					</td>
				</tr>
				<tr>
					<td>
					  <div> 
						<p class="text-left">
				      		<span >
				        		<input id="lfcregistration" type="checkbox" onclick="saveCheckboxState()" data-content="If activated tells the system to perform the registration on the specified LFC at the end of the transfer" rel="popover" data-placement="center" data-trigger="hover"><b> LFC Registration </b></input>
				      		</span>
						</p>
						
				      		<div id="lfcendpointshow">
				     		<span>
				      			<input id="lfcendpoint" type="text" class="form-control">
				       		</span>
				      		</div>
					 <div>	
				    </td>
			    </tr>
			    </table>
		    </div>
		</div>
	
		<div class="btn-group-vertical col-xs-5 col-lg-5 col-md-5" id="id6">
			<!-- data-step="6" 
			data-intro="<h3><strong>Step 6:</strong></h3><h4>In this area you can either choose the type of the SE in the same way as before!</h4>"
			data-position="bottom"> -->
			<select id="rightStorageSelect"></select>
			<div id="rightStorageLogin"></div>
			<div id="rightStorageContent">
				<div id="leftStorageContent">
				<div class="input-group">
					<input id="rightEndpoint" type="text" placeholder="Endpoint path" value="gsiftp://lxfsra10a01.cern.ch/dpm/cern.ch/home/"  onchange="setSEpath()"class="form-control"> <span class="input-group-btn">
						<button class="btn btn-primary" type="button" id="load-right"
							onclick="getEPContent('rightEndpoint', 'rightEndpointContent', 'rightEndpointContentTable', 'right-loading-indicator', 'right-ep-text', 'rightEpFilter')">Load</button>
					</span>
				</div>
				 <div class="panel panel-primary" id="dmpanelRight">
                                         <div class="panel-heading text-center">
                                                <div class="btn-toolbar" id="dmtoolbarright">
                                                        <div class="btn-group ">
                                                                <button type="button"  id="createFolderRight" class="btn btn-sm"
                                                                        onclick="showDataManagementModal('create',$('#rightEndpoint').val(), 'right','rightEndpointContentTable')">Create
                                                                        Folder</button>
                                                        </div>
                                                        <div class="btn-group ">
                                                                <button type="button"  id="removeRight" class="btn btn-sm"
                                                                        onclick="showDataManagementModal('remove', $('#rightEndpoint').val(),'right','rightEndpointContentTable')"><i class="glyphicon glyphicon-remove" />&nbsp;Delete
                                                                        </button>
                                                        </div>
                                                        <div class="btn-group ">
                                                                <button type="button"  id="renameRight" class="btn btn-sm"
                                                                        onclick="showDataManagementModal('rename',$('#rightEndpoint').val(), 'right','rightEndpointContentTable')">Rename
                                                                        </button>
                                                        </div>
                                                </div>
                                        </div>
                                </div>

		
				<div class="panel panel-primary">
					<div class="panel-heading text-center">
						<div class="btn-toolbar" id="filtertoolbarright">
							<div class="btn-group" id="id7">
								<button type="button"  id="selectAllRight" class="btn btn-sm"
									onclick="selectAllFiles('rightEndpointContent')">Select
									All Files</button>
								<button type="button"  id="selectNoneRight" class="btn btn-sm"
									onclick="selectNoneFiles('rightEndpointContent')">None</button>
							</div>
							<div class="btn-group" id="id8">
								<button type="button" class="btn btn-sm"
									onclick="getEPContent('rightEndpoint', 'rightEndpointContent', 'rightEndpointContentTable', 'right-loading-indicator', 'right-ep-text', 'rightEpFilter')">
									<i class="glyphicon glyphicon-refresh" />&nbsp;Refresh
								</button>
							</div>
							<div class="btn-group" id="id9">
<!-- 								data-step="9" 
								data-intro="<h3><strong>Filter button:</strong></h3>
											<h4>Specify your file(s) search!<br/>Multiple options: <br/>name,<br/>date,<br/>size of file(s)<br/> or search for simple files by avoiding display the containing folders!</br></h4>"
								data-position="bottom">
 -->								<button type="button" id="rightShowFilterButton"
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

<script type="text/javascript" src="/site-tour/introJs/intro.js"></script>
<script type="text/javascript" src="/js/site-tourTransfer.js"></script>

<script type="text/javascript">
    if (RegExp('multipage', 'gi').test(window.location.search)) {
        myIntro.start();
    }
</script>
