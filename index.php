<!DOCTYPE HTML>
<html lang="en">
<head>
<title>webFTS</title>
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
			<h3 class="text-muted">webFTS (Beta version)</h3>			
			<ul class="nav nav-justified">
				<li class="active"><a href="#">Home</a></li>
				<li><a href="transmissions.php">My jobs</a></li>
				<li><a href="submit.php">Submit a transfer</a></li>
			</ul>
		</div>
		<div>
			&nbsp;
		</div>
		<div>
			<h2>  <span class="label label-info">Do you need to move files between Grid machines?
			</span></h2> 
			<h2>  <span class="label label-info"> Do you think command line interfaces are too complicated? 
			</span></h2>
			<h2> <span class="label label-success">Start to use <strong>webFTS</strong> today and discover how easy can be to transfer files in the Grid 
			</span></h2>
			<h2> <span class="label label-default">WebFTS is powered by FTS3. 
			</span></h2>
		</div>

		<!-- Example row of columns -->
		<div class="row">
			<div class="col-lg-4">
				<h2>Information</h2>
				<p>More information about WebFTS can be found in the official page.</p>
				<p>
					<a class="btn btn-primary" href="https://webfts.web.cern.ch/content/user-guide">View details &raquo;</a>
				</p>
			</div>
			<div class="col-lg-4">
				<h2>EUDAT</h2>
				<p>This is part of something...done by someone...somewhere...called sometimes...EUDAT.</p>
				<p>
					<a class="btn btn-primary" href="http://www.eudat.eu/">View details &raquo;</a>
				</p>
			</div>
			<div class="col-lg-4">
				<h2>CERN</h2>
				<p>This product has been developed at CERN.</p>
				<p>
					<a class="btn btn-primary" href="http://www.cern.ch/">View details &raquo;</a>
				</p>
			</div>
		</div>

		<!-- Site footer -->
		<div class="footer">
			<p>&copy; CERN 2013</p>
		</div>

	</div>
</body>
</html>



