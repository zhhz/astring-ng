angular.module('a-string')
.factory('Todos', ['$q', 'TodoStorage',
  function($q, TodoStorage){
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
      return TodoStorage.get(id);
    };

    service.getTodos = function(date){
      return TodoStorage.fetchTodos(date);
    };

    service.createTodo = function(todo){
      return TodoStorage.createTodo(todo);
    };

    service.removeTodo = function(todo){
      return TodoStorage.deleteTodo(todo);
    };

    service.updateTodo = function(todo){
      return TodoStorage.updateTodo(todo);
    };

    return service;
  }
]);
