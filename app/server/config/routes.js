var path      = require('path'),
    dataPath  = path.normalize(__dirname + '/../../server/data'),
    books     = require(dataPath + '/books.json'),
    songs     = require(dataPath + '/songs.json'),
    _         = require('lodash'),
    processed;

module.exports = function (app, config) {
  // /api/books?cat=Suzuki
  app.get('/api/books', function(req,res){
    var cat = req.query.cat, ret = {};

    if(!cat){ ret = books; }
    else{ ret[cat] = books[cat]; }

    res.send(ret);
  });

  // /api/songs?title=twinkle&cat=suzuki&book=book1
  app.get('/api/songs', function(req, res){
    var title = req.query.title;
    if(!title){
      return res.status(400).send({
        errors: 'You have to provide a song title'
      });
    }else{
      if(!processed){
        processed = _processData(songs);
      }
      // TODO filter category, book if have it in the params
      var results = getSuggestions(title, processed);
      res.send(results);
    }
  });
};

function getSuggestions(query, data, cb) {
  var minLength = 1, limit = 5, terms, suggestions, results;

  // don't do anything until the minLength constraint is met
  if (query.length < minLength) {
    return;
  }

  // tokenize the query string
  terms = tokenizeQuery(query);
  suggestions = _getLocalSuggestions(terms, data).slice(0, limit);
  results = _.pluck(suggestions, 'datum');
  return results;
}

function _getLocalSuggestions(terms, data) {
  var firstChars = [],
      lists = [],
      shortestList,
      suggestions = [];

  // create a unique array of the first chars in
  // the terms this comes in handy when multiple
  // terms start with the same letter
  _.each(terms, function(term) {
    var firstChar = term.charAt(0);
    /* jshint -W030 */
    !~_.indexOf(firstChars, firstChar) && firstChars.push(firstChar);
    /* jshint +W030 */
  });

  _.each(firstChars, function(firstChar) {
    var list = data.adjacencyList[firstChar];

    // break out of the loop early
    if (!list) { return false; }

    lists.push(list);

    if (!shortestList || list.length < shortestList.length) {
      shortestList = list;
    }
  });

  // no suggestions :(
  if (lists.length < firstChars.length) {
    return [];
  }
  // populate suggestions
  _.each(shortestList, function(id) {
    var item = data.itemHash[id], isCandidate, isMatch;
    isCandidate = every(lists, function(list) {
      return ~_.indexOf(list, id);
    });
    isMatch = isCandidate && every(terms, function(term) {
      return some(item.tokens, function(token) {
        return token.indexOf(term) === 0;
      });
    });

    /* jshint -W030 */
    isMatch && suggestions.push(item);
    /* jshint +W030 */
  });
  return suggestions;
}

function _processData(songs) {
console.log(" =>  => processing songs");
  var itemHash = {}, adjacencyList = {};

  _.each(songs, function(song) {
    var title = song.title;
    var item = _transformDatum(title, song),
    id = _.uniqueId(item.value);

    itemHash[id] = item;

    _.each(item.tokens, function(token) {
      var character = token.charAt(0),
      adjacency = adjacencyList[character] ||
      (adjacencyList[character] = [id]);

      /* jshint -W030 */
      !~_.indexOf(adjacency, id) && adjacency.push(id);
      /* jshint +W030 */
    });
  });

  return { itemHash: itemHash, adjacencyList: adjacencyList };
}

// I'm putting the song obj in the datum
function _transformDatum(term, obj ) {
  var tokens = tokenizeText(term),
      item = { value: term, tokens: tokens };

  item.datum = obj;

  // filter out falsy tokens
  item.tokens = _.filter(item.tokens, function(token) {
    return !_.isEmpty(token);
  });

  // normalize tokens
  item.tokens = _.map(item.tokens, function(token) {
    return token.toLowerCase();
  });

  return item;
}


//
// helpers
//
function tokenizeQuery(str) {
  return str.toLowerCase().split(/[\s]+/);
}

function tokenizeText(str) {
  return str.toLowerCase().split(/[\s\-_]+/);
}

function every(obj, test) {
  var result = true;

  if (!obj) { return result; }

  _.each(obj, function(key, val) {
    // if (!(result = test.call(null, val, key, obj))) {
    if (!(result = test.call(null, key, val, obj))) {
      return false;
    }
  });

  return !!result;
}

function some(obj, test) {
  var result = false;

  if (!obj) { return result; }

  _.each(obj, function(key, val) {
    /* jshint -W084 */
    if (result = test.call(null, key, val, obj)) {
      return false;
    }
    /* jshint +W084 */
  });

  return !!result;
}
