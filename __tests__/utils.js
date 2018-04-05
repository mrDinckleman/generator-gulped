'use strict';
const assert = require('yeoman-assert');
const utils = require('../lib/utils');

describe('utils', () => {
  describe('.required()', () => {
    it('tells whether the string is empty', () => {
      assert.ok(!utils.required(''), 'empty string should return false');
      assert.ok(utils.required('foo bar'), 'non-empty string should return true');
    });
  });
  describe('.newAuthorMessage()', () => {
    it('return string', () => {
      assert.equal(utils.newAuthorMessage(true), 'New author');
      assert.equal(utils.newAuthorMessage(false), 'Author');
    });
  });
});
