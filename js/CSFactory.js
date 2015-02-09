function CSFactory() {
    this.createCS = function (type) {
        var cs;
        type = type.toLowerCase();
        cs = new Dropbox();//only dropbox available
        cs.type = type;
        return cs;
    };        
}
