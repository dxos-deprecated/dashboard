//
// Copyright 2020 DxOS
//

import React, { Fragment, useContext } from 'react';

import { withLayout } from '../hooks';

import AppContext from '../components/AppContext';
import Content from '../components/Content';
import Json from '../components/Json';

const Page = () => {
  const { config } = useContext(AppContext);

  return (
    <Fragment>
      <Content>
        <Json json={config} />
      </Content>
    </Fragment>
  );
};

export default withLayout(Page);
