<!DOCTYPE HTML >
<html>
<head><title>OIDC connect</title>
<script src="../js/jquery.min.js"></script>
<script src="../js/jquery.validate.min.js"></script>
<script src="../js/lib/sha512.js"></script>
<script src="../js/jsrsasign-latest-all-min.js"></script>
<script src="../js/ftsHelper.js"></script>
<script src="../js/lib/base64E.js"></script>
<script src="../js/lib/asn11.js"></script>
<script src="../js/lib/oids.js"></script>
<script src="../js/lib/asn1csr-1.0.js"></script>
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
