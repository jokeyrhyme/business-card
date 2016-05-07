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
    <article className={classes.content} itemScope itemType='https://schema.org/Person'>
      <h1 className={classes.name}>
        <span itemProp='givenName'>Ron</span>
        {' '}
        <span itemProp='familyName'>Waldon</span>
      </h1>

      <section className={classes.org}>
        <h2 className={classes.jobTitle} itemProp='jobTitle'>Senior Full-Stack Software Engineer</h2>
        <div itemProp='worksFor' itemScope itemType='https://schema.org/Organization'>
          <h2 className={classes.orgName} itemProp='name'>BlinkMobile</h2>
          <ul>
            <li itemProp='url'>
              <a href='http://www.blinkmobile.com.au/'>www.blinkmobile.com.au</a>
            </li>
            <li itemProp='email'>
              <a href='mailto:ron@blinkmobile.com.au'>ron@blinkmobile.com.au</a>
            </li>
            <li itemProp='telephone'>
              <a href='tel:+61243221355'>+61 2 4322 1355</a>
            </li>
            <li itemProp='address' itemScope itemType='https://schema.org/PostalAddress'>
              <span itemProp='streetAddress'>Suite 2, 125 Donnison Street</span>
              <br />
              <span itemProp='addressLocality'>Gosford</span>
              {' '}
              <span itemProp='addressRegion'>NSW</span>
              {' '}
              <span itemProp='postalCode'>2250</span>
              {' '}
              <span itemProp='addressCountry'>Australia</span>
            </li>
          </ul>
        </div>
      </section>
    </article>
  </BusinessCard>
);

// <ul>
//   <li itemProp='contactPoint'>
//     <a itemProp='email' href='mailto:jokeyrhyme@gmail.com'>jokeyrhyme@gmail.com</a>
//   </li>
// </ul>

module.exports = { App };
