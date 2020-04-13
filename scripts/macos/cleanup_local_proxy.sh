#!/bin/bash

if [[ "$OSTYPE" != "darwin"* ]]; then
  echo "$0 only used on MacOS."
  exit 0
fi

sudo rm -f /etc/ssl/certs/xboxCA.crt
sudo rm -f /etc/ssl/certs/xbox.local.crt

if [[ -d "/etc/ssl/private" ]]; then
  sudo rm -f /etc/ssl/private/xbox.local.key
fi

sudo rm -f /etc/apache2/other/apache-dashboard-proxy.conf

sudo apachectl stop
sudo apachectl start
