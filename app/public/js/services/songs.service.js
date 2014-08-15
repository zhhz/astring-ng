angular.module('a-string')
.factory('Songs', ['$http', '$q',
  function($http, $q){

    var service = {
      getSongs: function (){
        var deferred = $q.defer();
        $http.get('http://localhost:3000/api/books')
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
      }
    };

    return service;
  }
]);
