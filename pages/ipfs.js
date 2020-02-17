//
// Copyright 2020 DxOS
//

import IpfsHttpClient from 'ipfs-http-client';

import React, { Fragment, useEffect, useState, useContext } from 'react';
import Button from '@material-ui/core/Button';
import MuiLink from '@material-ui/core/Link';
import OpenIcon from '@material-ui/icons/OpenInBrowser';

import { request } from '../src/http';
import AppContext from '../src/components/AppContext';
import Content from '../src/components/Content';
import Error from '../src/components/Error';
import Json from '../src/components/Json';
import Timer from '../src/components/Timer';
import Toolbar from '../src/components/Toolbar';
import { withLayout } from '../src/components/Layout';

// NOTE: Must set-up CORS first.
// https://github.com/ipfs/js-ipfs-http-client#in-a-web-browser
// https://github.com/ipfs/js-ipfs-http-client/tree/master/examples/bundle-webpack#setup
// https://github.com/ipfs/js-ipfs-http-client/blob/master/examples/bundle-webpack/src/App.js
// ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"
// ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials "[\"true\"]"

// TODO(burdon): List files referenced from the registry.

const Page = () => {
  const { config } = useContext(AppContext);
  const [status, setStatus] = useState({});
  const [error, setError] = useState();

  const handleRefresh = async () => {
    try {
      // https://github.com/ipfs/js-ipfs-http-client#api
      const ipfs = IpfsHttpClient(config.ipfs.server);
      const version = await ipfs.version();
      const status = await ipfs.id();
      status.addresses = status.addresses.map(address => String(address));
      setStatus({ result: { version, status }, ts: Date.now() });
      setError(null);
    } catch (error) {
      console.error(error);
      setError(String(error));
    }

    // TODO(burdon): Test load/save file.
    // const data = await IpfsHttpClient.urlSource('https://ipfs.io/images/ipfs-logo.svg');
    // const hash = await ipfs.add(data);
    // console.log(hash, data);
  };

  const handleStart = async () => {
    const { error } = await request('/api/ipfs?command=start');
    if (error) {
      setError(error);
    } else {
      setError(null);
      await handleRefresh();
    }
  };

  const handleStop = async () => {
    setError(null);
    const { error } = await request('/api/ipfs?command=shutdown');
    if (error) {
      setError(error);
    }
  };

  useEffect(() => { handleRefresh(); }, []);

  const { result, ts } = status;
  return (
    <Fragment>
      <Toolbar>
        <div>
          <Button color="primary" onClick={handleRefresh}>Refresh</Button>
          <Button onClick={handleStart}>Start</Button>
          <Button onClick={handleStop}>Stop</Button>
        </div>
        <div>
          <MuiLink href={config.ipfs.console} rel="noreferrer" target="_blank">
            <OpenIcon />
          </MuiLink>
        </div>
      </Toolbar>

      <Content>
        <Json json={result} />
        {ts && <Timer start={ts} />}

        <Error message={error} onClose={() => setError(null)} />
      </Content>
    </Fragment>
  );
};

export default withLayout(Page);
