Name:           webfts-kipper
Version:        1.0.0
Release:        1%{?dist}
Summary:        Web Interface for FTS 
Group:          Applications/Internet
License:        ASL 2.0
URL:            https://gitlab.cern.ch/fts/webfts
# The source for this package was pulled from upstream's vcs.  Use the
# following commands to generate the tarball:
#  git clone https://gitlab.cern.ch/fts/webfts.git webfts-2.2.6
#  tar --exclude-vcs -zcvf webfts-2.2.6.tar.gz webfts-2.2.6
Source:         %{name}-%{version}.tar.gz
BuildRoot:      %{_tmppath}/%{name}-%{version}-%{release}-root-%(%{__id_u} -n)
BuildArchitectures: noarch

Requires:	httpd
Requires:	php


%description
The package provides the WEB Interface for the FTS3 service integrated with Kipper and FedIdentity

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
* Fri May 13 2016 Andrea Manzi <amanzi@cern.ch> - 1.0.0
- WebFTS + kipper first release
