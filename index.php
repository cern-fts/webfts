<!DOCTYPE HTML>
<html lang="en">
<head>
<title>WebFTS - Simplifying power </title>
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<link rel="shortcut icon" href="img/ico/favicon.png">
<meta name="description" content="" />
<meta name="keywords" content="" />

<link href="css/bootstrap.min.css" rel="stylesheet">
<link href="css/bootstrap-theme.min.css" rel="stylesheet">
<link href="css/justified-nav.css" rel="stylesheet">
<link href="css/validation.css" rel="stylesheet">

<script src="js/jquery.min.js"></script>
<script src="js/jquery.validate.min.js"></script>
</head>

<body>

	<div class="container">
		<div class="row">
			<script> 
				$(function(){
				   $("#userAuth").load("userAuth.php"); 
				});
			</script>
			<div id="userAuth"></div>
		</div>
		<div class="masthead">
			<h3 class="text-muted">WebFTS (Beta version)  <small><em>Symplifying power</em></small></h3>			
			<ul class="nav nav-justified">
				<li class="active"><a href="#"><i class="glyphicon glyphicon-home"></i>&nbsp;Home</a></li>
				<li><a href="transmissions.php"><i class="glyphicon glyphicon-tasks"></i>&nbsp;My jobs</a></li>
				<li><a href="submit.php"><i class="glyphicon glyphicon-chevron-left"></i><i class="glyphicon glyphicon-chevron-right"></i>&nbsp;Submit a transfer</a></li>				
			</ul>
		</div>
		<div>
			&nbsp;
		</div>
		<div>
			<h2> <span class="label label-info"><i class="glyphicon glyphicon-arrow-right"></i>&nbsp;Do you need to move files between grid machines?
			</span></h2> 
			<h2> <span class="label label-info"><i class="glyphicon glyphicon-arrow-right"></i>&nbsp;Looking for a graphical interface to manage your transfers? 
			</span></h2>
			<h1> <span class="label label-success">Start to use <strong>WebFTS</strong> today and discover how easy it is to transfer files on the grid! 													
			</span></h1>
		</div>
		<!-- Site footer -->
		<div class="footer">			
				<h3>
				<span class="label label-primary"><i class="glyphicon glyphicon-info-sign"></i>&nbsp;More information about WebFTS and the user guide can be found in the official page.</span>
				
				<a class="btn btn-sm btn-primary" href="http://webfts.web.cern.ch/content/user-guide">View details &raquo;</a>
				</h3>
				<h3>
				<span class="label label-primary"><i class="glyphicon glyphicon-wrench"></i>&nbsp;Official support: fts-support@cern.ch</span>								
				</h3>
			<div class="row">
				<p class="pull-right">WebFTS is powered by FTS3. CERN - EUDAT, 2014</p>
			</div>
	</div>
</body>
</html>



