angular.module('a-string')
.factory('Todos', ['StorageManager',
  function(StorageManager){
    var service = {};

    service.newTodo = function(){
      return {
        // _id: null,
        title: '',
        startDate: null,
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

    service.mrByDay = function(from, to){
      return StorageManager.storage().todosMrByDay(from, to);
    };

    service.mrAll = function(from, to){
      return StorageManager.storage().todosMrAll();
    };

    service.timeSpent = function(song){
      return StorageManager.storage().todoTimeSpent(song);
    };

    service.timeline = function(){
      return StorageManager.storage().todoTimeline();
    };

    return service;
  }
]);
