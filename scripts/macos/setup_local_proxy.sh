#!/bin/bash

if [[ "$OSTYPE" != "darwin"* ]]; then
  echo "$0 is only for MacOS; you may need to configure a local proxy manually for $OSTYPE."
  exit 0
fi

if [[ -d "/etc/ssl/certs" ]]; then
  sudo mkdir -p /etc/ssl/certs
fi

sudo cp -f scripts/macos/ca/xboxCA.crt /etc/ssl/certs/xboxCA.crt
sudo cp -f scripts/macos/ca/xbox.local.crt /etc/ssl/certs/xbox.local.crt

if [[ -d "/etc/ssl/private" ]]; then
  sudo mkdir -p /etc/ssl/private
fi

sudo cp -f scripts/macos/ca/xbox.local.key /etc/ssl/private/xbox.local.key
sudo cp -f scripts/macos/xbox-ssl.conf /etc/apache2/other/

sudo scripts/macos/install_cert.sh /etc/ssl/certs/xboxCA.crt

sudo apachectl stop
sudo apachectl start
