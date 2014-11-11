angular.module('a-string')
.factory('RemoteStorage', ['$http',
  function($http){
    var service = {};

    service.getTodo = function(id){
      return $http.get('/api/todos/' + id);
    };

    service.fetchTodos = function(date){
      return $http.get('/api/todos?date=' + date);
    };

    service.createTodo = function(todo){
      return $http.post('/api/todos/', todo);
    };

    service.deleteTodo = function(todo){
      return $http.delete('/api/todos/' + todo.id);
    };

    service.updateTodo = function(todo){
      return $http.put('/api/todos/' + todo.id, todo);
    };

    return service;
  }
]);
