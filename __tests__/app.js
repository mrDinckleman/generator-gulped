'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const generator = path.join(__dirname, '../generators/app');

describe('generator-gulped:app', () => {
  let prevGlobal;

  beforeAll(() => {
    return helpers.run(generator).on('ready', gen => {
      prevGlobal = gen._globalConfig.get('promptValues');
      gen._globalConfig.delete('promptValues');
    });
  });
  afterAll(() => {
    return helpers.run(generator).on('ready', gen => {
      gen._globalConfig.set('promptValues', prevGlobal);
    });
  });
  describe('creating files', () => {
    beforeAll(() => helpers.run(generator));
    it('create fonts dir', () => {
      assert.file(['app/fonts']);
    });
    it('create images dir', () => {
      assert.file(['app/images']);
    });
    it('create scripts dir', () => {
      assert.file(['app/scripts/app.js', 'app/scripts/imports.json']);
    });
    it('create static dir', () => {
      assert.file(['app/static']);
    });
    it('create styles dir', () => {
      assert.file(['app/styles/_variables.scss', 'app/styles/app.scss']);
    });
    it('create views dir', () => {
      assert.file([
        'app/views/partials/_foot.ejs',
        'app/views/partials/_footer.ejs',
        'app/views/partials/_head.ejs',
        'app/views/partials/_header.ejs',
        'app/views/global.json'
      ]);
    });
    it('create root files', () => {
      assert.file([
        '.browserslistrc',
        '.csscomb.json',
        '.editorconfig',
        '.gitattributes',
        '.gitignore',
        '.htmlcombrc',
        'gulpfile.js',
        'LICENSE.md',
        'package.json',
        'README.md'
      ]);
    });
  });
  describe('using defaults', () => {
    let name;

    beforeAll(() => {
      return helpers.run(generator).inTmpDir(dir => {
        name = path.basename(dir);
      });
    });
    it('set default values', () => {
      assert.jsonFileContent('package.json', {
        name: name,
        version: '0.1.0',
        author: '',
        homepage: ''
      });
    });
  });
  describe('using --yes flag', () => {
    let name;

    beforeAll(() => {
      return helpers
        .run(generator)
        .inTmpDir(dir => {
          name = path.basename(dir);
        })
        .withOptions({ yes: true });
    });
    it('set default values', () => {
      assert.jsonFileContent('package.json', {
        name: name,
        version: '0.1.0',
        author: '',
        homepage: ''
      });
    });
  });
  describe('using name argument', () => {
    let name = 'foo-bar';
    let prompt = 'bar-foo';

    beforeAll(() => {
      return helpers
        .run(generator)
        .withArguments([name])
        .withPrompts({ name: prompt });
    });
    it('set name specified in argument', () => {
      assert.jsonFileContent('package.json', { name: name });
    });
    it('ignore name specified in prompt', () => {
      assert.noJsonFileContent('package.json', { name: prompt });
    });
  });
  describe('using entered values', () => {
    let prompts = {
      name: 'project',
      version: '1.0.5',
      author: 'Author <email@gmail.com>',
      homepage: 'http://project.org'
    };

    beforeAll(() => helpers.run(generator).withPrompts(prompts));
    it('set specified values', () => {
      assert.jsonFileContent('package.json', prompts);
    });
  });
  describe('using global author value', () => {
    let author = 'Author <email@gmail.com>';

    beforeAll(() => {
      return helpers.run(generator).on('ready', gen => {
        gen._globalConfig.set('promptValues', { author });
      });
    });
    it('set global value by default', () => {
      assert.jsonFileContent('package.json', { author });
    });
    afterAll(() => {
      return helpers.run(generator).on('ready', gen => {
        gen._globalConfig.delete('promptValues');
      });
    });
  });
});
