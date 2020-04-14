#!/bin/bash

#
# Install Cert.
# https://apple.stackexchange.com/questions/80623/import-certificates-into-the-system-keychain-via-the-command-line
# https://derflounder.wordpress.com/2011/03/13/adding-new-trusted-root-certificates-to-system-keychain/
# OS/X Keychain Access
#

CERT="${1:-xbox.local.crt}"

echo "Installing certificate: $CERT"

if [[ "$OSTYPE" == "darwin"* ]]; then
  sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ${CERT}
fi
