Name:           webfts
Version:        2.4.0
Release:        1%{?dist}
Summary:        Web Interface for FTS 
Group:          Applications/Internet
License:        ASL 2.0
URL:            https://gitlab.cern.ch/fts/webfts
# The source for this package was pulled from upstream's vcs.  Use the
# following commands to generate the tarball:
#  git clone https://gitlab.cern.ch/fts/webfts.git webfts-2.2.8
#  tar --exclude-vcs -zcvf webfts-2.2.8.tar.gz webfts-2.2.8
Source:         %{name}-%{version}.tar.gz
BuildRoot:      %{_tmppath}/%{name}-%{version}-%{release}-root-%(%{__id_u} -n)
BuildArchitectures: noarch

Requires:	httpd
Requires:	php


%description
The package provides the WEB Interface for the FTS3 service

%prep
%setup -c -n %{name}

%install
rm -rf %{buildroot}
mkdir -p -m0755 %{buildroot}/var
mkdir -p -m0755 %{buildroot}/var/www
mkdir -p -m0755 %{buildroot}/var/www/%{name}

cp -rp %{name}-%{version}/* %{buildroot}/var/www/%{name}

mkdir -p -m0755 %{buildroot}/etc
mkdir -p -m0755 %{buildroot}/etc/httpd
mkdir -p -m0755 %{buildroot}/etc/httpd/conf.d

cp -rp %{name}-%{version}/conf/%{name}.conf %{buildroot}/etc/httpd/conf.d/

%clean
rm -rf %{buildroot}

%post
service httpd restart

%files
%config(noreplace) /etc/httpd/conf.d/%{name}.conf
%config(noreplace) /var/www/%{name}/config.xml
%defattr(-,root,root,-)
/var/www/%{name}

%changelog
* Thu May 23 2017 Andrea Manzi <amanzi@cern.ch> - 2.2.12-1
- fix news feed
- fix delegation for CA without SKID
* Wed Jan 18 2017 Andrea Manzi <amanzi@cern.ch> - 2.2.11-1
- change default port
* Fri Dec 16 2016 Andrea Manzi <amanzi@cern.ch> - 2.2.10-1
- removed beta version
* Fri Jul 29 2016 Andrea Manzi <amanzi@cern.ch> - 2.2.9-1
- fix selectAll Files
* Mon Jul 04 2016 Andrea Manzi <amanzi@cern.ch> - 2.2.8-1
- fix date filter and displayed date
* Fri Nov 27 2015 Andrea Manzi <amanzi@cern.ch> - 2.2.7-1
- fix text typos
* Tue Nov 24 2015 Andrea Manzi <amanzi@cern.ch> - 2.2.6-1
- fix endpoints content not ordered
- fix resubmission with dropbox
* Fri Nov 6 2015 Andrea Manzi <amanzi@cern.ch> - 2.2.5-1
- correct escaping url when list endpoints
- fix reload of SE endpoints
* Fri Jun 27 2015 Andrea Manzi <amanzi@cern.ch> - 2.2.4-1
- fix for FINISHEDDIRTY jobs not displayed
* Wed Jun 25 2015 Andrea Manzi <amanzi@cern.ch> - 2.2.3-1
- fix for file Attributes columns wrongly ordered
* Fri Feb 27 2015 Andrea Manzi <amanzi@cern.ch> - 2.2.2-1
- fix for XSS vulnerability
* Fri Feb 13 2015 Andrea Manzi <amanzi@cern.ch> - 2.2.1-1
- moved to sha512
- added dropbox revoke tokens button
* Thu Nov 27 2014 Andrea Manzi <amanzi@cern.ch> - 2.2.0-1
- data management support
* Thu Nov 13 2014 Andrea Manzi <amanzi@cern.ch> - 2.1.0-1
- cernbox support
- added voname to proxy
* Tue Aug 27 2014 Andrea Manzi <amanzi@cern.ch> - 2.0.0-1
- dropbox support
* Tue Jul 22 2014 Andrea Manzi <amanzi@cern.ch> - 1.4.0-1
- added support for LFC registration, overwrite and checksums
- added resubmission of failed files only
