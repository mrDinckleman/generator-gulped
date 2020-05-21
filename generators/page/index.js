'use strict';
const Generator = require('yeoman-generator');
const utils = require('../../lib/utils');
const path = require('path');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.description = 'Yeoman generator for Gulped page';

    this.argument('name', {
      desc: 'Page name',
      required: false,
      type: String,
    });
  }

  prompting() {
    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Page name',
        validate: utils.required,
        when: !this.options.name,
      },
    ];

    return this.prompt(prompts).then((props) => {
      this.props = {
        name: props.name || this.options.name || 'page',
      };
    });
  }

  writing() {
    this.sourceRoot(path.join(path.dirname(this.resolved), '../../node_modules/gulped/'));

    const dir = 'app/views/';
    const files = ['index.ejs', 'index.json'];
    files.forEach((file) => {
      this.fs.copy(
        this.templatePath(dir + file),
        this.destinationPath(dir + this.props.name + file.substr(file.lastIndexOf('.')))
      );
    });
  }
};
