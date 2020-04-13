//
// Copyright 2020 DxOS
//

import React, { useEffect, useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';

import { JsonTreeView } from '@dxos/react-ux';

import { httpGet, ignorePromise } from '../../lib/util';
import { useIsMounted } from '../../hooks';

import Content from '../../components/Content';
import Error from '../../components/Error';
import Toolbar from '../../components/Toolbar';
import Layout from '../../components/Layout';

export { getServerSideProps } from '../../lib/config';

const Page = ({ config }) => {
  const { ifMounted } = useIsMounted();
  const [{ ts, result, error }, setStatus] = useState({});

  const resetError = () => setStatus({ ts, result, error: undefined });

  const handleRefresh = async () => {
    const status = await httpGet('/api/status');
    ifMounted(() => setStatus(status));
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

export default Page;
