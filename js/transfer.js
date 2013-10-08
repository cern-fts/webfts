function runTransfer(){
      console.log("Call to FTS");
      
      theData = {
                   "files": [
                        {
                            "sources": [
                                 "http://lxfsra04a04.cern.ch/dpm/cern.ch//home/dteam/5281"
                            ],
                            "destinations": [
                                 "http://lxfsra10a01.cern.ch/dpm/cern.ch/home/dteam/andresTest"
                            ]
                        }
                      ],
                   "params": {
                      }
                };

      var userPrivatePEM = document.getElementById('pemPkey').value;
      var userPEMPass = document.getElementById('pemPass').value;
      var userDN = document.getElementById('userDN').value;
      ftsTransferRequest(theData, userPrivatePEM, userPEMPass, userDN);
}
