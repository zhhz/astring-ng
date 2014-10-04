angular.module('a-string')
.factory('Todos', ['$q', 'TodoStorage',
  function($q, TodoStorage){
    var _todos = {}, service = {};

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
      var deferred = $q.defer();
      date = date || moment().format('L');
      var todos = _todos[date];
      if(!todos){
       TodoStorage.fetchTodos(date)
         .then(function(resolved){
           // put in local cache
           _todos[date] = resolved;
           deferred.resolve(resolved);
         }, function(reason){
           deferred.reject(reason);
         });
      }else{
        deferred.resolve(todos);
      }
      return deferred.promise;
    };

    service.createTodo = function(todo){
      var deferred = $q.defer();
      TodoStorage.createTodo(todo)
        .then(function(resolved){
          var date = resolved.startDate;
          var todos = _todos[date] || [];
          todos.push(resolved);
          _todos[date] = todos;
          deferred.resolve(resolved);
        }, function(reason){
          deferred.reject(reason);
        });
      return deferred.promise;
    };

    service.removeTodo = function(todo){
      var deferred = $q.defer();
      var date = todo.startDate;
      TodoStorage.deleteTodo(todo)
        .then(function(resolved){
          var todos = _todos[date] || [];
          _.remove(todos, function(t){return t.id === todo.id;});
          deferred.resolve(resolved);
        }, function(reason){
          deferred.reject(reason);
        });
      return deferred.promise;
    };

    service.updateTodo = function(todo){
      var deferred = $q.defer();
      var date = todo.startDate;
      TodoStorage.updateTodo(todo)
        .then(function(resolved){
          var todos = _todos[date] || [];
          _.remove(todos, function(t){return t.id === todo.id;});
          todos.push(resolved);
          _todos[date] = todos;
          deferred.resolve(resolved);
        }, function(reason){
          deferred.reject(reason);
        });
      return deferred.promise;
    };

    return service;
  }
]);
