
# Express backend server
## Install Express' application generator.
https://github.com/expressjs/generator

$ sudo npm install -g express-generator

## Generate expressjs project
$ express backend && cd backend

## Install dependencies:

$ npm install

## Start express server

$ npm start


# Angularjs frontend

## Install generator-angular:
https://github.com/yeoman/generator-angular

$ sudo npm install -g generator-angular

## Make a new directory, and cd into it:

$ mkdir my-new-project && cd $_

## Run yo angular, optionally passing an app name:

$ yo angular [app-name]

## Run grunt for building and grunt serve for preview

$ grunt

$ grunt serve

## Install angular-ui-router

bower install angular-ui-router --save

index.html:
 <div ui-view></div>

## grunt serve errors:
$ sudo npm install imagemin-gifsicle --save-dev

$ npm install imagemin-jpegtran --save-dev

$ npm install imagemin-optipng --save-dev

$ npm install imagemin-pngquant


## Failed to instantiate module ui.router due to:
http://stackoverflow.com/questions/23466575/yeoman-grunt-error-injectormodulerr-failed-to-instantiate-module-ui-router

angular-chat/test/karma.conf.js:

 files: [
  'bower_components/angular-ui-router/release/angular-ui-router.js',
  ...
  ],

## Install grunt-express
$ npm install grunt-express --save-dev