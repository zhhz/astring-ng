/**
 * Services that persists and retrieves TODOs from localStorage
 */
angular.module('a-string')
.factory('TodoStorage', ['$http', '$q', 'md5',
  function ($http, $q, md5) {

    var STORAGE_ID = 'a-string-todos';

    function get() {
      return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
    }

    function put(todos) {
      localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
    }

    return {

      get: function(id){
        var deferred = $q.defer();
        var todo = _.find(get(), function(todo){return todo.id === id;});
        deferred.resolve(todo);
        return deferred.promise;
      },

      fetchTodos: function(date){
        var deferred = $q.defer();
        var todos =  _.filter(get(), function(todo){ return todo.startDate === date; });
        deferred.resolve(todos);
        return deferred.promise;
      },

      createTodo: function(todo){
        todo.id = md5.createHash((new Date()).getTime() + '');
        var deferred = $q.defer();
        var todos = get();
        todos.push(todo);
        put(todos);
        deferred.resolve(todo);
        return deferred.promise;
      },

      deleteTodo: function(todo){
        var deferred = $q.defer();
        var todos = get();
        _.remove(todos, function(t){return t.id === todo.id;});
        put(todos);
        deferred.resolve([]);
        return deferred.promise;
      },

      updateTodo: function(todo){
        var deferred = $q.defer();
        var todos = get();
        _.remove(todos, function(t){return t.id === todo.id;});
        todos.push(todo);
        put(todos);
        deferred.resolve(todo);
        return deferred.promise;
      }

    };
  }
]);
