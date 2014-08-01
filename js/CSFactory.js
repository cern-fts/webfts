function CSFactory() {
    this.createCS = function (type) {
        var cs;
        type = type.toLowerCase();
        if (type === "dropbox") {
        	cs = new Dropbox();
        }
        //Uncomment for other CS services
//        } else if (type === "drive") {
//        	cs = new Drive();
//        } 

        cs.type = type;
        
        return cs;
    };        
}