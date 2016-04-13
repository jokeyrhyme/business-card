'use strict';

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

import buffer from 'vinyl-buffer';
import browserify from 'browserify';
import cssModulesRequireHook from 'css-modules-require-hook';
import gulp from 'gulp';
import gutil from 'gulp-util';
import React from 'react';
import ReactDOMServer from 'react-dom/server.js';
import rimraf from 'rimraf';
import source from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';

const cssHash = (name, file, css) => {
  // http://stackoverflow.com/a/11869589
  return crypto.createHash('md5')
    .update(name + file + css)
    .digest('hex')
    .substring(0, 5);
};

const CSS_MODULES_CONFIG = {
  generateScopedName: (name, filename, css) => {
    const file = path.basename(filename, '.css');
    return `${file}_${name}_${cssHash(name, file, css)}`;
  },
  rootDir: './src'
};
cssModulesRequireHook(Object.assign({}, CSS_MODULES_CONFIG));

gulp.task('default', [
  'browserify',
  'copy:html',
  'embed:css',
  'embed:jsx'
]);

gulp.task('browserify', ['clean:css', 'clean:js'], function () {
  const b = browserify({
    basedir: './src',
    debug: true,
    entries: [ './index.js' ],
    plugin: [
      [ require('css-modulesify'), Object.assign({
        global: true,
        output: './styles.css'
      }, CSS_MODULES_CONFIG) ]
    ],
    transform: [
      require('babelify')
    ]
  });
  return b.bundle()
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    // Add transformation tasks to the pipeline here.
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./'));
});

gulp.task('copy:html', () => {
  return gulp.src('./src/index.html')
    .pipe(gulp.dest('./'));
});

gulp.task('clean:css', (done) => {
  rimraf('./styles.css', done);
});

gulp.task('clean:js', (done) => {
  rimraf('./index.js*', done);
});

gulp.task('embed:css', ['browserify', 'copy:html'], () => {
  const htmlPath = path.join(__dirname, 'index.html');
  const cssPath = path.join(__dirname, 'styles.css');

  let html = fs.readFileSync(htmlPath, 'utf8');
  const css = fs.readFileSync(cssPath, 'utf8');

  html = html.replace(
    '<link href="styles.css" rel="stylesheet" />',
    `<style>${css}</style>`
  );
  fs.writeFileSync(htmlPath, html, 'utf8');
  fs.unlinkSync(cssPath);
});

gulp.task('embed:jsx', ['copy:html'], () => {
  const App = require('./src/components/App.js').App;
  const htmlPath = path.join(__dirname, 'index.html');
  let html = fs.readFileSync(htmlPath, 'utf8');

  html = html.replace(
    '<main></main>',
    `<main>${ReactDOMServer.renderToString(<App />)}</main>`
  );
  fs.writeFileSync(htmlPath, html, 'utf8');
});
