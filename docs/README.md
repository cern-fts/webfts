Installation
============

WebFTS can be installed in the same server where FTS3 REST is running or on a separate apache instance.

It's avalable also via rpm from the FTS staging [repo](http://grid-deployment.web.cern.ch/grid-deployment/dms/fts3/repos/el6/x86_64/).

if the installation is done manually it requires:

* the installation of PHP ( yum install php)
* the copy of the conf/webfts.conf file under /etc/httpd/conf.d/webfts.conf 
* Disable Scientific Linux enforce (setenforce 0)


Configuration
=============

The /etc/httpd/conf.d/webfts.conf should be configured in order to set the correct server name and port and path to the webfts app

Regarding the WebFTS conf, it's avaialble on the config.xml file:

* ftsAddress: the address of the FTS REST server to contact
* jobToList: the number of jobs to list per user
* endpointListUrl : the file containing the list of endpoint used for autocompletion
* proxyCertHours : the validity of the proxy certs created by WebFTS
* cernboxBaseUrl : the cernbox base url ( only if the installation is done at CERN))
* VOs : list of supported VOMS VOs ( the same VOs or a subset of the VOs supported by FTS REST)

In addition FTS REST should be configured to send teh CORS headers needed for WebFTS AJAX calls. An example of cross domain conf file can be found at [cross-domain.conf] (../conf/cross-domain.conf)

Further configuration is needed in oder to support Dropbox integration

Dropbox connector configuration
------------------------------

In order to access the user's Dropbox area and run transfers we need to configure the FTS REST server as follows:

* The gfal2-plugin-dropbox and  fts-rest-cloud-storage packages ( from the FTS staging [repo](http://grid-deployment.web.cern.ch/grid-deployment/dms/fts3/repos/el6/x86_64/) ) needs to be installed in order to perform the I/O towards dropbox and the mamagement of the new storage type
* configure FTS with the WebFTS Dropbox app credentials:
** fts-config-set --dropbox <APP_KEY> <APP_SECRET> https://www.dropbox.com/1 
** please contact the support to get both APP_KEY and APP_SECRET


