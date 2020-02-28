//
// Copyright 2020 DxOS
//

import IpfsHttpClient from 'ipfs-http-client';

import React, { Fragment, useEffect, useState, useContext } from 'react';
import Button from '@material-ui/core/Button';
import MuiLink from '@material-ui/core/Link';
import OpenIcon from '@material-ui/icons/OpenInBrowser';

import { noPromise, apiRequest } from '../src/request';

import AppContext from '../src/components/AppContext';
import Content from '../src/components/Content';
import Error from '../src/components/Error';
import Json from '../src/components/Json';
import Timer from '../src/components/Timer';
import Toolbar from '../src/components/Toolbar';
import { withLayout } from '../src/components/Layout';

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
  const { config } = useContext(AppContext);
  const [{ ts, result, error }, setStatus] = useState({});

  const resetError = error => setStatus({ ts, result, error });

  // TODO(burdon): List files referenced from the registry.

  const handleRefresh = async () => {
    try {
      // https://github.com/ipfs/js-ipfs-http-client#api
      const ipfs = IpfsHttpClient(config.services.ipfs.server);
      const version = await ipfs.version();
      const status = await ipfs.id();
      status.addresses = status.addresses.map(address => String(address));
      setStatus({ ts: Date.now(), result: { version, status } });
    } catch (error) {
      setStatus({ ts: Date.now(), error: String(error) });
    }

    // TODO(burdon): Test load/save file.
    // const data = await IpfsHttpClient.urlSource('https://ipfs.io/images/ipfs-logo.svg');
    // const hash = await ipfs.add(data);
    // console.log(hash, data);
  };

  const handleStart = async () => {
    const { ts, error } = await apiRequest('/api/ipfs?command=start');
    if (error) {
      setStatus({ ts, error });
    } else {
      await handleRefresh();
    }
  };

  const handleStop = async () => {
    const status = await apiRequest('/api/ipfs?command=shutdown');
    setStatus(status);
  };

  useEffect(noPromise(handleRefresh), []);

  return (
    <Fragment>
      <Toolbar>
        <div>
          <Button color="primary" onClick={handleRefresh}>Refresh</Button>
          <Button onClick={handleStart}>Start</Button>
          <Button onClick={handleStop}>Stop</Button>
        </div>
        <div>
          <MuiLink href={config.services.ipfs.console} rel="noreferrer" target="_blank">
            <OpenIcon />
          </MuiLink>
        </div>
      </Toolbar>

      <Content>
        <Json json={result} />
        {ts && <Timer start={ts} />}

        <Error message={error} onClose={resetError} />
      </Content>
    </Fragment>
  );
};

export default withLayout(Page);
