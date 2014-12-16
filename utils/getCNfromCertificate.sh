#!/bin/bash
echo `ldapsearch -x -h xldap.cern.ch -b "OU=Users,OU=Organic Units,DC=cern,DC=ch" "(altSecurityIdentities=*CN=$1)" cn | grep cn:`
