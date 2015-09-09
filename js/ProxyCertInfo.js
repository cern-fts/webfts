ProxyCertInfo = function(params) {
    ProxyCertInfo.superclass.constructor.call(this);
    this.limited = false;
    this.path_length = 0;
    
    this.getExtnValueHex = function() {
        var a = new Array();
        var policy = new Array();
        
        if (this.limited)
            policy.push(new KJUR.asn1.DERObjectIdentifier({"oid": "1.3.6.1.5.5.7.21.2"}));
        else
            policy.push(new KJUR.asn1.DERObjectIdentifier({"oid": "1.3.6.1.5.5.7.21.1"}));
        
        a.push(new KJUR.asn1.DERInteger({"int": this.path_length}));
        a.push(new KJUR.asn1.DERSequence({"array": policy}));
        
        var asn1Seq = new KJUR.asn1.DERSequence({"array": a});
        this.asn1ExtnValue = asn1Seq;
        return this.asn1ExtnValue.getEncodedHex();
    };
    
    this.oid = "1.3.6.1.5.5.7.1.14";
    
    if (typeof params != "undefined") {
        if (typeof params["limited"] != "underfined")
            this.limited = params["limited"];
        if (typeof params["length"] != "undefined")
            this.path_length = params["length"];
    }
};
YAHOO.lang.extend(ProxyCertInfo, KJUR.asn1.x509.Extension);

