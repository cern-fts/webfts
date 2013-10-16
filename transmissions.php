<!DOCTYPE HTML>
<!--
	Arcana 2.0 by HTML5 UP
	html5up.net | @n33co
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
-->
<html>
<head>
<title>webFTS - Transmissions</title>
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

<!--[if lte IE 9]><link rel="stylesheet" href="css/style-ie9.css" /><![endif]-->
<!--[if lte IE 8]><script src="js/html5shiv.js"></script><![endif]-->
<script> 
	$(function(){				
	   $("#includedTransmissionsList").load("transmissionsList.html");  
	});
</script>
</head>
<body>
	<div class="container">
	
		<div class="masthead">
			<h3 class="text-muted">webFTS</h3>
			<ul class="nav nav-justified">
				<li><a href="index.php">Home</a></li>
				<li class="active"><a href="#">My jobs</a></li>
				<li><a href="submit.php">Submit a transfer</a></li>
			</ul>
		</div>

		<div class="row">
			<div id="includedTransmissionsList"></div>
		</div>
	</div>
</body>
</html>
