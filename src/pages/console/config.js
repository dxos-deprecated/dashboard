//
// Copyright 2020 DxOS
//

import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';

import { JsonTreeView } from '@dxos/react-ux';

import Content from '../../components/Content';
import Layout from '../../components/Layout';
import Toolbar from '../../components/Toolbar';

export { getServerSideProps } from '../../lib/server/config';

const Page = ({ config }) => {
  const handleRefresh = async () => {
    window.location.reload();
  };

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
        <JsonTreeView data={config} />
      </Content>
    </Layout>
  );
};

export default Page;
