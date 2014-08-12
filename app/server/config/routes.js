var songsJSON = require('../data/books.json');

module.exports = function (app, config) {
  // books json
  app.get('/api/books.json', function(req,res){res.send(songsJSON);});
};

