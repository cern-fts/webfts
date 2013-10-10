<!DOCTYPE HTML>
<!--
	Arcana 2.0 by HTML5 UP
	html5up.net | @n33co
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
-->
<html>
<head>
<title>webFTS - Submit</title>
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<link rel="shortcut icon" href="img/ico/favicon.png">
<meta name="description" content="" />
<meta name="keywords" content="" />
<link href="https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,300italic,700" rel="stylesheet" />

<link href="css/bootstrap.min.css" rel="stylesheet">
<link href="css/bootstrap-responsive.min.css" rel="stylesheet">
<link href="css/validation.css" rel="stylesheet">
<link href="css/manual.css" rel="stylesheet">

<script src="js/jquery.min.js"></script>
<script src="js/jquery.validate.min.js"></script>

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


<script src="js/ftsHelper.js"></script>
<script src="js/RSAGenerator.js"></script>
<script src="js/transfer.js"></script>

<script src="js/lib/yahoo/yahoo-min.js"></script>
<script src="js/lib/glibs/core-min.js"></script>
<script src="js/lib/glibs/enc-base64-min.js"></script>
<script src="js/lib/glibs/sha1.js"></script>
<script src="js/lib/kjur-jsrsasign/ext/jsbn.js"></script>

<script src="js/lib/js/hex.js"></script>
<script src="js/lib/js/base64E.js"></script>
<script src="js/lib/js/oids.js"></script>
<script src="js/lib/js/asn11.js"></script>

<script src="js/lib/kjur-jsrsasign/ext/jsbn2.js"></script>
<script src="js/lib/kjur-jsrsasign/ext/prng4.js"></script>
<script src="js/lib/kjur-jsrsasign/ext/rsa.js"></script>
<script src="js/lib/kjur-jsrsasign/ext/rsa2.js"></script>
<script src="js/lib/kjur-jsrsasign/ext/base64.js"></script>
<script src="js/lib/kjur-jsrsasign/asn1hex-1.1.min.js"></script>
<script src="js/lib/kjur-jsrsasign/rsapem-1.1.min.js"></script>
<script src="js/lib/kjur-jsrsasign/rsasign-1.2.min.js"></script>
<script src="js/lib/kjur-jsrsasign/x509-1.1.min.js"></script>
<script src="js/lib/kjur-jsrsasign/pkcs5pkey-1.0.min.js"></script>
<script src="js/lib/kjur-jsrsasign/asn1-1.0.min.js"></script>
<script src="js/lib/kjur-jsrsasign/asn1x509-1.0.min.js"></script>
<script src="js/lib/kjur-jsrsasign/crypto-1.1.min.js"></script>
<script src="js/lib/kjur-jsrsasign/base64x-1.1.min.js"></script>

<script src="js/lib/js/js-rsa-pem.js"></script>

<script> 
	$(function(){
	   $("#includedContentTransfer").load("transfer.php"); 
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
							<li><a href="index.php">Homepage</a></li>
							<li><a href="transmissions.php">My transmissions</a></li>
							<li class="current_page_item"><a href="submit.php">Submit a transfer</a></li>
						</ul>
					</nav>
				</div>
			</div>
		</header>
	</div>

	<!-- Main -->
	<div id="main-wrapper" >
		<div class="container">
			<div class="row">
				<div class="12u">
					<!-- Content -->
					<div id="includedContentTransfer"></div>
				</div>					
			</div>
		</div>
	</div>

	<!-- Footer -->
	<div id="includedContentFooter"></div>
</body>
</html>
