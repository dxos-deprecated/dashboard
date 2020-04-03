//
// Copyright 2020 DxOS
//

import React, { Fragment, useEffect, useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';

import { apiRequest } from '../lib/request';
import { ignorePromise } from '../lib/util';
import { withLayout } from '../hooks';

import Content from '../components/Content';
import Error from '../components/Error';
import JsonTreeView from '../components/JsonTreeView';
import Toolbar from '../components/Toolbar';

const Page = () => {
  const [{ ts, result, error }, setStatus] = useState({});

  const resetError = () => setStatus({ ts, result, error: undefined });

  const handleRefresh = async () => {
    const status = await apiRequest('/api/status');
    setStatus(status);
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
      </Toolbar>

      <Content updated={ts}>
        <JsonTreeView data={result} />
      </Content>

      <Error message={error} onClose={resetError} />
    </Fragment>
  );
};

export default withLayout(Page);
