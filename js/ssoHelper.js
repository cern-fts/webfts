//
// This function serializes jQuery XML object
//
function xmlToString(xml) {
	var xmlstr = undefined;
	if(window.ActiveXObject) xmlstr = xml[0].xml;
	if(xmlstr === undefined) xmlstr = (new XMLSerializer()).serializeToString(xml[0]);
	return xmlstr;
}
//
// This function retrieves error code from server responses
//
function ssoErrorString(xml) {
	var error = $(xml).find("error");
	if(error[0]) return "SSO error: " + error.text();
	error = $(xml).find('soap11\\:Fault, Fault');
	if(error[0]) return "STS Error: " + error.text();
	return undefined;
}
//
// This function returns XML SOAP string that should be sent to STS service.
// assert - XML object returned from AJAX request to ssoGetAssertion.php
// sts    - STS endpoint URI
// key    - Optional public key (BASE64-encoded)
//
function ssoSoapReq(assert, sts, key) {
	var soap = $($.parseXML('<?xml version="1.0" encoding="UTF-8"?>\
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sbf="urn:liberty:sb" xmlns:wsa="http://www.w3.org/2005/08/addressing" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wst="http://docs.oasis-open.org/ws-sx/ws-trust/200512" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">\
<soap:Header xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
<wsa:Action xmlns:wsa="http://www.w3.org/2005/08/addressing">http://docs.oasis-open.org/ws-sx/ws-trust/200512/RST/Issue</wsa:Action>\
<wsa:MessageID xmlns:wsa="http://www.w3.org/2005/08/addressing">urn:uuid:99999999-0000-0000-0000-000000000000</wsa:MessageID>\
<wsa:To xmlns:wsa="http://www.w3.org/2005/08/addressing"><!-- STS host goes here --></wsa:To>\
<sbf:Framework version="2.0" xmlns:sbf="urn:liberty:sb"/>\
<wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">\
<wsu:Timestamp xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">\
<wsu:Created xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"><!-- Timestamp goes here --></wsu:Created>\
</wsu:Timestamp>\
<!-- SAML assertion goes here -->\
</wsse:Security>\
</soap:Header>\
<soap:Body xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
<wst:RequestSecurityToken Context="urn:uuid:00000000-0000-0000-0000-000000000000" wsu:Id="test0987654321" xmlns:wst="http://docs.oasis-open.org/ws-sx/ws-trust/200512" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">\
<wst:RequestType xmlns:wst="http://docs.oasis-open.org/ws-sx/ws-trust/200512">http://docs.oasis-open.org/ws-sx/ws-trust/200512/RST/Issue</wst:RequestType>\
<wst:TokenType xmlns:wst="http://docs.oasis-open.org/ws-sx/ws-trust/200512">http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-tokenprofile-1.0#X509v3</wst:TokenType>\
<wst:Claims Dialect="http://docs.oasis-open.org/wss/oasis-wss-saml-token-profile-1.1#SAMLV2.0" xmlns:wst="http://docs.oasis-open.org/ws-sx/ws-trust/200512">\
<wsse:SecurityTokenReference xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">\
<wsse:Reference URI="Assertion ID goes here" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"/>\
</wsse:SecurityTokenReference>\
</wst:Claims>\
<!-- Optional public key goes here -->\
</wst:RequestSecurityToken>\
</soap:Body>\
</soap:Envelope>'));
	var as = $(assert).find('Assertion');
	if(!as[0]) return undefined;
	soap.find('wsu\\:Created, Created').text((new Date).toISOString());
	soap.find('wsa\\:To, To').text(sts);
	soap.find('wsse\\:Security, Security').append(as);
	soap.find('wsse\\:Reference, Reference').attr('URI', '#' + as.attr('ID'));
	if(key) soap.find('wst\\:RequestSecurityToken, RequestSecurityToken').append('<wst:UseKey xmlns:wst="http://docs.oasis-open.org/ws-sx/ws-trust/200512">' + key + '</wst:UseKey>');
	return xmlToString(soap);
}
//
// This function extracts BASE64-encoded certificate from STS response
// soap - XML object returned from AJAX request to STS
//
function ssoGetCertificate(soap) {
	var cert = $(soap).find('wsse\\:BinarySecurityToken, BinarySecurityToken');
	return cert ? hextob64(b64tohex(cert.text())) : undefined;
}
//
// This function extracts BASE64-encoded private key from STS response
// soap - XML object returned from AJAX request to STS
//
function ssoGetPrivateKey(soap) {
	var key = $(soap).find('wst\\:BinarySecret, BinarySecret');
	return key ? hextob64(b64tohex(key.text())) : undefined;
}
//
// This function generates Authorization header for AJAX requests to REST API
// cert - BASE64-encoded certificate
// key  - BASE64-encoded private key
// hash - Optional hash algorithm name
//
function ssoAuthString(cert, key, hash) {
	// Authorization: Signed-Cert hash="sha256-or-whatever", ts="ISO-timestamp", cert="base64-certificate", sign="base64-signature"
	hash = hash ? hash.toUpperCase() : "SHA256";
	var ts = (new Date).toISOString();
	var pkey = KEYUTIL.getKeyFromPlainPrivatePKCS8Hex(b64tohex(key));
	var sig = new KJUR.crypto.Signature({"alg": hash + "withRSA"});
	sig.init(pkey);
	sig.updateHex(b64tohex(cert));
	sig.updateString(ts);
	return "Signed-Cert hash=\"" + hash.toLowerCase() + "\" ts=\"" + ts + "\" cert=\"" + hextob64(b64tohex(cert)) + "\" sign=\"" + hextob64(sig.sign()) + "\"";
}
//
// This function returns the remaining validity window in seconds for SAML2 assertion
//
function ssoAssertionTimeLeft(assert) {
	var as = $(assert).find('Assertion');
	if(!as[0]) return undefined;
	var nva = Date.parse(as.find('SubjectConfirmationData').attr('NotOnOrAfter'));
	return (nva - (new Date).getTime()) / 1000;
}
