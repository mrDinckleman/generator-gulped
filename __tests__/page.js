'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const app = path.join(__dirname, '../generators/page');

describe('generator-gulped:page', () => {
  describe('creating files', () => {
    const pageName = 'page';
    let dir;

    beforeAll(() => {
      return helpers.run(app).inTmpDir((tmpDir) => {
        dir = tmpDir;
      });
    });

    it('create template and data file', () => {
      assert.file([
        path.join(dir, `app/views/${pageName}.ejs`),
        path.join(dir, `app/views/${pageName}.json`),
      ]);
    });
  });
  describe('creating files using argument', () => {
    const pageName = 'argument';
    let dir;

    beforeAll(() => {
      return helpers
        .run(app)
        .inTmpDir((tmpDir) => {
          dir = tmpDir;
        })
        .withArguments([pageName]);
    });

    it('create template and data file', () => {
      assert.file([
        path.join(dir, `app/views/${pageName}.ejs`),
        path.join(dir, `app/views/${pageName}.json`),
      ]);
    });
  });
  describe('creating files using prompt', () => {
    const pageName = 'prompt';
    let dir;

    beforeAll(() => {
      return helpers
        .run(app)
        .inTmpDir((tmpDir) => {
          dir = tmpDir;
        })
        .withPrompts({ name: pageName });
    });

    it('create template and data file', () => {
      assert.file([
        path.join(dir, `app/views/${pageName}.ejs`),
        path.join(dir, `app/views/${pageName}.json`),
      ]);
    });
  });
});
