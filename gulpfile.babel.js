'use strict';

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

import buffer from 'vinyl-buffer';
import browserify from 'browserify';
import cssModulesRequireHook from 'css-modules-require-hook';
import gulp from 'gulp';
import gutil from 'gulp-util';
import postcss from 'gulp-postcss';
import React from 'react';
import ReactDOMServer from 'react-dom/server.js';
import rimraf from 'rimraf';
import source from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';
import through from 'through2';
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
  'html'
]);

gulp.task('browserify', ['clean:js'], function () {
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

gulp.task('clean:js', (done) => {
  rimraf('./index.js*', done);
});

gulp.task('css', ['browserify'], () => {
  return gulp.src('./styles.css')
    .pipe(postcss([
      require('postcss-cssnext'),
      require('cssnano')
    ]))
    .pipe(gulp.dest('./'));
});

const embedCSP = () => through.obj((file, encoding, cb) => {
  const cspData = require('./src/csp.json');
  const csp = Object.keys(cspData).reduce((csp, directive) => {
    const sources = cspData[directive];
    return `${csp} ${directive} ${sources.join(' ')};`;
  }, '');

  let html = file.contents.toString(encoding);
  html = html.replace(
    '<meta http-equiv="Content-Security-Policy" content="" />',
    `<meta http-equiv="Content-Security-Policy" content="${csp}" />`
  );
  file.contents = Buffer.from(html, encoding);
  cb(null, file);
});

const embedCSS = () => through.obj((file, encoding, cb) => {
  const cssPath = path.join(__dirname, 'styles.css');
  const css = fs.readFileSync(cssPath, 'utf8');

  let html = file.contents.toString(encoding);
  html = html.replace(
    '<link href="styles.css" rel="stylesheet" />',
    `<style>${css}</style>`
  );
  file.contents = Buffer.from(html, encoding);
  fs.unlinkSync(cssPath);
  cb(null, file);
});

const embedJSX = () => through.obj((file, encoding, cb) => {
  const App = require('./src/components/App.js').App;

  let html = file.contents.toString(encoding);
  html = html.replace(
    '<main></main>',
    `<main>${ReactDOMServer.renderToString(<App />)}</main>`
  );
  file.contents = Buffer.from(html, encoding);
  cb(null, file);
});

gulp.task('html', ['browserify', 'css'], () => {
  return gulp.src('./src/index.html')
    .pipe(embedCSS())
    .pipe(embedCSP())
    .pipe(embedJSX())
    .pipe(gulp.dest('./'));
});
