import React, { PropTypes } from 'react';
import classnames from 'classnames';

import classes from './BusinessCard.css';

const BusinessCard = ({ className, children }) => (
  <div className={classnames(classes.self, className)}>
    {children}
  </div>
);

BusinessCard.propTypes = {
  children: PropTypes.node
};

module.exports = { BusinessCard };
