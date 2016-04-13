import React from 'react';
import ReactDOM from 'react-dom';
import WebFont from 'webfontloader';

import { App } from './components/App.js';

ReactDOM.render(<App />, document.querySelector('main'));

WebFont.load({
  classes: false,
  events: false,
  google: {
    families: ['Source Sans Pro']
  }
});
