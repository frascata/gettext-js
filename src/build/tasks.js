/**
 * Build tasks module.
 * @module gettext-js/src/build/tasks
 */
import gettext from 'babel-jsxgettext';
import glob from 'glob';
import gulpLoadPlugins from 'gulp-load-plugins';
import po2json from 'gulp-po2json';

const $ = gulpLoadPlugins();

/**
 * Class for registering gulp task for managing PO files
 */
export default class {
  /**
   * Initialize the build utils class.
   * @param {Object} gulp - A gulp instance reference
   * @param {String} sourceJs - Path to Javascript files containing gettext keywords
   * @param {String} localeMainFile - Path to main POT file
   * @param {String} sourceLocale - Path to PO files containing translations
   * @param {String} destLocale - Path to JSON files to use in the application
   */
  constructor(gulp, sourceJs, localeMainFile, sourceLocale, destLocale) {
    this.gulp = gulp;

    this.sourceJs = sourceJs; //'src/**/*.js'
    this.localeMainFile = localeMainFile; //'locale/template.pot'

    this.sourceLocale = sourceLocale; // 'locale/*.po'
    this.destLocale = destLocale; // 'src/locale'
  }

  /**
   * Loads gulp tasks for gettext-js.
   */
  load() {
    /**
     * Update POT file (this.localeMainFile) with new keys.
     * It parses source javascript files (this.sourceJs) looking for the key 'gettext'
     */
    this.gulp.task('gtx:locale-update', () => {
      gettext(glob.sync(this.sourceJs), this.localeMainFile, null, (err) => {
        if (err) {
          $.util.log(err);
        }
      });
    });

    /**
     * Converts PO files to JSON using Jed 1.x syntax
     */
    this.gulp.task('gtx:locale-build', () => {
      return this.gulp.src(this.sourceLocale)
        .pipe(po2json({format: 'jed1.x'}))
        .pipe(this.gulp.dest(this.destLocale));
    });
  }
}
