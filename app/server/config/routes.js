var books_ctrl = require('../ctrls/books.ctrl');
var songs_ctrl = require('../ctrls/songs.ctrl');

module.exports = function (app, config) {
  // /api/books?cat=Suzuki
  app.get('/api/books', books_ctrl.index());

  // /api/songs?title=twinkle&cat=suzuki&book=book1
  app.get('/api/songs', songs_ctrl.index());
};

