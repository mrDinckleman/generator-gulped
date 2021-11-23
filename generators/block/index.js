'use strict';
const Generator = require('yeoman-generator');
const utils = require('../../lib/utils');
const path = require('path');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.description = 'Yeoman generator for Gulped block';

    this.argument('name', {
      desc: 'Block name',
      required: false,
      type: String,
    });
  }

  prompting() {
    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Block name',
        validate: utils.required,
        when: !this.options.name,
      },
    ];

    return this.prompt(prompts).then((props) => {
      this.props = {
        name: props.name || this.options.name || 'block',
      };
    });
  }

  writing() {
    this.sourceRoot(path.join(path.dirname(this.resolved), '../../node_modules/gulped/'));

    const dir = 'app/assets/blocks/page/';
    const files = ['index.scss', 'page.scss', 'variables-page.scss'];
    files.forEach((file) => {
      const path = dir + file;
      this.fs.copy(
        this.templatePath(path),
        this.destinationPath(path.replace(/page/g, this.props.name)),
        {
          process: (content) => content.toString().replace(/page/g, this.props.name),
        }
      );
    });
  }
};
