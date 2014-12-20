var bodyParser = require('body-parser'),
    logger = require('morgan');

module.exports = function (app, express, config) {

  // Force HTTPS on Heroku
  // if (app.get('env') === 'production') {
    // app.use(function(req, res, next) {
     // var protocol = req.get('x-forwarded-proto');
      // protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
    // });
  // }

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static(config.publicPath));
};
