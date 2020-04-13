#!/bin/sh

# First time only.
if [ ! -f ~/.ipfs/config ]; then
  ipfs init
fi

ipfs config Addresses.Gateway /ip4/127.0.0.1/tcp/8888

# Enable CORS for dashboard
# https://github.com/ipfs/js-ipfs-http-client/tree/master/examples/bundle-webpack#setup
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials "[\"true\"]"
