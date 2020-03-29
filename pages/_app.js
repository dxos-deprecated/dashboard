//
// Copyright 2020 DxOS
//

import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import AppContext from '../components/AppContext';

import config from '../lib/config';
import theme from '../lib/theme';

export default class DashboardApp extends App {

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <React.Fragment>
        <Head>
          <title>{config.app.title}</title>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppContext.Provider value={{ config }}>
            <Component {...pageProps} />
          </AppContext.Provider>
        </ThemeProvider>
      </React.Fragment>
    );
  }
}
