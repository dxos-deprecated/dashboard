//
// Copyright 2020 DxOS
//

import React, { useEffect, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';

import { JsonTreeView } from '@dxos/react-ux';

import { getServiceUrl, httpGet, ignorePromise } from '../../lib/util';
import { useIsMounted } from '../../hooks';

import Content from '../../components/Content';
import Layout from '../../components/Layout';
import Toolbar from '../../components/Toolbar';
import Error from '../../components/Error';

export { getServerSideProps } from '../../lib/server/config';

const Page = ({ config }) => {
  const { ifMounted } = useIsMounted();
  const [{ ts, result, error }, setStatus] = useState({});

  const resetError = () => setStatus({ ts, result, error: undefined });

  //
  // https://tools.ietf.org/html/rfc5785
  // yarn well-known
  // curl http://localhost:9000/.well-known/dxos (dev)
  //
  const handleRefresh = async () => {
    const endpoint = getServiceUrl(config, 'wellknown.endpoint');
    if (endpoint) {
      const status = await httpGet(endpoint);
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

export default Page;
