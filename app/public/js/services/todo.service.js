angular.module('a-string')
.factory('Todos', ['StorageManager',
  function(StorageManager){
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

    service.getTodo = function(id){
      return StorageManager.storage().getTodo(id);
    };

    service.getTodos = function(date){
      return StorageManager.storage().fetchTodos(date);
    };

    service.createTodo = function(todo){
      return StorageManager.storage().createTodo(todo);
    };

    service.removeTodo = function(todo){
      return StorageManager.storage().deleteTodo(todo);
    };

    service.updateTodo = function(todo){
      return StorageManager.storage().updateTodo(todo);
    };

    return service;
  }
]);
