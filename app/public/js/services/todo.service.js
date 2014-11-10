angular.module('a-string')
.factory('Todos', ['$q', 'LocalStorage',
  function($q, LocalStorage){
    var service = {};

    service.newTodo = function(){
      return {
        id: null,
        title: '',
        createdAt: (new Date()).getTime(),
        duration: 0,
        completedAt: null,
        completed: false
      };
    };

    service.get = function(id){
      return LocalStorage.get(id);
    };

    service.getTodos = function(date){
      return LocalStorage.fetchTodos(date);
    };

    service.createTodo = function(todo){
      return LocalStorage.createTodo(todo);
    };

    service.removeTodo = function(todo){
      return LocalStorage.deleteTodo(todo);
    };

    service.updateTodo = function(todo){
      return LocalStorage.updateTodo(todo);
    };

    return service;
  }
]);
