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

The /etc/httpd/conf.d/webfts.conf should be configured in order to set the correct server name and port




