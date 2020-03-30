#!/bin/sh

ipfs init

ipfs config gateway 8888

# Enable CORS for dashboard
# https://github.com/ipfs/js-ipfs-http-client/tree/master/examples/bundle-webpack#setup
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials "[\"true\"]"
