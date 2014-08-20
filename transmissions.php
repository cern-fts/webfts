<!DOCTYPE HTML>
<html lang="en">
<head>
<title>WebFTS - Simplifying power - Jobs</title>
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

<link rel="stylesheet" type="text/css" href="css/site-tour-styles/custom-site-tour.css">
<link rel="stylesheet" href="/paraFiles/css/diffBrsStyles/submitBaseStyles.css"/>
<link rel="stylesheet" type="text/css" href="/css/nav-bar-custom/nav-bar-custom.css">
<!-- <link rel="stylesheet" href="/paraFiles/css/base.css"/> -->


<!-- General Site tour styles -->
<link href="/site-tour/introJs/introjs.css" rel="stylesheet">
<link href="/site-tour/introJs/example/assets/css/bootstrap-responsive.min.css" rel="stylesheet">



<script src="js/bootstrap.min.js"></script>
<script src="js/ftsHelper.js"></script>
<script src="js/jobs.js"></script>
<script src="js/common.js"></script>  

<script src="js/RSAGenerator.js"></script>

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
<script src="js/lib/kjur-jsrsasign/ext/sha1.js"></script>
<script src="js/lib/kjur-jsrsasign/asn1hex-1.1.min.js"></script>
<script src="js/lib/kjur-jsrsasign/rsapem-1.1.min.js"></script>
<script src="js/lib/kjur-jsrsasign/rsasign-1.2.js"></script>
<script src="js/lib/kjur-jsrsasign/x509-1.1.js"></script>
<script src="js/lib/kjur-jsrsasign/pkcs5pkey-1.0.min.js"></script>
<script src="js/lib/kjur-jsrsasign/asn1-1.0.js"></script>
<script src="js/lib/kjur-jsrsasign/asn1x509-1.0.js"></script>
<script src="js/lib/kjur-jsrsasign/crypto-1.1.min.js"></script>
<script src="js/lib/kjur-jsrsasign/base64x-1.1.min.js"></script>
<script src="js/lib/kjur-jsrsasign/keyutil-1.0.min.js"></script>

<!--[if lte IE 9]><link rel="stylesheet" href="css/style-ie9.css" /><![endif]-->
<!--[if lte IE 8]><script src="js/html5shiv.js"></script><![endif]-->
<script> 
	$(function(){			
	   $("#includedTransmissionsList").load("transmissionsList.php");  
	});
</script>
</head>
<body>
	<div class='container-top-outer'>
		<div class="container-top-inner">
			<div class="row">
				<script> 
					$(function(){
					   $("#userAuth").load("userAuth.php"); 
					});
				</script>
				<div id="userAuth"></div>
				<script> 
					$(function(){
					   $("#delegateBtn").load("delegateButton.html"); 
					});
				</script>
				<div id="delegateBtn"></div>
			</div>

			<div class="masthead">
				<h3 class="text-muted">WebFTS  (Beta version)  <small><em>Symplifying power</em></small></h3>
				<ul class="nav nav-justified">
					<li><a href="index.php"><i class="glyphicon glyphicon-home"></i>&nbsp;Home</a></li>
					<li class="active"><a href="#"><i class="glyphicon glyphicon-tasks"></i>&nbsp;My jobs</a></li>
					<li><a href="submit.php"><i class="glyphicon glyphicon-chevron-left"></i><i class="glyphicon glyphicon-chevron-right"></i>&nbsp;Submit a transfer</a></li>
				</ul>
			</div>
		<img src="paraFiles/img/shadow-bottom.png" alt=' ' class='divider'>
		</div>
	</div>
	<div class="main-back">
		<div class="row">
			<div id="includedTransmissionsList"></div>
		</div>
	</div>





<script type="text/javascript" src="/site-tour/introJs/intro.js"></script>
<script type="text/javascript" src="/js/site-tourTransmissions.js"></script>

<script type="text/javascript">
        if (RegExp('multipage', 'gi').test(window.location.search)) {
           myIntro.start();
        }
</script>



<!--


	<script type="text/javascript" src="/site-tour/introJs/intro.js"></script>
	<script type="text/javascript" src="/js/site-tourTransmissions.js"></script>


	<script type="text/javascript">
		//Skip the 1st step about the credentials delegation! Start from the 2nd step!
		myIntro.start();
	</script>
-->	
<!--
	<script type="text/javascript">
		if (RegExp('multipage', 'gi').test(window.location.search)) {
		    introJs().start();
		}
	</script>
-->

</body>
</html>
