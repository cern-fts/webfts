<!DOCTYPE HTML>
<html lang="en">
<head>
<title>webFTS - Submit</title>
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<link rel="shortcut icon" href="img/ico/favicon.png">
<meta name="description" content="" />
<meta name="keywords" content="" />

<script src="js/jquery.min.js"></script>
<script src="js/jquery.validate.min.js"></script> 

<link href="css/bootstrap.min.css" rel="stylesheet">
<link href="css/bootstrap-theme.min.css" rel="stylesheet">
<link href="css/justified-nav.css" rel="stylesheet">
<link href="css/validation.css" rel="stylesheet">
<link href="css/custom.css" rel="stylesheet">
<link href="css/jquery-ui.min.css" rel="stylesheet">


<script src="js/bootstrap.min.js"></script> 
<script src="js/jquery.finderSelect.min.js"></script>
<script src="js/jquery-ui.min.js"></script>


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
<script src="js/lib/kjur-jsrsasign/asn1x509-1.0.js"></script>
<script src="js/lib/kjur-jsrsasign/crypto-1.1.min.js"></script>
<script src="js/lib/kjur-jsrsasign/base64x-1.1.min.js"></script>

<script src="js/lib/js/js-rsa-pem.js"></script>

<script> 
	$(function(){
	   $("#includedContentTransfer").load("transfer.php"); 
	});
</script>
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
				<li><a href="index.php">Home</a></li>
				<li><a href="transmissions.php">My jobs</a></li>
				<li class="active"><a href="#">Submit a transfer</a></li>
			</ul>
		</div>

		<div class="row">
			<div id="includedContentTransfer"></div>
		</div>
	</div>
</body>
</html>
