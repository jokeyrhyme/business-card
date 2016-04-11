'use strict';

const fs = require('fs');
const path = require('path');

const gulp = require('gulp');
const React = require('react');
const ReactDOMServer = require('react-dom/server.js');
const rimraf = require('rimraf');

const App = require('./src/components/App.js').App;

gulp.task('default', [
  'copy:css',
  'copy:html',
  'embed:css',
  'embed:jsx'
]);

gulp.task('copy:html', () => {
  return gulp.src('./src/index.html')
    .pipe(gulp.dest('./'));
});

gulp.task('clean:css', (done) => {
  rimraf('./index.css', done);
});

gulp.task('copy:css', ['clean:css'], () => {
  return gulp.src('./src/index.css')
    .pipe(gulp.dest('./'));
});

gulp.task('embed:css', ['copy:css', 'copy:html'], () => {
  const htmlPath = path.join(__dirname, 'index.html');
  const cssPath = path.join(__dirname, 'index.css');

  let html = fs.readFileSync(htmlPath, 'utf8');
  const css = fs.readFileSync(cssPath, 'utf8');

  html = html.replace(
    '<link href="index.css" rel="stylesheet" />',
    `<style>${css}</style>`
  );
  fs.writeFileSync(htmlPath, html, 'utf8');
  fs.unlinkSync(cssPath);
});

gulp.task('embed:jsx', ['copy:html'], () => {
  const htmlPath = path.join(__dirname, 'index.html');

  let html = fs.readFileSync(htmlPath, 'utf8');

  html = html.replace(
    '<main></main>',
    ReactDOMServer.renderToString(<App />)
  );
  fs.writeFileSync(htmlPath, html, 'utf8');
});
