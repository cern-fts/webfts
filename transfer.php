<script>
jQuery.validator.addMethod("checkCert", function (value, element) {
    return value.substring(0,31)=="-----BEGIN RSA PRIVATE KEY-----";
}, "The private key must start with -----BEGIN RSA PRIVATE KEY-----");
$(function(event) {											
	 $('#pinfo-form').validate(
	  {
	  rules: {
	    pemPkey: {
	      minlength: 1024,
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
	getDelegationID("delegation_id");

    //$("#leftEndpointContentTable").finderSelect({enableDesktopCtrlDefault:true, totalSelector:".leftSelectedCount" , selectClass:'label-info'});    
    //$("#rightEndpointContentTable tbody").finderSelect({enableDesktopCtrlDefault:true, totalSelector:".rightSelectedCount" , selectClass:'label-info'});    
    
	
	renderFolderContent("leftEndpointContentTable", "leftSelectedCount");
	renderFolderContent("rightEndpointContentTable", "rightSelectedCount");
	
	initialLoadState('leftEndpoint', 'load-left');
	initialLoadState('rightEndpoint', 'load-right');
	console.log( "ready!" );	
});

$("#pinfo-form").submit(function(event){
  event.preventDefault();	
  if ($("#pinfo-form").valid()){ 
  	doDelegate(document.getElementById('delegation_id').value, document.getElementById('pemPkey').value,
  		  	   document.getElementById('userDN').value, document.getElementById('clientCERT').value);
  }	
  return false;
});

$( "#delegateButton" ).click(function() {
	$( "#pinfo-form" ).submit();
});
		
$('#popoverDelegate').popover();

//To prevent the modal window to be closed by pressing ESC or clicking outside
$('#delegationModal').modal({
	  show: false,	
	  backdrop: 'static',
	  keyboard: false
});

//To do the validation of the form even on paste
$("#pemPkey").bind('input propertychange', function(){
	$("#pinfo-form").valid();
});
</script>
	<h2>Transfer files</h2>
	<span class="pull-right" id="proxyTimeSpan">Loading proxy...</span>
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
					<div class="alert alert-danger">
						<strong>DISCLAIMER</strong>: <small>the private key WILL NOT BE TRANSMITTED ANYWHERE. It is only used locally
							(within the user's browser) to generate the proxies needed to have
							access to the FTS services.</small>   
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

	<div id="selectedFiles" style="display: none">
		<?php
			foreach($_SERVER as $h=>$v){
				if ($h == "SSL_CLIENT_S_DN")
					echo "<input type=\"hidden\" id=\"userDN\" value=\"$v\">";
				else if ($h == "SSL_CLIENT_CERT")
					echo "<input type=\"hidden\" id=\"clientCERT\" value=\"$v\">";				
			}
		?>
		<legend>Selected files to be tranfered</legend>
		<div class="well">
			<div class="btn-group-horizontal">
				<div class="btn-group">
					<button class="btn btn-primary btn-sm" type="button" id="selectAllTransfers" name="selectAllTransfers" onclick="select(true)">Select all</button>
					<button class="btn btn-primary btn-sm" type="button" id="selectNoneTransfers" onclick="select(false)">Select none</button>
				</div>
				<button class="btn btn-danger btn-sm" type="button" id="removeSelectedTransfers" onclick="removeSelected()">
					<i class="glyphicon glyphicon-trash glyphicon-white" />&nbsp;Cancel	selected
				</button>
				<button class="btn btn-success btn-sm" type="submit" name="submit" id="submit">
					<i class="glyphicon glyphicon-play glyphicon-white" />&nbsp;Start transfer!
				</button>
				<span class="pull-right">Files to be transfered <span class="filesNumber badge">42</span></span>
			</div>
			<table class="table table-hover table-bordered filelist" id="transfersTable">
				<tbody></tbody>
			</table>
		</div>
	</div>
	<legend>Please specify your transfer source and destination</legend>
	<div class="row">
		<div class="btn-group-vertical col-lg-5">
			<div class="input-group">
				<input id="leftEndpoint" type="text" placeholder="Endpoint path" class="form-control" value="surl=gsiftp://lxfsra10a01.cern.ch/dpm/"> <span class="input-group-btn">
					<button class="btn btn-primary" type="button" id="load-left" onclick="getEPContent('leftEndpoint', 'leftEndpointContent', 'leftEndpointContentTable', 'left-loading-indicator')">Load</button>
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
							<button type="button" class="btn btn-sm" onclick="getSelectedFiles('leftEndpointContent')" >
								<i class="glyphicon glyphicon-refresh"/>&nbsp;Refresh
							</button>
						</div>
						<div class="btn-group">
							<input type="text" class="form-control input-sm" placeholder="Filter">
						</div>
						&nbsp; <i class="glyphicon glyphicon-info-sign"/>
					</div>
				</div>
				<div class="panel-body">
					<div id="left-loading-indicator" style="display:none" class="row"> 
						<ul class="pager">
							<li><label class="text-center"> Loading...</label>&nbsp;<img class="pagination-centered" src="img/ajax-loader.gif"/></li>
						</ul>												
					</div>		
					<div id="leftEndpointContent">
						<table class="table table-condensed" id="leftEndpointContentTable">
							<thead>
								<tr>
									<td>Name</td>
								</tr>
							</thead>
							<tbody>
								<tr><td></td></tr>
							</tbody>
						</table>
						<span>
							<span class="leftSelectedCount"> 0 </span>
							File(s) Selected &nbsp;
						</span>
					</div>
				</div>
			</div>
		</div>
		<script>
		$( "#transfer-from-left" ).click(function( event ) {
		  event.preventDefault();
		  //runTransfer();
		  return false;
		});
		</script>
		<div class="btn-group btn-group-vertical col-md-2">
			<button type="button" class="btn btn-primary btn-block"	name="transfer-from-left" id="transfer-from-left"> 
				<i class="glyphicon glyphicon-chevron-right"></i>
			</button>
			<button type="button" class="btn btn-primary btn-block" name="transfer-from-right" id="transfer-from-right"> 
<!-- 			onclick="runTransfer()"> -->
<!-- 				onclick="addTransmissionLine('transfersTable', getRight(), getType(), getLeft())"> -->
				<i class="glyphicon glyphicon-chevron-left glyphicon-white"></i>
			</button>
		</div>

		<div class="btn-group-vertical col-lg-5">
			<div class="input-group">
				<input id="rightEndpoint" type="text" placeholder="Endpoint path" class="form-control"> <span class="input-group-btn">
					<button class="btn btn-primary" type="button" id="load-right" onclick="getEPContent('rightEndpoint', 'rightEndpointContent', 'rightEndpointContentTable', 'right-loading-indicator')">Load</button>
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
							<button type="button" class="btn btn-sm" onclick="getSelectedFiles('rightEndpointContent')" >
								<i class="glyphicon glyphicon-refresh"/>&nbsp;Refresh
							</button>
						</div>
						<div class="btn-group">
							<input type="text" class="form-control input-sm" placeholder="Filter">							
						</div>
						&nbsp; <i class="glyphicon glyphicon-info-sign"/>
					</div>
				</div>
				<div class="panel-body">						
					<div id="right-loading-indicator" style="display:none" class="row"> 
						<ul class="pager">
							<li><label class="text-center"> Loading...</label>&nbsp;<img class="pagination-centered" src="img/ajax-loader.gif"/></li>
						</ul>												
					</div>		
					<div id="rightEndpointContent">	
						<table class="table table-condensed" id="rightEndpointContentTable">
							<thead>
								<tr>
									<td>Name</td>
								</tr>
							</thead>
							<tbody>
								<tr><td></td></tr>
							</tbody>
						</table>
						<span>
							<span class="rightSelectedCount"> 0 </span>
							File(s) Selected &nbsp;
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
<!-- </form> -->
