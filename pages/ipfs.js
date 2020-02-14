//
// Copyright 2020 DxOS
//

import superagent from 'superagent';
import IpfsHttpClient from 'ipfs-http-client';

import React, { Fragment, useEffect, useState, useContext } from 'react';
import Button from '@material-ui/core/Button';

import withLayout from '../src/components/Layout';
import AppContext from '../src/components/AppContext';
import Content from '../src/components/Content';
import Error from '../src/components/Error';
import Json from '../src/components/Json';
import Timer from '../src/components/Timer';
import Toolbar from '../src/components/Toolbar';

// NOTE: Must set-up CORS first.
// https://github.com/ipfs/js-ipfs-http-client#in-a-web-browser
// https://github.com/ipfs/js-ipfs-http-client/tree/master/examples/bundle-webpack#setup
// https://github.com/ipfs/js-ipfs-http-client/blob/master/examples/bundle-webpack/src/App.js
// ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"
// ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials "[\"true\"]"

const Page = () => {
  const { config } = useContext(AppContext);
  const [status, setStatus] = useState({});
  const [error, setError] = useState();

  const fetch = url => superagent.get(url)
    .catch(({ response: { body, statusText } }) => {
      const { error } = body;
      console.error(error || statusText);
      setError(error || statusText);
    });

  const handleRefresh = async () => {
    try {
      const ipfs = IpfsHttpClient(config.ipfs.server);
      const version = await ipfs.version();
      const status = await ipfs.id();
      status.addresses = status.addresses.map(address => String(address));
      setStatus({ result: { version, status, }, ts: Date.now() });
    } catch (error) {
      console.error(error);
      setError(String(error));
    }

    // TODO(burdon): Link to Web UI.
    // http://127.0.0.1:5001/webui
    // const data = await IpfsHttpClient.urlSource('https://ipfs.io/images/ipfs-logo.svg');
    // const hash = await ipfs.add(data);
    // console.log(hash, data);
  };

  const handleStart = async () => {
    setError(null);
    await fetch('/api/ipfs?command=start');
    await handleRefresh();
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  const handleStop = async () => {
    setError(null);
    await fetch('/api/ipfs?command=shutdown');
  };

  useEffect(() => { handleRefresh(); }, []);

  const { result, ts } = status;
  return (
    <Fragment>
      <Toolbar>
        <Button color="primary" onClick={handleRefresh}>Refresh</Button>
        <Button onClick={handleStart}>Start</Button>
        <Button onClick={handleStop}>Stop</Button>
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
