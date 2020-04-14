#!/bin/bash

if [[ "$OSTYPE" != "darwin"* ]]; then
  echo "$0 is only for MacOS; you may need to configure a local proxy manually for $OSTYPE."
  exit 0
fi

if [[ -d "/etc/ssl/certs" ]]; then
  sudo mkdir -p /etc/ssl/certs
fi

sudo cp -f ./scripts/testing/ca/xboxCA.crt /etc/ssl/certs/xboxCA.crt
sudo cp -f ./scripts/testing/ca/xbox.local.crt /etc/ssl/certs/xbox.local.crt

if [[ -d "/etc/ssl/private" ]]; then
  sudo mkdir -p /etc/ssl/private
fi

sudo cp -f ./scripts/testing/ca/xbox.local.key /etc/ssl/private/xbox.local.key
sudo cp -f ./scripts/testing/xbox-ssl.conf /etc/apache2/other/

sudo ./scripts/testing/osx/install_cert.sh /etc/ssl/certs/xboxCA.crt

echo "Restarting Apache..."

sudo apachectl stop
sudo apachectl start
