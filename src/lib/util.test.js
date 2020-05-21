//
// Copyright 2020 Wireline, Inc.
//

import { getServiceUrl } from './util';

const config = {
  services: {
    foo: {
      server: 'http://localhost:3000/foo'
    },

    bar: {
      server: 'http://localhost:3000/bar'
    }
  },

  routes: {
    foo: {
      server: '/foo'
    }
  }
};

// TODO(burdon): Won't run without .babelrc which breaks nextjs.
test('getServiceUrl', () => {
  expect(() => getServiceUrl({}, 'foo.server')).toThrow();

  expect(getServiceUrl(config, 'foo.server')).toEqual('/foo');
  expect(getServiceUrl(config, 'foo.server', { path: '/123' })).toEqual('/foo/123');
  expect(getServiceUrl(config, 'foo.server', { path: '/123', absolute: true })).toEqual('http://localhost/foo/123');

  expect(getServiceUrl(config, 'bar.server')).toEqual('http://localhost:3000/bar');
  expect(getServiceUrl(config, 'bar.server', { path: '/123' })).toEqual('http://localhost:3000/bar/123');
  expect(getServiceUrl(config, 'bar.server', { path: '/123', absolute: true })).toEqual('http://localhost:3000/bar/123');
});
