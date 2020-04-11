//
// Copyright 2020 DxOS
//

import React, { useEffect, useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';

import { JsonTreeView } from '@dxos/react-ux';

import { getDyanmicConfig } from '../../lib/config';
import { httpGet, ignorePromise } from '../../lib/util';
import { useIsMounted } from '../../hooks';

import Content from '../../components/Content';
import Layout from '../../components/Layout';
import Toolbar from '../../components/Toolbar';
import Error from '../../components/Error';

const Page = ({ config }) => {
  const { ifMounted } = useIsMounted();
  const [{ ts, result, error }, setStatus] = useState({});

  const resetError = () => setStatus({ ts, result, error: undefined });

  const handleRefresh = async () => {
    const { system: { wellknownEndpoint } } = config;
    if (wellknownEndpoint) {
      const status = await httpGet(wellknownEndpoint);
      ifMounted(() => setStatus(status));
    } else {
      setStatus({ error: 'Well-known endpoint not configured.' });
    }
  };

  useEffect(ignorePromise(handleRefresh), [config]);

  return (
    <Layout config={config}>
      <Toolbar>
        <div>
          <IconButton onClick={handleRefresh} title="Restart">
            <RefreshIcon />
          </IconButton>
        </div>
      </Toolbar>

      <Content>
        <JsonTreeView data={result} />
      </Content>

      <Error message={error} onClose={resetError} />
    </Layout>
  );
};

Page.getInitialProps = async () => ({ config: await getDyanmicConfig() });

export default Page;
