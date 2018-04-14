'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const app = path.join(__dirname, '../generators/page');

describe('generator-gulped:page', () => {
  describe('creating files', () => {
    const pageName = 'page';
    beforeAll(() => helpers.run(app));

    it('create template and data file', () => {
      assert.file([`app/views/${pageName}.ejs`, `app/views/${pageName}.json`]);
    });
  });
  describe('creating files using argument', () => {
    const pageName = 'argument';
    beforeAll(() => helpers.run(app).withArguments([pageName]));

    it('create template and data file', () => {
      assert.file([`app/views/${pageName}.ejs`, `app/views/${pageName}.json`]);
    });
  });
  describe('creating files using prompt', () => {
    const pageName = 'prompt';
    beforeAll(() => helpers.run(app).withPrompts({ name: pageName }));

    it('create template and data file', () => {
      assert.file([`app/views/${pageName}.ejs`, `app/views/${pageName}.json`]);
    });
  });
});
