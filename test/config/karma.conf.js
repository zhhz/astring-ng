// Karma configuration
// Generated on Wed Aug 06 2014 20:34:53 GMT-0400 (EDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../../',

    // frameworks to use
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-messages/angular-messages.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/jquery/dist/jquery.js',
      'bower_components/dial/js/jquery.dial.js',
      'bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.js',
      'bower_components/angular-touch/angular-touch.js',
      'bower_components/lodash/dist/lodash.js',
      'bower_components/moment/moment.js',
      'bower_components/satellizer/satellizer.js',
      'bower_components/fullcalendar/fullcalendar.js',
      'bower_components/angular-ui-calendar/src/calendar.js',
      'app/public/js/**/*.js',
      'test/unit/**/*.js'
    ],

    // list of files to exclude
    exclude: [
      '**/*.min.js'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
