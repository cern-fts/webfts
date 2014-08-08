<!DOCTYPE HTML >
<html lang="en">
<head>

<title >WebFTS - Simplifying power </title >
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<link rel="shortcut icon" href="img/ico/favicon.png">
<meta name="description" content="" />
<meta name="keywords" content="" />

<link href="css/bootstrap.min.css" rel="stylesheet">
<link href="css/bootstrap-theme.min.css" rel="stylesheet">
<!-- <link href="assets/css/bootstrap-responsive.css" rel="stylesheet"> -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1, maximun-scale=1, user-scalable=no">
<!-- <link href="css/justified-nav.css" rel="stylesheet"> -->
<link href="css/validation.css" rel="stylesheet" >

<!-- custom slideshow styles -->
<link rel="stylesheet" type="text/css" href="css/carousel styles/custom-carousel.css">

<!-- General Site tour styles -->
<link href="/site-tour/intro.js/introjs.css" rel="stylesheet">

<!-- custom site-tour styles -->
<link rel="stylesheet" type="text/css" href="css/site-tour-styles/custom-site-tour.css">

<!-- custom nav-bar styles -->
<link rel="stylesheet" type="text/css" href="/css/nav-bar-custom/nav-bar-custom.css">

<!-- <link rel='stylesheet' href='paraFiles/css/diffBrsStyles/tryFire_scratch.css' type='text/css'>-->
<link href="/site-tour/intro.js/example/assets/css/bootstrap-responsive.min.css" rel="stylesheet">


<!--Parallax scripts start-->
<script type="text/javascript" src='http://codeorigin.jquery.com/jquery-2.0.3.min.js'></script>
<script type="text/javascript" src='paraFiles/js/jquery.stellar.min.js'></script>
<script type="text/javascript" src='paraFiles/js/waypoints.js'></script>
<script type="text/javascript" src='paraFiles/js/jquery.easing.1.3.js'></script>
<script type="text/javascript" src='paraFiles/js/main.js'></script>
<!--Parallax scripts ends-->

<!-- Scroll to top -->
<script type="text/javascript" src='/site-tour/scroll-to-top.js'></script>
<script type="text/javascript" src='/js/disableScalability.js'></script>



<!-- JQuery -->
<script src="js/jquery.min.js"></script>
<script src="js/jquery.validate.min.js"></script>

<!-- Browser Compatibility styles -->
<link rel="stylesheet" href="/paraFiles/css/base.css"/>

<!-- Browser Compatibility starts to apply different stylesheets-->
<script type="text/javascript">

var nAgt = navigator.userAgent;
var browserName  = navigator.appName;
var nameOffset,verOffset,ix;

	// In Firefox, the true version is after "Firefox" 
 if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
 browserName = "Firefox";
}
// In Chrome, the true version is after "Chrome" 
else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
 browserName = "Chrome";
}
// In Safari, the true version is after "Safari" or after "Version" 
else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
 browserName = "Safari";
}
// In MSIE, the true version is after "MSIE" in userAgent
else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
 browserName = "Microsoft Internet Explorer";
}
// In most other browsers, "name/version" is at the end of userAgent 
else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < 
          (verOffset=nAgt.lastIndexOf('/')) ) 
{
 browserName = nAgt.substring(nameOffset,verOffset);
 fullVersion = nAgt.substring(verOffset+1);
 if (browserName.toLowerCase()==browserName.toUpperCase()) {
  browserName = navigator.appName;
 }
}

/*
  In Opera, the true version is after "Opera" or after "Version"
  else if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
  browserName = "Opera";
  }
*/
	// document.write(browserName);

 if (browserName == 'Firefox') {
 	document.write("<link rel='stylesheet' href='paraFiles/css/diffBrsStyles/FirefoxDiff.css' type='text/css'>");
 }
 else if (browserName == 'Chrome'){
 	document.write("<link rel='stylesheet' href='paraFiles/css/diffBrsStyles/ChromeDiff.css' type='text/css'>");
 }
 else if (browserName == 'Safari'){
 	document.write("<link rel='stylesheet' href='paraFiles/css/diffBrsStyles/SafariDiff.css' type='text/css'>");

 }
 else if (browserName == 'Microsoft Internet Explorer') {
 	document.write("<link rel='stylesheet' href='paraFiles/css/diffBrsStyles/IEDiff.css' type='text/css'>");
 } 
 else{
 	document.write("<link rel='stylesheet' href='paraFiles/css/styles.css' type='text/css'>");
 }

</script>
<!-- Browser Compatibility ends-->

</head>


<body>
	<div class='container-top-outer' data-step="1" data-intro="<h3><strong>Here is the main navigation bar!</strong></h3><h4><br/> You can easily submit your file jobs to different endpoints, manage your jobs and see details about them!</h4>" data-position='bottom-middle-aligned'>
		<div class="container-top-inner" >
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
				<ul class="nav nav-justified" >
					<li class="active" 
						data-step='2' 
						data-intro="<h3><strong>Home:</strong></h3><h4>Kept informed always! Learn first all the recent WebFTS news!</h4>"
						data-position='bottom'>
						<a href="#"><i class="glyphicon glyphicon-home"></i>&nbsp;Home</a>
					</li>
					<li data-step="4" 
						data-intro="<h3><strong>Check your submitted jobs:</strong></h3><h4>Check in real time the progress of your transfered jobs!<strong></br>Explore the 'Submit a transfer' page</strong></h4>"
						data-position='bottom'>
						<a href="transmissions.php"><i class="glyphicon glyphicon-tasks"></i>&nbsp;My jobs</a>
					</li>
					<li data-step="3" 
						data-intro="<h3><strong>Start from here:</strong></h3><h4>Do you have a valid certificate on your browser? Submit your transfer more quickly and easily than ever, only by defining the endpoints of your choice for each particular transfer!</h4>" 
						data-position='bottom'>
						<a href="submit.php"><i class="glyphicon glyphicon-chevron-left"></i><i class="glyphicon glyphicon-chevron-right"></i>&nbsp;Submit a transfer</a>
					</li>				
				</ul>
			</div>
		</div>
		<img src="paraFiles/img/shadow-bottom.png" alt=' ' class='divider' >
	</div>
		
	<!--Parallax scrolling starts-->
	<div class="container-central">			
			<div class='main border-element'>
				<div class='slide' id='slide1' data-slide='1' data-stellar-background-ratio='1'>

					<div class='container-fluid border-element'>
						<div class='row-fluid border-element' id='main-area-slide1'>
							<div class='col-md-4 col-md-offset-1 col-sm-4 col-sm-offset-1 col-sm-4 col-sm-offset-1' id='front-left-block'>
									<div class="news-title">
										<span class='glyphicon glyphicon-ok-sign'></span> Release 3.2.22:<br/>
									</div>
									<div class="news-content">
										<div class='glyphicon glyphicon-ok'>&#09 UDT support,</div>
										<div class='glyphicon glyphicon-ok'>&#09 configuring FTS3 to use GridFTP/UDT instead of GridFTP/TCP</div>
				    				</div>	
				    				<div class='jumbotron-fluid' id='readMore'>
										<a class="btn btn-info btn-responsive"  onclick="window.open(this.href,'_blank');return false;" href="http://fts3-service.web.cern.ch/documentation/releases"><strong>Read more...</strong></a>
									</div>			
							</div>
							<div class='col-md-6 col-sm-6 center-left-block col-md-offset-1 col-sm-offset-1 text-center' id='front-right-block'>
								<div class="carousel-cust-container border-element">
									<div id="this-carousel-id" class="carousel slide c-fade"><!-- class of slide for animation -->
											  
									    <div class="carousel-inner">
										    <div class="item active">
										    	<img src="img/slideshow/1FTS.png" rel="nofollow" target="_blank" title="" class="vglnk" alt=" " />
										    	<div class="carousel-caption">
										        	<p><h3>Many millions of files transfered across continents daily</h3></p>
										    	</div>
										    </div>
										    <div class="item">
											    <img src="img/slideshow/2.png" rel="nofollow" target="_blank" title="" class="vglnk" alt=" " />
											    <div class="carousel-caption">
			   								    	<p><h3>Around 15 Petabytes of data transfered each month!</h3></p>
											    </div>
										    </div>
										    <div class="item">
										    	<img src="img/slideshow/4_logo_cern_450x300.png" rel="nofollow" target="_blank" title="" class="vglnk" alt="" />
										    	<div class="carousel-caption">
										        	<p><h3>European Organisation for Nuclear Research</h3></p>
										    	</div>
										    </div>
										    <div class="item">
										    	<img src="img/slideshow/3.png" rel="nofollow" target="_blank" title="" class="vglnk" alt="" />
										    	<div class="carousel-caption">
										        	<p><h3>CERN</h3></p>
										    	</div>
										    </div>
										    
									    </div><!-- /.carousel-inner -->
											
									 	<!--Next and Previous controls below
									        href values must reference the id for this carousel -->
										<!-- 									    
									    <a class="carousel-control left" href="#this-carousel-id" data-slide="prev">&lsaquo;</a>
									    <a class="carousel-control right" href="#this-carousel-id" data-slide="next">&rsaquo;</a>
									    -->
									</div><!-- /.carousel -->
								</div><!-- carousel-cust-container-->
							</div>
						</div>
					</div>

					<div class="container-fluid border-element">
						<div class='row-fluid sticky-bottom border-element' id="pointer">
							<div class='col-md-4 col-md-offset-4 col-sm-4 col-sm-offset-4 runew-label-1 wobble-vertical'>
								<span>Are you new ?<br/>Click here!</span>
							</div>
								<p class='col-md-4 col-md-offset-4 col-sm-4 col-sm-offset-4 button' data-slide='2' title=' ' style='text-align: center'></p>
						</div>	
					</div>

				</div>

				<!-- Start of Slide-2  -->
				<div class='slide' id='slide2' data-slide='2' data-stellar-background-ratio='0.7'>

					<div class='row'>						
						<div class='col-md-6 col-md-offset-1 col-sm-6 col-sm-offset-1 '>
							<div class='row info-block-desc-dark' id='info-block-desc-dark-fixed'>
								<div class='info-block-header-desc'>
									<p>What is WebFTS? </p>
								</div>  
								<div class='info-block-desc'> 
									<p>WebFTS is a file transfer and management solution which allows users to invoke reliable, managed data transfers on distributed infrastructures.<br/><br/> Created following simplicity and efficiency criteria, WebFTS allows the user to access and interact with multiple storage elements. Their content becomes browsable and different filters can be applied to get a set of files to be transferred. Transfers can be invoked and capabilities are provided for checking the detailed status of the different transfers and resubmitting any of them with only one click.<br/><br/> The “transfer engine” used is FTS3, the service responsible for distributing the majority of LHC data across WLCG infrastructure. This provides WebFTS with reliable, multi-protocol (gridftp, srm, http, xrootd), adaptively optimised data transfers</p>
								</div>
							</div>
						</div>
					</div>

					<div class="container-fluid border-element">
						<div class='row-fluid sticky-bottom-continue border-element'>
							<div class='col-md-4 col-md-offset-4 col-sm-4 col-sm-offset-4' id='continue-label'>
								<p>Continue...</p>
							</div>
							<p class='col-md-4 col-md-offset-4 col-sm-4 col-sm-offset-4 button' id="pointer" data-slide='3' title=' ' style='text-align: center'></p>
						</div>
					</div>
				</div>
				<!-- End of Slide-2 -->

				<!-- Start of Slide-3  -->
				<div class='slide' id='slide3' data-slide='3' data-stellar-background-ratio='0.7'>

					<div class='row'>													
							<div class='col-md-6 col-md-offset-5 col-sm-6 col-sm-offset-5 '>
								<div class='row info-block-black'> 
									<div class="info-block-header-desc">
										<p>Who can transfer files through WebFTS?<br/><br/></p>
									</div>
									<div class="info-block-desc"> 
										<p><strong>Everybody</strong> who has a valid certificate installed in his/her browser!<br/><br/>Supported browsers are <strong>Chrome </strong> and <strong>Firefox </strong>. Supported platforms are <strong> Linux</strong>, <strong>OsX</strong> and <strong>Windows</strong>.<br/>The authentication with the <strong>Grid Storage Elements (SE)</strong> is done based on certificates.</p>
									</div>
								</div>
							</div>
					</div>

					<div class="container-fluid border-element">
						<div class='row-fluid sticky-bottom-continue border-element'>
							<div class='col-md-4 col-md-offset-4 col-sm-4 col-sm-offset-4 border-element' id='continue-label-earth'>
								<p>Continue...</p>
							</div>
							<p class='col-md-4 col-md-offset-4 col-sm-4 col-sm-offset-4 button' id="pointer" data-slide='4' title='' style='text-align: center'></p>
						</div>
					</div>

				</div>
				<!--End of Slide-3-->

				<!-- Start of Slide-4  -->
				<div class='slide' id='slide4' data-slide='4' data-stellar-background-ratio='0.7'>
					<div class='row-fluid'>						
						<div class='col-md-5 col-md-offset-1 col-sm-5 col-sm-offset-1 '>
							<div class='row-fluid info-block-desc-dark' id='info-block-desc-dark-sl4'>
								<div class="info-block-header-desc">
									<p>Is it difficult? <br/>How to start?<br/></p>
								</div>	
								<p class="info-block-desc"> 
									Since you have a valid certificate in your browser, start with submitting a transfer!
									<br/>
									You need help? Take a virtual tour by clicking here!
									<br/>
								</p>
								<div class='row-fluid'>
									<p class='col-md-4 col-md-offset-9 col-sm-4 col-sm-offset-9 jumbotron  border-element ' id="pointer">
										<a class="btn btn-primary btn-lg back-to-top" href="#" href='javascript:void(0);' id="startTourButton"><strong>Take a tour!</strong></a>
									</p>
								</div>
							</div>
						</div>	
					</div>
					
				</div>
				<!--End of Slide-4-->

			</div><!--End of main -->
	</div> <!--End of container-central-->
	<!--Parallax scrolling ends -->

	<!-- multi - Site tour script starts -->
	<script type="text/javascript" src="site-tour/intro.js/intro.js"></script>
    <script type="text/javascript">
      document.getElementById('startTourButton').onclick = function() {
        introJs().start();
      };
    </script>
	<!-- Multi - Site tour script ends -->

	<!-- Carousel js call starts-->
	<script src="//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>
	<script>
	  $(document).ready(function(){
	    $('.carousel').carousel();
	  });
	</script>
	<!-- Carousel js call ends-->

</body>
</html>



