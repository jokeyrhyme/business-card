import React, { PropTypes } from 'react';

import classes from './BusinessCard.css';

const BusinessCard = ({ children }) => (
  <div className={classes.self}>
    {children}
  </div>
);

BusinessCard.propTypes = {
  children: PropTypes.element
};

module.exports = { BusinessCard };
