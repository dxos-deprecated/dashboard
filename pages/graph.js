//
// Copyright 2020 DxOS
//

import React from 'react';

// TODO(burdon): Factor out.
function genRandomTree(N = 300, reverse = false) {
  return {
    nodes: [...Array(N).keys()].map(i => ({ id: i })),
    links: [...Array(N).keys()]
      .filter(id => id)
      .map(id => ({
        [reverse ? 'target' : 'source']: id,
        [reverse ? 'source' : 'target']: Math.round(Math.random() * (id - 1))
      }))
  };
}

const Page = () => {
  const ClientGraph = () => {
    if (!process.browser) {
      return <div />;
    }

    // eslint-disable-next-line global-require
    const Graph  = require('../src/components/Graph').default;

    return <Graph data={genRandomTree(50)} />;
  };

  return (
    <ClientGraph />
  );
};

export default Page;