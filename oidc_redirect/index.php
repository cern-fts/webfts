<!DOCTYPE HTML >
<html>
<head><title>OIDC connect</title>
<script src="../js/jquery.min.js"></script>
<script src="../js/jquery.validate.min.js"></script>
<script src="../oidc/oidc.js"></script>
<script>
$( document ).ready(function() {
        console.log("code: " +  $('input#codeinput').val());      
        OIDC.getCertificate($('input#codeinput').val());        
});     
</script>
</head>
<body>
<?php
  $code = $_GET['code'];
  echo "<input type=\"hidden\" id=\"codeinput\" value=\"$code\">";
?>
</body>
</html>
