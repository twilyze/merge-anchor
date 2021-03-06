'use strict';
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const pkg = require('./package.json');
const del = require('del');
const crLfReplace = require('gulp-cr-lf-replace');

const uglifyes = require('uglify-es');
const composer = require('gulp-uglify/composer');
const minify = composer(uglifyes, console);

const TARGET = 'illustrator';
const CREATED_YEAR = '2018';
const SOURCE_PATH = [
  'src/settings.js',
  'src/_*.js',
  'src/main.js',
];
const OUTPUT_NAME = pkg.name;
const COPY_FILE = ['README.md', 'LICENSE'];
const REPLACE_README_REGEX = /(?<=\]\()\//g;
const REPLACE_README_TEXT = pkg.url + '/tree/v' + pkg.version + '/';
const DEST_PATH = 'dist';
const TEMP_PATH = process.env.TEMP;
const ESLINT_RC = 'compile.eslintrc';


//----------------------
// 埋め込みコード
//----------------------
function dateFormat(num) {
  return (num < 10) ? '0' + num : num;
}

const d = new Date();
Object.assign(pkg, {
  dateTime    : d.getFullYear() + '-' + dateFormat(d.getMonth() + 1) + '-' + dateFormat(d.getDate()),
  licenseURL  : pkg.url + '/blob/master/LICENSE',
  createdYear : CREATED_YEAR
});

const banner = [
  '/*!',
  '<%= pkg.name %>',
  'v<%= pkg.version %> <%= pkg.dateTime %>',
  '<%= pkg.url %>',
  'Copyright (c) <%= pkg.createdYear %> <%= pkg.author %>',
  'This script is released under the MIT License.',
  '<%= pkg.licenseURL %>',
  '*/',
  `#target ${TARGET};`,
  ''
].join('\n');

const embedCodeHeader = [
  '(function() {',
  `var SCRIPT_TITLE = '${pkg.name}';`,
  `var SCRIPT_VERSION = '${pkg.version}';`,
  ''
].join('\n');

const embedCodeFooter = '}());\n';


//----------------------
// 出力タスク
//----------------------
function compileJSX(dir, isDev, isMinify) {
  return gulp.src(SOURCE_PATH)
    .pipe($.plumber({
      errorHandler : $.notify.onError('\n[<%= error.name %>] in plugin \'<%= error.plugin %>\'\n<%= error.message %>')
    }))
    .pipe($.concat(OUTPUT_NAME))
    .pipe($.header(embedCodeHeader))
    .pipe($.footer(embedCodeFooter))
    .pipe($.eslint({useEslintrc: true, configFile: ESLINT_RC}))
    .pipe($.eslint.format('stylish'))
    .pipe($.eslint.failAfterError())
    .pipe($.if(!isDev && !isMinify, $.replace(/ *(\/\/ )?\$\.write(ln)?.+\n/g, '')))
    .pipe($.if(isMinify, minify({
      compress : {
        booleans   : false,
        pure_funcs : isDev ? [] : ['$.writeln', '$.write']
      },
      mangle : {
        eval     : true,
        toplevel : true,
        reserved : ['equalsObject', 'equalsArray'],
      }
    })))
    .pipe($.rename({extname: isMinify ? '.min.jsx' : '.jsx'}))
    .pipe($.if(!isDev, $.header(banner, {pkg: pkg})))
    .pipe($.bom())
    .pipe(gulp.dest(dir));
}

gulp.task('jsx', () => {
  return compileJSX(DEST_PATH, false, false);
});
gulp.task('jsxmin', () => {
  return compileJSX(DEST_PATH, false, true);
});
gulp.task('jsx:dev', () => {
  return compileJSX(TEMP_PATH, true, false);
});
gulp.task('jsxmin:dev', () => {
  return compileJSX(TEMP_PATH, true, true);
});


gulp.task('clean', () => {
  return del(DEST_PATH + '/*.*');
});
gulp.task('copy', () => {
  return gulp.src(COPY_FILE)
    .pipe($.if(file => {
      return file.path.indexOf(COPY_FILE[0]) !== -1;
    }, $.replace(REPLACE_README_REGEX, REPLACE_README_TEXT)))
    .pipe(crLfReplace({changeCode: 'CR+LF'}))
    .pipe($.rename({extname: '.txt'}))
    .pipe(gulp.dest(DEST_PATH));
});


gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('jsx', 'jsxmin', 'copy')
));

gulp.task('watch', gulp.series('jsx:dev', () => {
  gulp.watch(SOURCE_PATH, gulp.series('jsx:dev'));
}));

gulp.task('default', gulp.series('build'));
