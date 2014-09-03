// Browser Detection Javascript
// copyright 1 February 2003, by Stephen Chapman, Felgall Pty Ltd

// You have permission to copy and use this javascript provided that
// the content of the script is not changed in any way.

function whichBrs() {
var agt=navigator.userAgent.toLowerCase();
if (agt.indexOf("opera") != -1) return 'Opera.css';
if (agt.indexOf("staroffice") != -1) return 'Star Office.css';
if (agt.indexOf("webtv") != -1) return 'WebTV.css';
if (agt.indexOf("beonex") != -1) return 'Beonex.css';
if (agt.indexOf("chimera") != -1) return 'Chimera.css';
if (agt.indexOf("netpositive") != -1) return 'NetPositive.css';
if (agt.indexOf("phoenix") != -1) return 'Phoenix.css';
if (agt.indexOf("firefox") != -1) return 'Firefox.css';
if (agt.indexOf("safari") != -1) return 'Safari.css';
if (agt.indexOf("skipstone") != -1) return 'SkipStone.css';
if (agt.indexOf("msie") != -1) return 'Internet Explorer.css';
if (agt.indexOf("netscape") != -1) return 'Netscape.css';
if (agt.indexOf("mozilla/5.0") != -1) return 'Mozilla.css';
if (agt.indexOf('\/') != -1) {
if (agt.substr(0,agt.indexOf('\/')) != 'mozilla') {
return navigator.userAgent.substr(0,agt.indexOf('\/'));}
else return 'Netscape';} else if (agt.indexOf(' ') != -1)
return navigator.userAgent.substr(0,agt.indexOf(' '));
else return navigator.userAgent;
}


function adjustStyle() {

	var browserStyle = whichBrs();
    
    if (browserStyle == "Firefox.css") {
        $("#stylesheet").attr("href", "paraFiles/css/style.css");
    }else if (browserStyle == "Internet Explorer.css") {
        $("#stylesheet").attr("href", "paraFiles/css/diffBrsStyles/Internet Explorer.css");
    }else if (browserStyle == "Mozilla.css") {
        $("#stylesheet").attr("href", "paraFiles/css/style.css");
    }else if (browserStyle == "Safari.css") {
        $("#stylesheet").attr("href", "paraFiles/css/diffBrsStyles/Safari.css");
    }
document.write("The result of function is ______________________________________________________________", browserStyle);

}