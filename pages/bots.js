//
// Copyright 2020 DxOS
//

import React, { Fragment, useState } from 'react';
import Button from '@material-ui/core/Button';

import { request } from '../src/http';
import Toolbar from '../src/components/Toolbar';
import Content from '../src/components/Content';
import Json from '../src/components/Json';
import Timer from '../src/components/Timer';
import Error from '../src/components/Error';
import { withLayout } from '../src/components/Layout';

const Page = () => {
  const [status, setStatus] = useState({});
  const [error, setError] = useState();

  const handleRefresh = async () => {
    const { result, error } = await request('/api/bots?command=version');
    if (error) {
      setError(String(error));
    } else {
      setError(null);
      setStatus({ result, ts: Date.now() });
    }
  };

  const handleStart = () => {};
  const handleStop = () => {};

  const { result, ts } = status;
  return (
    <Fragment>
      <Toolbar>
        <div>
          <Button color="primary" onClick={handleRefresh}>Refresh</Button>
          <Button onClick={handleStart}>Start</Button>
          <Button onClick={handleStop}>Stop</Button>
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
