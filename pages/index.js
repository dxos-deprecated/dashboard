//
// Copyright 2020 DxOS
//

import React, { useEffect, useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';

import { JsonTreeView } from '@dxos/react-ux';

import { getDyanmicConfig } from '../lib/config';
import { apiRequest } from '../lib/request';
import { ignorePromise } from '../lib/util';

import Content from '../components/Content';
import Error from '../components/Error';
import Toolbar from '../components/Toolbar';
import Layout from '../components/Layout';

const Page = ({ config }) => {
  const [{ ts, result, error }, setStatus] = useState({});

  const resetError = () => setStatus({ ts, result, error: undefined });

  const handleRefresh = async () => {
    const status = await apiRequest('/api/status');
    setStatus(status);
  };

  useEffect(ignorePromise(handleRefresh), []);

  return (
    <Layout config={config}>
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
    </Layout>
  );
};

Page.getInitialProps = async () => ({ config: await getDyanmicConfig() });

export default Page;
