var path      = require('path'),
    dataPath  = path.normalize(__dirname + '/../../server/data'),
    books     = require(dataPath + '/books.json');

module.exports = function (app, config) {
  // books json
  // /api/books.json?cat=Suzuki
  app.get('/api/books.json', function(req,res){
    var cat = req.query.cat, ret = {};
    if(!cat){
      ret = books;
    }else{
      ret[cat] = books[cat];
    }
    res.send(ret);
  });
};

