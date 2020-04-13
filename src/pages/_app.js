//
// Copyright 2020 DxOS
//

import debug from 'debug';
import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import AppContext from '../components/AppContext';

import config from '../lib/config';
import createTheme from '../lib/theme';
import modules from '../lib/modules';
import logo from '../../config/logo.txt';

export { getServerSideProps } from '../lib/server/config';

const log = debug('dxos:dashboard:app');

/**
 * https://nextjs.org/docs/advanced-features/custom-app
 */
class DashboardApp extends App {

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }

    debug.enable(config.system.debug);
    console.log(logo);
    log('Config:', JSON.stringify(config, undefined, 2));
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <React.Fragment>
        <Head>
          <title>{config.app.title}</title>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={createTheme(config.app.theme)}>
          <CssBaseline />
          <AppContext.Provider value={{ config, modules, sidebar: true }}>
            <Component {...pageProps} />
          </AppContext.Provider>
        </ThemeProvider>
      </React.Fragment>
    );
  }
}

export default DashboardApp;
