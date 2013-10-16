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
			<h3 class="text-muted">webFTS</h3>			
			<ul class="nav nav-justified">
				<li class="active"><a href="#">Home</a></li>
				<li><a href="transmissions.php">My jobs</a></li>
				<li><a href="submit.php">Submit a transfer</a></li>
			</ul>
		</div>

		<div>
			<span>webFTS: welcome!!!</span>
	
			<a href="#"><img src="img/banner.jpg" alt="" class="img-responsive"/> </a>
	
			<span><strong>webFTS</strong> FTS web interface for file transfering</span>
			<a href="#" class="button">More about FTS</a>
		</div>

		<!-- Example row of columns -->
		<div class="row">
			<div class="col-lg-4">
				<h2>Heading</h2>
				<p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus,
					tellus ac cursus commodo, tortor mauris condimentum nibh, ut
					fermentum massa justo sit amet risus. Etiam porta sem malesuada
					magna mollis euismod. Donec sed odio dui.</p>
				<p>
					<a class="btn btn-primary" href="#">View details &raquo;</a>
				</p>
			</div>
			<div class="col-lg-4">
				<h2>Heading</h2>
				<p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus,
					tellus ac cursus commodo, tortor mauris condimentum nibh, ut
					fermentum massa justo sit amet risus. Etiam porta sem malesuada
					magna mollis euismod. Donec sed odio dui.</p>
				<p>
					<a class="btn btn-primary" href="#">View details &raquo;</a>
				</p>
			</div>
			<div class="col-lg-4">
				<h2>Heading</h2>
				<p>Donec sed odio dui. Cras justo odio, dapibus ac facilisis in,
					egestas eget quam. Vestibulum id ligula porta felis euismod semper.
					Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum
					nibh, ut fermentum massa.</p>
				<p>
					<a class="btn btn-primary" href="#">View details &raquo;</a>
				</p>
			</div>
		</div>

		<!-- Site footer -->
		<div class="footer">
			<p>&copy; Company 2013</p>
		</div>

	</div>
</body>
</html>



