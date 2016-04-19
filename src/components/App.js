import React from 'react';

import { BusinessCard } from './BusinessCard.js';

import '../styles.css';
import classes from './App.css';

const App = () => (
  <BusinessCard>
    <p className={classes.message}>Coming soon...</p>
  </BusinessCard>
);

module.exports = { App };
