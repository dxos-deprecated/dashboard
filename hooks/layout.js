//
// Copyright 2020 DxOS
//

import React from 'react';

import Layout from '../components/Layout';

import modules from '../lib/modules';

export const withLayout = (Page, options) => () => {
  return (
    <Layout modules={modules} {...options}>
      <Page />
    </Layout>
  );
};
