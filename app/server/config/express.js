var bodyParser = require('body-parser'),
    logger = require('morgan');

module.exports = function (app, express, config) {
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static(config.publicPath));
};
