<!DOCTYPE HTML >
<html lang="en">
<head>

<title >WebFTS - Simplifying power </title >
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<link rel="shortcut icon" href="img/ico/favicon.png">
<meta name="description" content="" />
<meta name="keywords" content="" />

<link href="css/bootstrap.min.css" rel="stylesheet" >
<link href="css/bootstrap-theme.min.css" rel="stylesheet" >
<!-- <link href="css/justified-nav.css" rel="stylesheet"> -->
<link href="css/validation.css" rel="stylesheet" >
<!-- custom slideshow styles -->
<link rel="stylesheet" type="text/css" href="css/carousel styles/custom-carousel.css">

<link rel="stylesheet" type="text/css" href="css/site-tour-styles/custom-site-tour.css">

<!--Mine add-ons imports-->
<script type="text/javascript" src='http://codeorigin.jquery.com/jquery-2.0.3.min.js'></script>
<script type="text/javascript" src='paraFiles/js/jquery.stellar.min.js'></script>
<script type="text/javascript" src='paraFiles/js/waypoints.js'></script>
<script type="text/javascript" src='paraFiles/js/jquery.easing.1.3.js'></script>
<script type="text/javascript" src='paraFiles/js/main.js'></script>
<!--<link href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" rel="stylesheet">-->
<!-- <link rel="stylesheet" type="text/css" href="paraFiles/css/style.css"> -->
<!--Mine add-ons end of imports-->
<link rel="stylesheet" type="text/css" href="/css/nav-bar-custom/nav-bar-custom.css">

<!-- General Site tour styles -->
<link href="site-tour/intro.js/introjs.css" rel="stylesheet">


<script src="js/jquery.min.js"></script>
<script src="js/jquery.validate.min.js"></script>


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

<!--
// // In Opera, the true version is after "Opera" or after "Version"
// else if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
//  browserName = "Opera";
// }
-->
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
	// document.write(browserName);

 if (browserName == 'Firefox') {
 	// document.write("<link rel='stylesheet' href='paraFiles/css/diffBrsStyles/Firefox.css' type='text/css'>");
 	// document.write("<link rel='stylesheet' href='paraFiles/css/diffBrsStyles/tryFire.css' type='text/css'>");
 }
 else if (browserName == 'Chrome'){
 	document.write("<link rel='stylesheet' href='paraFiles/css/diffBrsStyles/Chrome.css' type='text/css'>");
 }
 else if (browserName == 'Safari'){
 	// document.write("<link rel='stylesheet' href='paraFiles/css/diffBrsStyles/Safari.css' type='text/css'>");
 	 	// document.write("<link rel='stylesheet' href='paraFiles/css/diffBrsStyles/tryFire.css' type='text/css'>");

 }
 else if (browserName == 'Microsoft Internet Explorer') {
 	document.write("<link rel='stylesheet' href='paraFiles/css/diffBrsStyles/IE.css' type='text/css'>");
 } 
 else{
 	document.write("<link rel='stylesheet' href='paraFiles/css/style.css' type='text/css'>");
 }

</script>
<!-- Browser Compatibility ends-->


<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="assets/css/bootstrap-responsive.css" rel="stylesheet">

<!-- <link rel="stylesheet" href="base.css"/> -->
<link rel="stylesheet" media="(min-width: 1200px)" href="large-scr.css"/>
<link rel="stylesheet" media="(min-width: 768px) and (max-width: 979px)" href="tablet-scr.css"/>
<link rel="stylesheet" media="(max-width: 767px)" href="tablet-scr.css"/>
<link rel="stylesheet" media="(max-width: 480px)" href="phone-scr.css"/>




</head>

<body >
<!-- 
<script type="text/javascript">
      document.getElementById('startTourButton').onclick = function() { adjustStyle(); };
</script>
 -->
	<!--<div class="container"-->
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
							<a href="#"><i class="glyphicon glyphicon-home"></i>&nbsp;Home</a></li>
						<li data-step="4" 
							data-intro="<h3><strong>Check your submitted jobs:</strong></h3><h4>Check in real time the progress of your transfered jobs!</h4>"
							data-position='bottom' a href="transmissions.php">
							<a href="transmissions.php"><i class="glyphicon glyphicon-tasks"></i>&nbsp;My jobs</a></li>
						<li data-step="3" 
							data-intro="<h3><strong>Start from here:</strong></h3><h4>Do you have a valid certificate on your browser? Submit your transfer more quickly and easily than ever, only by defining the endpoints of your choice for each particular transfer! You want to learn more? Click on the button below!</h4>" 
							data-position='bottom'>
							<a href="submit.php"><i class="glyphicon glyphicon-chevron-left"></i><i class="glyphicon glyphicon-chevron-right"></i>&nbsp;Submit a transfer</a></li>				
					</ul>
			</div>
		</div>
		<!--<div class='shadow-divider'>
				<img src="paraFiles/img/shadow-bottom.png" class='divider'>
		</div>
		-->
		<img src="paraFiles/img/shadow-bottom.png" alt=' ' class='divider' >
	</div>
		
		<!--Parallax scrolling starts-->
		<div class="container-central">
			
			<div class='main '>
				<div class='slide ' id='slide1' data-slide='1' data-stellar-background-ratio='1'>
					<div class='container-fluid'>
						
						<div class='main-area '>
							<div class='main-top-center-grid'>
								<div class='row-fluid'>
									<div class='col-md-4 col-md-offset-1 ' id='front-left-block'>
										<!-- <h2><strong>
											News:
										</h2></strong> -->
											
											<h4>
												<span class='glyphicon glyphicon-ok-sign'>
													<strong>Release 3.2.22:</strong>
													<br/>
												</span>
												<br/>
												<h5><span class='glyphicon glyphicon-ok'>&#09 UDT support,</span></h5>
												<h5><span class='glyphicon glyphicon-ok'>&#09 configuring FTS3 to use GridFTP/UDT instead of GridFTP/TCP</span></h5>
												<!-- <br/><a onclick="window.open(this.href,'_blank');return false;" href="http://fts3-service.web.cern.ch/documentation/releases"><strong>Read more...</strong></a> -->
			    								<p class='jumbotron'>
													<a class="btn btn-primary btn-lg" id='readMore' onclick="window.open(this.href,'_blank');return false;" href="http://fts3-service.web.cern.ch/documentation/releases"><strong>Read more...</strong></a>
												</p>
    										</h4>	
									</div>
									<div class='col-md-6 center-left-block col-md-offset-1 text-center ' id='front-right-block'>
										<!-- <h2><br/>Slideshow:<br/><br/>Behind WebFTS?<br/>Many millions of files daily<br/>15 PB per month!<br/></h2>	 -->
										<div class="carousel-cust-container">
											<div id="this-carousel-id" class="carousel slide  c-fade"><!-- class of slide for animation -->
										  
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
											      <img src="img/slideshow/3.png" rel="nofollow" target="_blank" title="" class="vglnk" alt="" />
											      <div class="carousel-caption">
											        <p><h3>CERN</h3></p>
											      </div>
											    </div>
											    <div class="item">
											      <img src="img/slideshow/4_logo_cern_450x300.png" rel="nofollow" target="_blank" title="" class="vglnk" alt="" />
											      <div class="carousel-caption">
											        <p><h3>European Organisation for Nuclear Research</h3></p>
											      </div>
											    </div>
											  </div><!-- /.carousel-inner -->
											
										  <!--  Next and Previous controls below
										        href values must reference the id for this carousel -->
										    <a class="carousel-control left" href="#this-carousel-id" data-slide="prev">&lsaquo;</a>
										    <a class="carousel-control right" href="#this-carousel-id" data-slide="next">&rsaquo;</a>
										</div><!-- /.carousel -->
									</div><!-- carousel-cust-container-->
										<div class='row'>
											<div class='col-md-12 col-sm-12 col-xs-12 button-and-label-block' >
												<div class='col-md-12 text-center voffset-4 runew-label-1' id='runew-label-1'>
													<center><h1><strong>Are you new ?</h1></strong><h2><strong>Click here!</strong></h2></h1></center>
												</div>
												<p class='col-md-12 button' data-slide='2' title='' style='text-align: center'></p>
											</div>
										</div> <!-- row -->
									</div>
								</div>
							</div>
							<!--
							<div class='row border-element' style=' width='100%' height='100%''>
								<div class='col-md-12 border-element central-icon-area text-center'>
									<p> <h2><br/><br/><br/>WHITE AREA<br/>?<br/><br/><br/><br/></h2></p>
								</div>	
							</div>
							-->
						</div>
					</div>
					
					
				</div>

				<div class='slide' id='slide2' data-slide='2' data-stellar-background-ratio='0.7'>
					<div class='col-md-12 '>		

						<div class='row'>						
							<div class='col-md-6 col-md-offset-1'>
								<div class='row info-block-desc-dark'>
									<div class="info-block-header-desc">
										<p>What is WebFTS? </p><br/>
									</div>  
									<div class="info-block-desc"> 
										<p>WebFTS is a file transfer and management solution which allows users to invoke reliable, managed data transfers on distributed infrastructures.<br/><br/> Created following simplicity and efficiency criteria, WebFTS allows the user to access and interact with multiple storage elements. Their content becomes browsable and different filters can be applied to get a set of files to be transferred. Transfers can be invoked and capabilities are provided for checking the detailed status of the different transfers and resubmitting any of them with only one click.<br/><br/> The “transfer engine” used is FTS3, the service responsible for distributing the majority of LHC data across WLCG infrastructure. This provides WebFTS with reliable, multi-protocol (gridftp, srm, http, xrootd), adaptively optimised data transfers</p>
									</div>
								</div>
							</div>
							<div class='col-md-offset-5'></div>

						</div>
					</div>

					<div class='row'>
						<div class='col-md-12 text-center continue-label' id='continue-label-sl-2'>
								<p><strong>Continue...</strong></p>
						</div>
						<p class='col-md-12 button text-center' id='button-block'data-slide='3' title='' style='text-align: center'></p>
					</div>
				</div>


				<div class='slide' id='slide3' data-slide='3' data-stellar-background-ratio='0.7'>
					<div class='col-md-12 '>		

						<div class='row top-200'>						
							<!--<div class='col-md-offset-1'></div>-->
							
								<div class='col-md-offset-5'></div>
								<div class='col-md-6 col-md-offset-1'>
									<div class='row info-block-black'> 
										<div class="info-block-header-desc">
											<p>Who can transfer files though WebFTS?<br/><br/></p>
										</div>
										<div class="info-block-desc"> 
											<p><strong>Everybody</strong> who has a valid certificate installed in his/her browser!<br/><br/>Supported browsers are <strong>Chrome </strong> and <strong>Firefox </strong>. Supported platforms are <strong> Linux</strong>, <strong>OsX</strong> and <strong>Windows</strong>.<br/>The authentication with the <strong>Grid Storage Elements (SE)</strong> is done based on certificates.</p>
										</div>
									</div>
								</div>
							<div class='col-md-offset-1'></div>
						</div>
					</div>
					<div class='row'>
						<div class='col-md-12 voffset-4 text-center continue-label ' id='continue-label-sl-3'>
								<p><strong> Continue...</strong></p>
						</div>
						<p class='col-md-12 button text-center' id='button-block' data-slide='4' title='' style='text-align: center'></p>
					</div>
				</div>

				<div class='slide' id='slide4' data-slide='4' data-stellar-background-ratio='0.7'>
					<div class='col-md-12'>		

						<div class='row'>						
							<div class='col-md-1'>
								<br/>
							</div>
							<div class='col-md-5'>
								<div class='row info-block-desc-dark top-200'>
									<div class="info-block-header-desc">
										<p>Is it difficult? <br/>How to start?<br/><br/></p>
									</div>	
									<p class="info-block-desc"> 
										Since you have a valid certificate in your browser, start with submitting a transfer!
										<br/>
										You need help? Make a virtual tour by clicking here!
										<br/>
									</p>
								</div>
								
							</div>	
							<div class='col-md-1'><br/></div>
							<div class='col-md-4 info-block-image text-center' id='block-img-4'></div>
							<div class='col-md-1'><br/></div>
						</div>
					</div>

					<div class='row '>
						<p class='jumbotron'>
							
							<!--
							<div class='col-md-12 text-center continue-label border-element' id='continue-label-sl-4' align='center' font-color='#FFFFFF'>
									<center><h1><strong><p><font-color="#FFFFFF"> Make a tour !</font></p></strong></h1></center>
							</div>
							
							<p class='col-md-12 button text-center border-element' data-slide='1' title='' style='text-align: center'></p>
							-->
							<a class="btn btn-primary btn-lg back-to-top" id= 'startTourButton' href="#"  href="javascript:void(0)"  onclick="javascript:introJs().start()"><strong>Make a tour!</strong></a>
						</p>

					</div>
				</div>
			</div>
		</div>
			<!--Parallax scrolling ends -->
	<!--</div>container-->


<!-- Site tour js -->
<!--
// <script type="text/javascript">
// 	window.scrollTo(0, 0);
// </script>
-->
<script type="text/javascript" src="site-tour/scroll-to-top.js"></script>
<script type="text/javascript" src="site-tour/intro.js/intro.js"></script>
<script src="//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>


<!-- Site tour script starts -->
<script type="text/javascript">
      document.getElementById('startTourButton').onclick = function() {
        introJs().setOption('doneLabel', 'See more for the "Submit a transfer" page').start().oncomplete(function() {
          window.location.href = 'submit.php?multipage=true';
        });
      };
</script>
<!-- Site tour script ends -->

<!-- Carousel js call-->
<script>
  $(document).ready(function(){
    $('.carousel').carousel();
  });
</script>






</body>
</html>



