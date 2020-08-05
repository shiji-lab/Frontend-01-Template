var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // Next, add your custom code
    this.option('babel'); // This method adds support for a `--babel` flag
  }
  /*
  method1() {
    this.log('method 1 just ran');
  }

  method2() {
    this.log('method 2 just ran');
  }

  async prompting() {
    const answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname // Default to current folder name
      },
      {
        type: "confirm",
        name: "cool",
        message: "Would you like to enable the Cool feature?"
      }
    ]);

    this.log("app name", answers.name);
    this.log("cool feature", answers.cool);
  }
  */

  /*
  installingLodash() {
  this.npmInstall(['lodash'], { 'save-dev': true });
  }
  */
  /*
  async prompting() {
    this.dependencies = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Would you like to enable the Cool feature?"
      }
    ]);
  }
  writing() {
    const pkgJson = {
      dependencies: {
        [this.dependencies.name]: '*'
      }
    };

    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
  }

  install() {
    this.npmInstall();
  }
  */
  writing() {
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('public/index.html'),
      { title: 'Templating with Yeoman' }
    );
  }
};
