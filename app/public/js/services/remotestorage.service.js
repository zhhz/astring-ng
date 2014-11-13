angular.module('a-string')
.factory('RemoteStorage', ['$http',
  function($http){
    var service = {};

    service.getTodo = function(id){
      return $http.get('/api/tasks/' + id);
    };

    service.fetchTodos = function(date){
      return $http.get('/api/tasks?date=' + date);
    };

    service.createTodo = function(todo){
      return $http.post('/api/tasks/', todo);
    };

    service.deleteTodo = function(todo){
      return $http.delete('/api/tasks/' + todo._id);
    };

    service.updateTodo = function(todo){
      return $http.put('/api/tasks/' + todo._id, todo);
    };

    return service;
  }
]);
