# gettext-js
 
A tool to manage PO files in javascript application. 


## Install

```
npm install --save-dev gettext-js
```


## Usage

The package contains two files:

- **tasks.js** : contains gulp tasks to manage PO files

- **translation.js** : contains class with methods to translate strings (using ```babel-jsxgettext`` and ```Jed``` packages)


### tasks.js

Import the file in your gulpfile.js:
```
import TranslationTasks from 'gettext-js/lib/build/tasks';
```

Initialize the translation tasks class defining these parameters:
```
const gettextJsTasks = new TranslationTasks(gulp, sourceJs, localeMainFile, sourceLocale, destLocale);

```
where 
```
   * @param {Object} gulp - A gulp instance reference
   * @param {String} sourceJs - Path to Javascript files containing gettext keywords (ex: 'src/js/*.js')
   * @param {String} localeMainFile - Path to main POT file (ex: 'locale/template.pot')
   * @param {String} sourceLocale - Path to PO files containing translations (ex: 'locale/*.po')
   * @param {String} destLocale - Path to JSON files to use in the application (ex: 'src/locale')
```


Load tasks:
```
gettextJsTasks.load();
```

Now in your gulpfile are present two tasks:

- **gtx:locale-update** : updates POT file (this.localeMainFile) with new keys. It parses source javascript files (this.sourceJs) looking for the key 'gettext'
- **gtx:locale-build** : converts PO files to JSON using Jed 1.x syntax

Enjoy!


### translation.js

Import Translation class and JSON files containing your translations:
```
import Translation from 'gettext-js/lib/js/translation';
import it from '../locale/it';
import en from '../locale/en';
```

Initialize translation class and set language:
```
var translation = new Translation({it: it, en: en});
translation.language = 'it';
```

Now your gettext function can translate strings in your selected language.


#### NOTE:

This class can be used to translate keys using browserify.
To achieve this, you have change to change your browserify bundle in this way:
```
function getBrowserify(files) {
  var b = browserify({
    entries: files
  });

  // include language catalogs
  var catalogs = glob.sync('your_local_path_to_JSON_files', {realpath: true});
  for (const catalog of catalogs) {
    var content = require(catalog);
    b = b.require(catalog, {expose: `__locale_${content.locale_data.messages[''].lang}`});
  }

  // make json files readble to browserify
  b = b.transform(partialify);
  return b;
}
```
