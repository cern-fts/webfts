

	<script> 
	$(function() {											
		 $('#pinfo-form').validate(
		 {
		  submitHandler: function (form) {
				runTransfer();
          },
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
		    $(element).closest('.control-group').removeClass('success').addClass('error');
		  },
		  success: function(element) {
		    element
		    .text('OK!').addClass('valid')
		    .closest('.control-group').removeClass('error').addClass('success');
		  }											 
		 });
	}); 
	</script>
	<h2>Transfer files</h2>
	<form action="" id="pinfo-form" name="pinfo-form" class="form-horizontal">
		<fieldset>
			<legend>User private RSA key and password</legend>
			<div class="alert alert-success">
				<button type="button" class="close" data-dismiss="alert" onclick="$('.alert').hide()">&times;</button>
				The private RSA key can be obtained from the p12 certificate you
				have installed in your browser by using:<br /> <i>&nbsp;&nbsp;&nbsp;openssl
					pkcs12 -in yourCert.p12 -nocerts -nodes | openssl rsa </i>
			</div>
			<div class="control-group">
				<label class="control-label" for="privateKey">Private key</label>
				<div class="controls">
					<textarea id="pemPkey" name="pemPkey" class="field span10"
						rows="10"></textarea>
				</div>
			</div>
			<div class="control-group">
				<label class="control-label" for="privateKeyPass">Private key
					password</label>
				<div class="controls">
					<input type="password" name="pemPass" id="pemPass">
				</div>
				<span class="label label-important controls">DISCLAIMER: the private key and
				password WILL NOT BE TRANSMITTED ANYWHERE. They are only used
				locally (within the user's browser) to generate the proxies needed
				to have access to the FTS web services</span>
				</span>
			</div>
			<?php
			foreach($_SERVER as $h=>$v)
			if ($h == "SSL_CLIENT_S_DN")
				echo "<input type=\"hidden\" id=\"userDN\" value=\"$v\">";
			?>
			<div>
				<legend>Selected files to be tranfered</legend> 
				 <table class="table table-hover table-bordered filelist">
						<tr><td><button class="btn btn-small btn-danger" type="button"><i class="icon-file"/> Remove transfer</button>&nbsp;SE1:/Test/path/file&nbsp;<i class="icon-arrow-right" style="vertical-align: middle;"/>&nbsp;<span style=" vertical-align: middle;">SE2:/Path/to/here/</span></td></tr>
						<tr><td><button class="btn btn-small btn-danger" type="button"><i class="icon-folder-open"/> Remove transfer</button>&nbsp;SE3:/Test/path&nbsp;<i class="icon-arrow-left" style="vertical-align: middle;"/>&nbsp;<span>SE2:/Path/to/here/</span></td></tr>
						<tr><td><button class="btn btn-small btn-danger" type="button"><i class="icon-file"/> Remove transfer</button>&nbsp;SE1:/Test/path/file2&nbsp;<i class="icon-arrow-right" style="vertical-align: middle;"/>&nbsp;SE2:/Path/to/here/</td></tr>											
				 </table>
				<button class="btn btn-primary btn-large span5" type="button" id="load-left">Transfer!</button>				
			</div>
			<legend>Please specify your transfer source and destination</legend>
			<div class="row">			
				<div class="btn-group-vertical">
					<div class="input-append">
						<input class="span5" id="rightEndpoint" type="text" placeholder="Endpoint path">				
						<button class="btn btn-primary" type="button" id="load-left">Load</button>
					</div>					

					<table class="table table-hover table-bordered filelist">
						<tr>
							<td>/Test/path</td>
						</tr>
					</table>						
				</div>
					
				<div class="btn-group btn-group-vertical">
					<button type="submit" class="btn btn-primary" name="submit" id="submit"	value="transfer-from-left">
						<i class="icon-chevron-right icon-white"></i>
					</button>
					<button type="submit" class="btn btn-primary" name="submit" id="submit" value="transfer-from-right">
						<i class="icon-chevron-left icon-white"></i>
					</button>
				</div>							
		
				<div class="btn-group-vertical">
					<div class="input-append">
						<input class="span5 " id="rightEndpoint" type="text" placeholder="Endpoint path">
						<button class="btn btn-primary" type="button" id="load-right">Load</button>
					</div>
					<table class="table table-hover table-bordered filelist "
						id="right-list">
						<tr>
							<td>/Test/path</td>
						</tr>
					</table>
				</div>			
			</div>
		</fieldset>
	</form>

	<!-- Templates -->
	<script type="text/template" id="template-endpoint-select">
									      <form class="well">
									        <input type="text" class="span3 location" name="<%= name %>" placeholder="<%= placeholder %>" />
									        <button type="button" class="btn load">load</button>
									      </form>
									    </script>

	<script type="text/template" id="template-file-list-item">
									      <tr class="<% if (isMarked) { %>info<% } %>">
									        <td>
									          <a class="filelink" href="<%= remote_url %>" onclick="return false;"><%= name %></a>
									        </td>
									      </tr>
									    </script>

	<script type="text/template" id="template-transfer-buttons">
									      <form class="well">
									        <button type="button" id="transfer-from-left" class="btn">transfer from left</button>
									        <button type="button" id="transfer-from-right" class="btn">transfer from right</button>
									      </form>
									    </script>