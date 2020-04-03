//
// Copyright 2020 DxOS
//

import React, { Fragment, useContext } from 'react';

import { withLayout } from '../hooks';

import AppContext from '../components/AppContext';
import Content from '../components/Content';
import JsonTreeView from '../components/JsonTreeView';

const Page = () => {
  const { config } = useContext(AppContext);

  return (
    <Fragment>
      <Content>
        <JsonTreeView data={config} />
      </Content>
    </Fragment>
  );
};

export default withLayout(Page);
