Name:           webfts
Version:        2.0.0
Release:        1%{?dist}
Summary:        Web Interface for FTS 
Group:          Applications/Internet
License:        ASL 2.0
URL:            https://github.com/cern-it-sdc-id/webfts
Source:         %{name}.tar.gz
BuildRoot:      %{_tmppath}/%{name}-%{version}-%{release}-root-%(%{__id_u} -n)
BuildArchitectures: noarch

%description
The package provides the WEB Interface for the FTS3 service

%prep
%setup -c -n %{name}

%install
rm -rf %{buildroot}
mkdir -p -m0755 %{buildroot}/var
mkdir -p -m0755 %{buildroot}/var/www
mkdir -p -m0755 %{buildroot}/var/www/%{name}

cp -rp * %{buildroot}/var/www/%{name}


mkdir -p -m0755 %{buildroot}/etc
mkdir -p -m0755 %{buildroot}/etc/httpd
mkdir -p -m0755 %{buildroot}/etc/httpd/conf.d

cp -rp conf/webfts.conf %{buildroot}/etc/httpd/conf.d/

%clean
rm -rf %{buildroot}

%post
service httpd restart

%files
%config(noreplace) /etc/httpd/conf.d/%{name}.conf
%defattr(-,root,root,-)
/var/www/%{name}
