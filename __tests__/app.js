'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const app = path.join(__dirname, '../generators/app');

describe('generator-gulped:app', () => {
  describe('creating files', () => {
    let dir;

    beforeAll(() => {
      return helpers.run(app).inTmpDir((tmpDir) => {
        dir = tmpDir;
      });
    });

    it('create fonts dir', () => {
      assert.file([path.join(dir, 'app/fonts')]);
    });
    it('create images dir', () => {
      assert.file([path.join(dir, 'app/images')]);
    });
    it('create js dir', () => {
      assert.file([path.join(dir, 'app/js/app.js')]);
    });
    it('create scss dir', () => {
      assert.file([
        path.join(dir, 'app/scss/imports/_variables.scss'),
        path.join(dir, 'app/scss/app.scss'),
      ]);
    });
    it('create static dir', () => {
      assert.file([path.join(dir, 'app/static')]);
    });
    it('create views dir', () => {
      assert.file([
        path.join(dir, 'app/views/partials/_foot.ejs'),
        path.join(dir, 'app/views/partials/_footer.ejs'),
        path.join(dir, 'app/views/partials/_head.ejs'),
        path.join(dir, 'app/views/partials/_header.ejs'),
        path.join(dir, 'app/views/global.json'),
      ]);
    });
    it('create root files', () => {
      assert.file([
        path.join(dir, '.browserslistrc'),
        path.join(dir, '.editorconfig'),
        path.join(dir, '.eslintignore'),
        path.join(dir, '.eslintrc.js'),
        path.join(dir, '.gitattributes'),
        path.join(dir, '.gitignore'),
        path.join(dir, '.htmlcombrc'),
        path.join(dir, 'babel.config.js'),
        path.join(dir, 'gulpfile.babel.js'),
        path.join(dir, 'LICENSE.md'),
        path.join(dir, 'package.json'),
        path.join(dir, 'README.md'),
      ]);
    });
  });
  describe('using defaults with no authors', () => {
    it('set default values', () => {
      return helpers.run(app).then((dir) => {
        assert.jsonFileContent(path.join(dir, 'package.json'), {
          name: path.basename(dir),
          version: '0.1.0',
          author: '',
          homepage: '',
        });
      });
    });
  });
  describe('using --yes flag with no authors', () => {
    it('set default values', () => {
      return helpers
        .run(app)
        .withOptions({ yes: true })
        .then((dir) => {
          assert.jsonFileContent(path.join(dir, 'package.json'), {
            name: path.basename(dir),
            version: '0.1.0',
            author: '',
            homepage: '',
          });
        });
    });
    it('set name from argument', () => {
      let name = 'project';

      return helpers
        .run(app)
        .withArguments([name])
        .withOptions({ yes: true })
        .then((dir) => {
          assert.jsonFileContent(path.join(dir, 'package.json'), {
            name: name,
            version: '0.1.0',
            author: '',
            homepage: '',
          });
        });
    });
  });
  describe('using last author', () => {
    let author = 'Foo Bar';
    const mockAuthors = { choices: [author, 'Baz Qux'], last: author };

    it('set last author by default', () => {
      return helpers
        .run(app)
        .on('ready', (gen) => {
          gen._globalConfig.set('authors', mockAuthors);
        })
        .then((dir) => {
          assert.jsonFileContent(path.join(dir, 'package.json'), { author });
        });
    });
    it('set last author with --yes flag', () => {
      return helpers
        .run(app)
        .on('ready', (gen) => {
          gen._globalConfig.set('authors', mockAuthors);
        })
        .withOptions({ yes: true })
        .then((dir) => {
          assert.jsonFileContent(path.join(dir, 'package.json'), { author });
        });
    });
  });
  describe('using name argument', () => {
    let argName = 'argument';
    let promptName = 'prompt';
    let dir;

    beforeAll(() => {
      return helpers
        .run(app)
        .inTmpDir((tmpDir) => {
          dir = tmpDir;
        })
        .withArguments([argName])
        .withPrompts({ name: promptName });
    });

    it('set name specified in argument', () => {
      assert.jsonFileContent(path.join(dir, 'package.json'), { name: argName });
    });
    it('ignore name specified in prompt', () => {
      assert.noJsonFileContent(path.join(dir, 'package.json'), { name: promptName });
    });
  });
  describe('using entered values', () => {
    let answers = {
      name: 'project',
      version: '1.0.5',
      author: 'Author <email@gmail.com>',
      homepage: 'http://project.org',
    };
    let prompts = {
      ...answers,
      ...{
        author: 'Add new',
        authorNew: answers.author,
      },
    };

    it('set specified values', () => {
      return helpers
        .run(app)
        .withPrompts(prompts)
        .then((dir) => {
          assert.jsonFileContent(path.join(dir, 'package.json'), answers);
        });
    });
  });
});
