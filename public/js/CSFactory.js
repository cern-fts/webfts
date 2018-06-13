function CSFactory() {
    this.createCS = function (type) {
        var cs;
        type = type.toLowerCase();
       	cs = new Dropbox();
        cs.type = type;
        return cs;
    };        
}
