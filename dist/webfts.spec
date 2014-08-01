Name:           webfts
Version:        1.4.0
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

%clean
rm -rf %{buildroot}

%post
service httpd restart

%files
%defattr(-,root,root,-)
/var/www/%{name}
