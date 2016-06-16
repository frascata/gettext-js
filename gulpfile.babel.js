import gulp from 'gulp';
import babel from 'gulp-babel';
import browserify from 'browserify';
import mocaccino from 'mocaccino';
import phantomic from 'phantomic';
import glob from 'glob';
import eslint from 'gulp-eslint';
import del from 'del';
import gulpLoadPlugins from 'gulp-load-plugins';
import partialify from 'partialify';


const $ = gulpLoadPlugins();


function getBrowserify(files) {
  var b = browserify({
    entries: files
  });

  // include language catalogs
  var catalogs = glob.sync('tests/locale/*.json', {realpath: true});
  for (const catalog of catalogs) {
    var content = require(catalog);
    b = b.require(catalog, {expose: `__locale_${content.locale_data.messages[''].lang}`});
  }

  // make json files readble to browserify
  b = b.transform(partialify);
  return b;
}

function lint(files, options) {
  return () => {
    return gulp.src(files)
      .pipe(eslint(options))
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
  };
}

gulp.task('default', () => {
  gulp.start('build');
});

gulp.task('build', ['clean','lint'], () => {
    return gulp.src('src/**/*.js')
      .pipe(babel({presets: ["es2015"]}))
      .pipe(gulp.dest('lib'))
  }
);


gulp.task('clean', del.bind(null, ['lib']));

gulp.task('lint', lint('src/**/*.js'));

gulp.task('lint:test', lint('tests/*.js', {
  env: {
    mocha: true
  }
}));


gulp.task('test', ['lint:test', 'build'], () => {
  var b = getBrowserify(glob.sync('./tests/*.js'))
    .plugin(mocaccino, {reporter: 'spec'})
    .bundle();

  phantomic(b, {
    debug: false,
    port: 0,
    brout: true,
    'web-security': false,
    'ignore-ssl-errors': true
  }, function (code) {
    if (code !== 0) {
      process.exit(code);
    }
  }).pipe(process.stdout);
});


