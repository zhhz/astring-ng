var path      = require('path'),
    dataPath  = path.normalize(__dirname + '/../../server/data'),
    songsJSON = require(dataPath + '/books.json');

module.exports = function (app, config) {
  // books json
  app.get('/api/books.json', function(req,res){res.send(songsJSON);});
};

