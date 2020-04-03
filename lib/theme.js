//
// Copyright 2019 DxOS
//

import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import grey from '@material-ui/core/colors/grey';
import orange from '@material-ui/core/colors/orange';

const createTheme = config => createMuiTheme({

  // https://stackoverflow.com/questions/60567673/reactjs-material-ui-theme-mixins-toolbar-offset-is-not-adapting-when-toolbar
  mixins: {
    denseToolbar: {
      minHeight: 48
    }
  },

  // https://material-ui.com/customization/globals/#default-props
  props: {
    MuiButtonBase: {
      disableRipple: true
    },
  },

  // https://material-ui.com/customization/palette/
  palette: config.app.theme === 'dark' ? {
    type: 'dark',
    primary: orange,
    border: `1px solid ${grey[700]}`
  } : {
    primary: blue,
    border: `1px solid ${grey[200]}`
  },

  // https://material-ui.com/customization/theming/#theme-configuration-variables

  // https://material-ui.com/customization/globals/
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          margin: 0,
          overflow: 'hidden'
        }
      }
    }
  }
});

export default createTheme;
