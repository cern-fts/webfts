<!DOCTYPE HTML>
<!--
	HTML TEMPLATE INFO:
	Arcana 2.0 by HTML5 UP
	html5up.net | @n33co
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
-->
<html>
<head>
<title>webFTS</title>
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<link rel="shortcut icon" href="img/ico/favicon.png">
<meta name="description" content="" />
<meta name="keywords" content="" />
<link
	href="https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,300italic,700"
	rel="stylesheet" />
<script src="js/jquery.min.js"></script>
<script src="js/config.js"></script>
<script src="js/skel.min.js"></script>
<script src="js/skel-panels.min.js"></script>
<noscript>
	<link rel="stylesheet" href="css/skel-noscript.css" />
	<link rel="stylesheet" href="css/style.css" />
	<link rel="stylesheet" href="css/style-desktop.css" />
</noscript>
<!--[if lte IE 9]><link rel="stylesheet" href="css/style-ie9.css" /><![endif]-->
<!--[if lte IE 8]><script src="js/html5shiv.js"></script><![endif]-->
<script> 
			$(function(){
			   $("#includedContentFooter").load("footer.html"); 
			});
		</script>
</head>
<body>

	<!-- Header -->

	<div id="header-wrapper">
		<header class="container" id="site-header">
			<div class="row">
				<div class="12u">
					<div id="logo">
						<h1>webFTS</h1>
					</div>
					<nav id="nav">
						<ul>
							<li class="current_page_item"><a href="index.php">Homepage</a></li>
							<li><a href="transmissions.php">My transmissions</a></li>
							<li><a href="submit.php">Submit a transfer</a></li>
						</ul>
					</nav>
				</div>
			</div>
		</header>
	</div>

	<!-- Main -->

	<div id="main-wrapper">
		<div class="container">

			<!-- Banner -->

			<div class="row">
				<div class="12u">
					<div id="banner">
						<div class="caption">
							<?php
							foreach($_SERVER as $h=>$v)
							if ($h == "SSL_CLIENT_S_DN_CN_2")
								echo "<span>You are authenticated as <strong>$v</strong></span>";
							echo '<a href="#" class="button">See the complete DN</a>';
							header('Content-type: text/html');
							?>
						</div>
						<a href="#"><img src="img/banner.jpg" alt="" /> </a>
						<div class="caption">
							<span><strong>webFTS</strong> FTS web interface for file
								transfering</span> <a href="#" class="button">More about FTS</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Footer -->
	<div id="includedContentFooter"></div>
</body>
</html>
