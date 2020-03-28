//
// Copyright 2020 DxOS
//

import React, { Fragment, useEffect, useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';

import { noPromise, apiRequest } from '../lib/request';
import { withLayout } from '../hooks';

import Content from '../components/Content';
import Error from '../components/Error';
import Json from '../components/Json';
import Toolbar from '../components/Toolbar';

const Page = () => {
  const [{ ts, result, error }, setStatus] = useState({});

  const resetError = () => setStatus({ ts, result, error: undefined });

  const handleRefresh = async () => {
    const status = await apiRequest('/api/status');
    await setStatus(status);
  };

  useEffect(noPromise(handleRefresh), []);

  return (
    <Fragment>
      <Toolbar>
        <div>
          <IconButton onClick={handleRefresh} title="Restart">
            <RefreshIcon />
          </IconButton>
        </div>
      </Toolbar>

      <Content updated={ts}>
        <Json json={result} />
      </Content>

      <Error message={error} onClose={resetError} />
    </Fragment>
  );
};

export default withLayout(Page);
