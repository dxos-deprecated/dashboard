//
// Copyright 2020 DxOS
//

import React, { Fragment, useContext } from 'react';

import AppContext from '../src/components/AppContext';
import Content from '../src/components/Content';
import Json from '../src/components/Json';
import withLayout from '../src/components/Layout';

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
