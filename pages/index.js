//
// Copyright 2020 DxOS
//

import superagent from 'superagent';

import React, { Fragment, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';

import Content from '../src/components/Content';
import Error from '../src/components/Error';
import Json from '../src/components/Json';
import Timer from '../src/components/Timer';
import Toolbar from '../src/components/Toolbar';
import { withLayout } from '../src/components/Layout';

const Page = () => {
  const [status, setStatus] = useState({});
  const [error, setError] = useState();

  const handleRefresh = () => {
    superagent.get('/api/status')
      .then(({ body }) => {
        setStatus({ result: body, ts: Date.now() });
        setError(null);
      })
      .catch(({ response: { statusText } }) => {
        console.error(statusText);
        setError(statusText);
      });
  };

  useEffect(handleRefresh, []);

  const { result, ts } = status;
  return (
    <Fragment>
      <Toolbar>
        <div>
          <Button color="primary" onClick={handleRefresh}>Refresh</Button>
        </div>
      </Toolbar>

      <Content>
        <Json json={result} />
        {ts && <Timer start={ts} />}
      </Content>

      <Error message={error} onClose={handleRefresh} />
    </Fragment>
  );
};

export default withLayout(Page);
