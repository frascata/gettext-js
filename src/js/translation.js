/**
 * Translation module.
 * @module gettext-js/src/js/translation
 */
import Jed from 'jed';

let dictionaries = {};


/**
 * Class for managing translations for the project
 * Translations are taken from languageModules dictionary or imported via require using syntax '__locale_${language_filename}'
 */
export default class {
  /**
   * Initialize the Translation class.
   * @param {Object} languageModules - A dictionary containing the language as key and the Jed data as value
   * @param {String} localeFilePrefix - A string prefix used as reference to import JSON file containing translations
   */
  constructor(languageModules = {}, localeFilePrefix = '__locale_') {
    this._language = null;
    this._localeFilePrefix = localeFilePrefix;
    this.dictionaries = languageModules;
  }

  get language() {
    return this._language;
  }

  set language(value) {
    if (!dictionaries[value]) {
      try {
        dictionaries[value] = new Jed(require(`${this._localeFilePrefix}${value}`));
      } catch (ex) {
        console.warn(`Language with code ${value} is not available`);
      }
    }
    this._language = value;
  }

  get dictionaries() {
    return dictionaries;
  }

  set dictionaries(languagesDictionary) {
    Object.keys(languagesDictionary).forEach(function (language) {
      dictionaries[language] = new Jed(languagesDictionary[language]);
    });
  }

  gettext(msgid) {
    var currentDictionary = dictionaries[this._language];
    if (currentDictionary) {
      return currentDictionary.gettext(msgid);
    }
    return msgid;
  }

  ngettext(singular, plural, count) {
    var currentDictionary = dictionaries[this._language];
    if (currentDictionary) {
      return currentDictionary.ngettext(singular, plural, count);
    }
    return count === 1 ? singular : plural;
  }

  gettext_noop(msgid) { //eslint-disable-line camelcase
    return msgid;
  }

  pgettext(context, msgid) {
    var currentDictionary = dictionaries[this._language];
    if (currentDictionary) {
      return currentDictionary.pgettext(context, msgid);
    }
    return msgid;
  }

  npgettext(context, singular, plural, count) {
    var currentDictionary = dictionaries[this._language];
    if (currentDictionary) {
      return currentDictionary.npgettext(context, singular, plural, count);
    }
    return count === 1 ? singular : plural;
  }
}
