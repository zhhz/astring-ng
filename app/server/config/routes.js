var mongoose  = require('mongoose'),

    booksCtrl = require('../ctrls/books.ctrl'),
    songsCtrl = require('../ctrls/songs.ctrl'),
    authCtrl  = require('../ctrls/auth.ctrl'),
    auth      = require('../middlewares/auth');

// init the models
var User = mongoose.model('User');

module.exports = function (app, config) {
  // /api/books?cat=Suzuki
  app.get('/api/books', booksCtrl.index());

  // /api/songs?title=twinkle&cat=suzuki&book=book1
  app.get('/api/songs', songsCtrl.index());

  // auth related
  app.post('/auth/login', authCtrl.login(User));
  app.post('/auth/signup', authCtrl.signup(User));

  // app.post('/azsdf/asdf', auth.ensureAuthenticated, xxxCtrl.action());
};

