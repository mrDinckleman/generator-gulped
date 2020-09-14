'use strict';
const Generator = require('yeoman-generator');
const utils = require('../../lib/utils');
const path = require('path');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.description = 'Yeoman generator for Gulped template';

    this.argument('name', {
      desc: 'Project name',
      required: false,
      type: String,
    });

    this.option('yes', {
      desc: 'Use default parameters',
      alias: 'y',
      type: Boolean,
    });
  }

  prompting() {
    // Hacky method https://github.com/yeoman/generator/issues/917
    let authors = this._globalConfig.get('authors') || {
      choices: [],
      last: '',
    };
    const defaults = {
      name: this.appname,
      version: '0.1.0',
    };
    const ADD_AUTHOR = 'Add new';

    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Project name',
        default: defaults.name,
        when: !this.options.name && !this.options.yes,
      },
      {
        type: 'input',
        name: 'version',
        message: 'Version',
        default: defaults.version,
        when: !this.options.yes,
      },
      {
        type: 'list',
        name: 'author',
        message: 'Author',
        choices: authors.choices.concat({ type: 'separator' }, ADD_AUTHOR),
        default: authors.last,
        when: () => {
          if (!authors.choices.length) {
            return false;
          }

          return !this.options.yes;
        },
      },
      {
        type: 'input',
        name: 'authorNew',
        message: (answers) => utils.newAuthorMessage(answers.author === ADD_AUTHOR),
        default: authors.last ? authors.last : undefined,
        validate: utils.required,
        when: (answers) => {
          if (authors.last) {
            if (this.options.yes) {
              return false;
            }

            return answers.author === ADD_AUTHOR;
          }

          return true;
        },
      },
      {
        type: 'input',
        name: 'homepage',
        message: 'Homepage',
        when: !this.options.yes,
      },
    ];

    return this.prompt(prompts).then((props) => {
      let author = props.authorNew || props.author;

      if (author) {
        if (authors.choices.indexOf(author) === -1) {
          authors.choices.push(author);
        }

        authors.last = author;
        this._globalConfig.set('authors', authors);
      }

      this.props = {
        name: props.name || this.options.name || defaults.name,
        version: props.version || defaults.version,
        author: author || authors.last || '',
        homepage: props.homepage || '',
      };
    });
  }

  writing() {
    this.sourceRoot(path.join(path.dirname(this.resolved), '../../node_modules/gulped/'));

    this.fs.copy(
      this.templatePath('**/!(.npmignore|package.json)'),
      this.destinationPath('./'),
      {
        globOptions: { dot: true },
      }
    );
    // NPM renames '.gitignore' file to '.npmignore' during installation,
    // so we need to rename it back
    this.fs.copy(this.templatePath('.npmignore'), this.destinationPath('.gitignore'));

    // Save project information entered by user
    let templateJson = this.fs.readJSON(this.templatePath('package.json'));
    let packageJson = {
      name: this.props.name,
      version: this.props.version,
      description: templateJson.description,
      scripts: templateJson.scripts,
      homepage: this.props.homepage,
      author: this.props.authorNew || this.props.author,
      devDependencies: templateJson.devDependencies,
      dependencies: templateJson.dependencies,
      private: true,
    };
    this.fs.writeJSON(this.destinationPath('package.json'), packageJson);
  }

  install() {
    this.npmInstall();
  }
};
