angular.module('a-string')
.factory('Songs', ['$http', '$q',
  function($http, $q){

    var service = {
      getBooks: function (){
        var deferred = $q.defer();
        $http.get('/api/books')
          .success(function(data, status, headers, config){
            var songs = [];
            angular.forEach(data, function(books, category){
              angular.forEach(books, function(book, name){
                angular.forEach(book, function(song){
                  var s = {};
                  s.category = category;
                  s.book = name;
                  s.title = song;
                  songs.push(s);
                });
              });
            });
            deferred.resolve(songs);
          })
          .error(function(data, status, headers, config){
            deferred.reject('Unable to fetch the books.');
          });

        return deferred.promise;
      },

      getSongs: function (todo){
        var url = '/api/songs?title=' + todo.title;
        if(todo.song){
          url += '&cat=' + todo.song.category;
          url += '&book=' + todo.song.book;
        }
        // $http.get(url).then(function(res){
          // return res.data;
        // }, function(errRes){
          // console.error('Error when fetching the songs.');
        // });
        var deferred = $q.defer();
        $http.get(url)
          .success(function(data, status, headers, config){
            deferred.resolve(data);
          })
          .error(function(data, status, headers, config){
            deferred.reject('Unable to fetch the songs.');
          });

        return deferred.promise;
      }
    };

    return service;
  }
]);
