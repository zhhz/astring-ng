angular.module('a-string')
.factory('RemoteStorage', ['$http',
  function($http){
    var service = {};

    //========== TODOS TABLE =======================================
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

    //========== EVENTS TABLE =====================================
    service.createEvent = function(event){
      return $http.post('/api/events/', event);
    };

    service.updateEvent = function(event){
      return $http.put('/api/events/' + event._id, event);
    };

    return service;
  }
]);
