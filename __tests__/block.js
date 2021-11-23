'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const app = path.join(__dirname, '../generators/block');

describe('generator-gulped:block', () => {
  describe('creating files', () => {
    const blockName = 'block';
    let dir;

    beforeAll(() => {
      return helpers.run(app).inTmpDir((tmpDir) => {
        dir = tmpDir;
      });
    });

    it('create block files', () => {
      assert.file([
        path.join(dir, `app/assets/blocks/${blockName}/index.scss`),
        path.join(dir, `app/assets/blocks/${blockName}/${blockName}.scss`),
        path.join(dir, `app/assets/blocks/${blockName}/variables-${blockName}.scss`),
      ]);
    });
  });
  describe('creating files using argument', () => {
    const blockName = 'argument';
    let dir;

    beforeAll(() => {
      return helpers
        .run(app)
        .inTmpDir((tmpDir) => {
          dir = tmpDir;
        })
        .withArguments([blockName]);
    });

    it('create block files', () => {
      assert.file([
        path.join(dir, `app/assets/blocks/${blockName}/index.scss`),
        path.join(dir, `app/assets/blocks/${blockName}/${blockName}.scss`),
        path.join(dir, `app/assets/blocks/${blockName}/variables-${blockName}.scss`),
      ]);
    });
  });
  describe('creating files using prompt', () => {
    const blockName = 'prompt';
    let dir;

    beforeAll(() => {
      return helpers
        .run(app)
        .inTmpDir((tmpDir) => {
          dir = tmpDir;
        })
        .withPrompts({ name: blockName });
    });

    it('create block files', () => {
      assert.file([
        path.join(dir, `app/assets/blocks/${blockName}/index.scss`),
        path.join(dir, `app/assets/blocks/${blockName}/${blockName}.scss`),
        path.join(dir, `app/assets/blocks/${blockName}/variables-${blockName}.scss`),
      ]);
    });
  });
});
