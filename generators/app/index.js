'use strict';
const Generator = require('yeoman-generator');
const utils = require('../../lib/utils');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.description = 'Yeoman generator for Gulped template';

    this.argument('name', {
      desc: 'Project name',
      required: false,
      type: String
    });

    this.option('yes', {
      desc: 'Use default parameters',
      alias: 'y',
      type: Boolean
    });
  }

  prompting() {
    // Hacky method https://github.com/yeoman/generator/issues/917
    let globalPrompt = this._globalConfig.get('promptValues') || {};
    const defaults = {
      name: this.appname,
      version: '0.1.0'
    };

    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Project name',
        default: defaults.name,
        when: !this.options.name && !this.options.yes
      },
      {
        type: 'input',
        name: 'version',
        message: 'Version',
        default: defaults.version,
        when: !this.options.yes
      },
      {
        type: 'input',
        name: 'author',
        message: 'Author',
        validate: utils.required,
        store: true,
        when: !(this.options.yes && globalPrompt.author)
      },
      {
        type: 'input',
        name: 'homepage',
        message: 'Homepage',
        when: !this.options.yes
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = {
        name: props.name || this.options.name || defaults.name,
        version: props.version || defaults.version,
        author: props.author || globalPrompt.author,
        homepage: props.homepage || ''
      };
    });
  }

  writing() {
    this.fs.copy(
      this.templatePath('dummyfile.txt'),
      this.destinationPath('dummyfile.txt')
    );
  }

  install() {
    this.installDependencies();
  }
};
