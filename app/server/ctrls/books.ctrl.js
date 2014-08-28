var path      = require('path'),
    dataPath  = path.normalize(__dirname + '/../../server/data'),
    books     = require(dataPath + '/books.json');

exports.index = function(){

  return function(req,res){
    var cat = req.query.cat, ret = {};

    if(!cat){ ret = books; }
    else{ ret[cat] = books[cat]; }

    res.send(ret);
  };
};

