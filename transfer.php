<script>
$(function(event) {											
	 $('#pinfo-form').validate(
	  {
	  rules: {
	    pemPkey: {
	      minlength: 1024,
	      required: true
	    },
	    pemPass: {
	      minlength: 1,	
	      required: true,										      
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
	console.log( "ready!" );	
});

$("#pinfo-form").submit(function(event){
  event.preventDefault();	
  if ($("#pinfo-form").valid()){ 
  	doDelegate(document.getElementById('delegation_id').value, document.getElementById('pemPkey').value, document.getElementById('pemPass').value, document.getElementById('userDN').value);
  }	
  return false;
});

$( "#delegateButton" ).click(function() {
	$( "#pinfo-form" ).submit();
});
		
$('#popoverDelegate').popover();

//To prevent the modal window to be closed by pressing ESC or clicking outside
$('#delegationModal').modal({
	  backdrop: 'static',
	  keyboard: false
	})
</script>
<h2>Transfer files</h2>
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
						<strong>DISCLAIMER</strong>: <small>the private key and
							password WILL NOT BE TRANSMITTED ANYWHERE. They are only used locally
							(within the user's browser) to generate the proxies needed to have
							access to the FTS web services.</small>   
					</div>
			
					<div class="row control-group">			
						<label class="control-label" for="privateKey">Private key</label>
						<textarea id="pemPkey" name="pemPkey" class="field form-control" rows="5" placeholder="RSA private key"></textarea>
					</div>
					
					<div class="row control-group">
						<label class="control-label" for="privateKeyPass">Private key password</label> 
						<input class="form-control" type="password"	name="pemPass" id="pemPass" placeholder="Password">					
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
			foreach($_SERVER as $h=>$v)
			if ($h == "SSL_CLIENT_S_DN")
				echo "<input type=\"hidden\" id=\"userDN\" value=\"$v\">";
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
				<input id="rightEndpoint" type="text" placeholder="Endpoint path" class="form-control"> <span class="input-group-btn">
					<button class="btn btn-primary" type="button" id="load-left">Load</button>
				</span>
			</div>

			<div class="panel panel-primary">
				<div class="panel-heading">
					<div class="btn-toolbar">
						<div class="btn-group ">
							<button type="button" class="btn btn-sm">Select All</button>
							<button type="button" class="btn btn-sm">None</button>
						</div>
						<div class="btn-group">
							<button type="button" class="btn btn-sm">
								<i class="glyphicon glyphicon-refresh" />&nbsp;Refresh
							</button>
						</div>
						<div class="btn-group">
							<input type="text" class="form-control input-sm" placeholder="Filter">
						</div>
						&nbsp; <i class="glyphicon glyphicon-info-sign"/>
					</div>
				</div>
				<ol class="breadcrumb">
						<li><a href="#">Home</a></li>
						<li><a href="#">Library</a></li>
						<li class="active">Data</li>
				</ol>
				<div class="panel-body">
					
					Here should go the tree
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
<!-- 			onclick="runTransfer()"> -->
<!-- 				onclick="addTransmissionLine('transfersTable', getLeft(), getType(), getRight())"> -->
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
					<button class="btn btn-primary" type="button" id="load-right">Load</button>
				</span>
			</div>

			<div class="panel panel-primary">
				<div class="panel-heading">
					<div class="btn-toolbar">
						<div class="btn-group ">
							<button type="button" class="btn btn-sm">Select All</button>
							<button type="button" class="btn btn-sm">None</button>
						</div>
						<div class="btn-group">
							<button type="button" class="btn btn-sm">
								<i class="glyphicon glyphicon-refresh" />&nbsp;Refresh
							</button>
						</div>
						<div class="btn-group">
							<input type="text" class="form-control input-sm" placeholder="Filter">							
						</div>
						&nbsp; <i class="glyphicon glyphicon-info-sign"/>
					</div>
				</div>
				<ol class="breadcrumb">
					<li><a href="#">Home</a></li>
					<li><a href="#">Library</a></li>
					<li class="active">Data</li>
				</ol>
				<div class="panel-body">					
					Here should go the tree
				</div>
			</div>


		</div>
	</div>
<!-- </form> -->
