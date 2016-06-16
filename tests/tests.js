import assert from 'assert';
import Translation from '../lib/js/translation';
//import Tasks from '../src/build/tasks';

describe('The imported packages', function () {
  it('should be correctly imported', function () {
    assert.notEqual(Translation, undefined);
    //assert.notEqual(Tasks, undefined);
  });
});

describe('Translation class', function () {
  it('should be correctly created', function () {
    let i18n = new Translation();
    assert.notEqual(i18n, undefined);
    assert.notEqual(i18n.gettext, undefined);
  });
});
