var mongoose  = require('mongoose'),

    auth      = require('../middlewares/auth'),
    authCtrl  = require('../ctrls/auth.ctrl'),
    booksCtrl = require('../ctrls/books.ctrl'),
    songsCtrl = require('../ctrls/songs.ctrl'),
    tasksCtrl = require('../ctrls/tasks.ctrl');

// init the models
var User = mongoose.model('User'),
    Task = mongoose.model('Task');

module.exports = function (app, config) {
  // /api/books?cat=Suzuki
  app.get('/api/books', booksCtrl.index());
  // /api/songs?title=twinkle&cat=suzuki&book=book1
  app.get('/api/songs', songsCtrl.index());

  // auth related
  app.post('/auth/login', authCtrl.login(User));
  app.post('/auth/signup', authCtrl.signup(User));
  app.post('/auth/google', authCtrl.google(User));
  app.post('/auth/facebook', authCtrl.facebook(User));

  // tasks routes
  app.get('/api/tasks', auth.ensureAuthenticated, tasksCtrl.index(Task));
  app.get('/api/tasks/:year/:month/:day', auth.ensureAuthenticated, tasksCtrl.index(Task));
  app.post('/api/tasks', auth.ensureAuthenticated, tasksCtrl.create(Task));
  app.put('/api/tasks/:id', auth.ensureAuthenticated, tasksCtrl.update(Task));
  app.delete('/api/tasks/:id', auth.ensureAuthenticated, tasksCtrl.destroy(Task));
  app.get('/api/tasks/aggregate', auth.ensureAuthenticated, tasksCtrl.aggregate(Task));
  app.get('/api/tasks/aggregate_all', auth.ensureAuthenticated, tasksCtrl.aggregateAll(Task));

};

