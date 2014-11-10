var fs      = require('fs'),
    express = require('express'),
    app     = express(),
    env     = process.env.NODE_ENV || 'development',
    config  = require('./config/settings')[env],
    mongoose = require('mongoose');

/**
 * NOTE: The order of loading matters
 */

mongoose.connect(config.db); // bootstrap mongodb

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log("[DB] connected to %s", mongoose.connection.name);

  // 1. load models
  var models_path = __dirname + '/models';
  fs.readdirSync(models_path).forEach(function (file) {
    if (~file.indexOf('.js')) require(models_path + '/' + file);
  });

  // 2. express
  require(config.serverPath + '/config/express')(app, express, config);

  // 3.routes
  require(config.serverPath + '/config/routes')(app, config);

  // 4. start server and listening on port
  var port = parseInt(process.env.PORT, 10) || config.port;
  var server = require('http').createServer(app);

  server.listen(port, function () {
    console.log('Express server listening on port [%d], environment: [%s]', port, app.settings.env);
    console.log('  -> Using V8       %s', process.versions.v8);
    console.log('  -> Using Node     %s', process.versions.node);
    console.log('  -> Using Mongoose %s', mongoose.version);
    console.log('\n');
    // console.log(app._router.stack);
  });

});
