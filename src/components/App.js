import React from 'react';

import { BusinessCard } from './BusinessCard.js';
import { GitHubCorner } from './GitHubCorner.js';

import '../styles.css';
import classes from './App.css';

const GITHUB_URL = 'https://github.com/jokeyrhyme/business-card';
const GITHUB_TITLE = 'source code on GitHub';

const App = () => (
  <BusinessCard className={classes.card}>
    <a className={classes.github} href={GITHUB_URL} title={GITHUB_TITLE}>
      <GitHubCorner />
    </a>
    <p className={classes.message}>Coming soon...</p>
  </BusinessCard>
);

module.exports = { App };
