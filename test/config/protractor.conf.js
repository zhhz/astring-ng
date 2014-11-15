exports.config = {
  // The address of a running selenium server.
  seleniumAddress: 'http://localhost:4444/wd/hub',

  // The address where our server under test is running
  baseUrl: 'http://localhost:3030/',

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
  },

  /*
    multiCapabilities: [{
      'browserName': 'firefox'
    }, {
      'browserName': 'chrome'
    }]
  */


  // Spec patterns are relative to the location of the spec file.
  // They may include glob patterns.
  // protractor protractor.conf.js --suite working
  suites: {
    home    : '../e2e/home/**/*.spec.js',
    working : '../e2e/working/**/*.spec.js'
  },

  onPrepare: function() {
    // Set window size before starting the tests
    browser.driver.manage().window().setSize(800, 700);

    var fs      = require('fs'),
        env     = 'test',
        config  = require('../../app/server/config/settings')[env],
        mongoose = require('mongoose');

    mongoose.connect(config.db); // bootstrap mongodb
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
      console.log("[DB] connected to %s", mongoose.connection.name);
      var models_path = __dirname + '/../../app/server/models';
      fs.readdirSync(models_path).forEach(function (file) {
        if (~file.indexOf('.js')) require(models_path + '/' + file);
      });
    });
  },

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true // Use colors in the command line report.
    // defaultTimeoutInterval: 30000,
    // isVerbose: true,
    // includeStackTrace: true
  }
};

