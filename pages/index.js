//
// Copyright 2020 DxOS
//

import React, { Fragment, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';

import { noPromise, apiRequest } from '../src/request';
import { withLayout } from '../src/components/Layout';
import Content from '../src/components/Content';
import Error from '../src/components/Error';
import Json from '../src/components/Json';
import Timer from '../src/components/Timer';
import Toolbar from '../src/components/Toolbar';

const Page = () => {
  const [{ ts, result, error }, setStatus] = useState({});

  const resetError = error => setStatus({ ts, result, error });

  const handleRefresh = async () => {
    const status = await apiRequest('/api/status');
    await setStatus(status);
  };

  useEffect(noPromise(handleRefresh), []);

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

      <Error message={error} onClose={resetError} />
    </Fragment>
  );
};

export default withLayout(Page);
