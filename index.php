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
		<?php
			foreach($_SERVER as $h=>$v)
			if ($h == "SSL_CLIENT_S_DN_CN_2")
				echo "<span class=\"pull-right\">You are authenticated as <strong>$v</strong></span>";
		?>
		<div class="masthead">
			<h3 class="text-muted">webFTS (Beta version)</h3>			
			<ul class="nav nav-justified">
				<li class="active"><a href="#">Home</a></li>
				<li><a href="transmissions.php">My jobs</a></li>
				<li><a href="submit.php">Submit a transfer</a></li>
			</ul>
		</div>

		<div>
			<a href="#"><img src="img/banner.jpg" alt="" class="img-responsive"/> </a>
	
			<span><strong>webFTS: </strong> FTS web interface for file transfering.</span>
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
				<p>This product has been developed as part of the European project EUDAT.</p>
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



