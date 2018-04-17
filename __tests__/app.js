'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const app = path.join(__dirname, '../generators/app');

describe('generator-gulped:app', () => {
  let storage;

  beforeAll(() => {
    return helpers.run(app).on('ready', gen => {
      storage = (() => {
        const config = gen._globalConfig;
        const source = config.get('authors');

        return {
          get: () => config.get('authors'),
          set: value => config.set('authors', value),
          clear: () => config.delete('authors'),
          restore: () => config.set('authors', source)
        };
      })();

      storage.clear();
    });
  });
  afterAll(() => storage.restore());

  describe('creating files', () => {
    beforeAll(() => helpers.run(app));

    it('create fonts dir', () => {
      assert.file(['app/fonts']);
    });
    it('create images dir', () => {
      assert.file(['app/images']);
    });
    it('create scripts dir', () => {
      assert.file(['app/scripts/app.js']);
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
  describe('using defaults with no authors', () => {
    let name;

    it('set default values', () => {
      return helpers
        .run(app)
        .inTmpDir(dir => {
          name = path.basename(dir);
        })
        .then(() => {
          assert.jsonFileContent('package.json', {
            name: name,
            version: '0.1.0',
            author: '',
            homepage: ''
          });
        });
    });
  });
  describe('using --yes flag with no authors', () => {
    let name;

    it('set default values', () => {
      return helpers
        .run(app)
        .inTmpDir(dir => {
          name = path.basename(dir);
        })
        .withOptions({ yes: true })
        .then(() => {
          assert.jsonFileContent('package.json', {
            name: name,
            version: '0.1.0',
            author: '',
            homepage: ''
          });
        });
    });
    it('set name from argument', () => {
      let name = 'project';

      return helpers
        .run(app)
        .withArguments([name])
        .withOptions({ yes: true })
        .then(() => {
          assert.jsonFileContent('package.json', {
            name: name,
            version: '0.1.0',
            author: '',
            homepage: ''
          });
        });
    });
  });
  describe('using last author', () => {
    let author = 'Foo Bar';

    beforeAll(() => storage.set({ choices: [author, 'Baz Qux'], last: author }));
    afterAll(() => storage.clear());
    it('set last author by default', () => {
      return helpers.run(app).then(() => {
        assert.jsonFileContent('package.json', { author });
      });
    });
    it('set last author with --yes flag', () => {
      return helpers
        .run(app)
        .withOptions({ yes: true })
        .then(() => {
          assert.jsonFileContent('package.json', { author });
        });
    });
  });
  describe('using name argument', () => {
    let argName = 'argument';
    let promptName = 'prompt';

    beforeAll(() => {
      return helpers
        .run(app)
        .withArguments([argName])
        .withPrompts({ name: promptName });
    });

    it('set name specified in argument', () => {
      assert.jsonFileContent('package.json', { name: argName });
    });
    it('ignore name specified in prompt', () => {
      assert.noJsonFileContent('package.json', { name: promptName });
    });
  });
  describe('using entered values', () => {
    let prompts = {
      name: 'project',
      version: '1.0.5',
      author: 'Author <email@gmail.com>',
      homepage: 'http://project.org'
    };

    it('set specified values', () => {
      return helpers
        .run(app)
        .withPrompts(prompts)
        .then(() => {
          assert.jsonFileContent('package.json', prompts);
        });
    });
  });
});
