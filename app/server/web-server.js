var express = require("express"),
    app     = express(),
    env     = process.env.NODE_ENV || 'development',
    config  = require('./config/settings')[env];

// express
require(config.serverPath + '/config/express')(app, express, config);
// routes
require(config.serverPath + '/config/routes')(app, config);
// port
var port = parseInt(process.env.PORT, 10) || config.port;
app.listen(port);
console.log('Now serving the app at http://localhost:' + port + '/');
