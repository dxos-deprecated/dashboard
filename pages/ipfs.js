//
// Copyright 2020 DxOS
//

import IpfsHttpClient from 'ipfs-http-client';
import React, { Fragment, useEffect, useState, useContext } from 'react';

import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';

import { apiRequest } from '../lib/request';
import { ignorePromise } from '../lib/util';
import { withLayout, useIsMounted } from '../hooks';

import AppContext from '../components/AppContext';
import ControlButtons from '../components/ControlButtons';
import Content from '../components/Content';
import Error from '../components/Error';
import Json from '../components/Json';
import Toolbar from '../components/Toolbar';

/**
 * NOTE: Must set-up CORS first.
 * https://github.com/ipfs/js-ipfs-http-client#in-a-web-browser
 * https://github.com/ipfs/js-ipfs-http-client/tree/master/examples/bundle-webpack#setup
 * https://github.com/ipfs/js-ipfs-http-client/blob/master/examples/bundle-webpack/src/App.js
 * ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"
 * ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials "[\"true\"]"
 *
 * @constructor
 */
const Page = () => {
  const isMounted = useIsMounted();
  const { config } = useContext(AppContext);
  const [{ ts, result, error }, setStatus] = useState({});

  // https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html

  const resetError = () => setStatus({ ts, result, error: undefined });

  const handleRefresh = async () => {
    try {
      // https://github.com/ipfs/js-ipfs-http-client#api
      const ipfs = IpfsHttpClient(config.services.ipfs.server);
      const version = await ipfs.version();
      const status = await ipfs.id();
      if (isMounted.current) {
        status.addresses = status.addresses.map(address => String(address));
        setStatus({ ts: Date.now(), result: { version, status } });
      }
    } catch (error) {
      let message = String(error);
      if (String(error).match(/Failed to fetch/)) {
        message = [
          message, 'Make sure CORS is enabled.'
        ];
      }

      if (isMounted.current) {
        setStatus({ ts: Date.now(), error: message });
      }
    }

    // TODO(burdon): List files referenced from the registry.
    // TODO(burdon): Button to retrive and pin file on local node.
    // const data = await IpfsHttpClient.urlSource('https://ipfs.io/images/ipfs-logo.svg');
    // const hash = await ipfs.add(data);
    // console.log(hash, data);
  };

  // TODO(burdon): Link to Chrome extension (info panel).
  // https://chrome.google.com/webstore/detail/ipfs-companion/nibjojkomfdiaoajekhjakgkdhaomnch?hl=en
  const handleStart = async () => {
    // TODO(burdon): Can we detach after matching.
    const { ts, error } = await apiRequest('/api/ipfs', { command: 'start' });
    if (error) {
      setStatus({ ts, error });
    } else {
      setTimeout(() => {
        handleRefresh();
      }, 5000);
    }
  };

  const handleStop = async () => {
    const status = await apiRequest('/api/ipfs', { command: 'shutdown' });
    setStatus(status);
  };

  const handleOpen = () => {
    // TODO(burdon): Convert link.
    window.open(config.services.ipfs.webui, '_ipfs_');
  };

  useEffect(ignorePromise(handleRefresh), []);

  return (
    <Fragment>
      <Toolbar>
        <div>
          <IconButton onClick={handleRefresh} title="Restart">
            <RefreshIcon />
          </IconButton>
        </div>

        <ControlButtons onStart={handleStart} onStop={handleStop} onOpen={handleOpen} />
      </Toolbar>

      <Content updated={ts}>
        <Json json={result} />
      </Content>

      <Error message={error} onClose={resetError} />
    </Fragment>
  );
};

export default withLayout(Page);
