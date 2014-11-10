/**
 * Services that persists and retrieves TODOs from localStorage
 */
angular.module('a-string')
.factory('LocalStorage', ['$http', '$q', 'md5', 'AlertService',
  function ($http, $q, md5, AlertService) {

    var STORAGE_ID = 'a-string-store';
    var store = null;

    try {
      var testKey = '__a-string-store__';
      localStorage.setItem(testKey, testKey);
      if(localStorage.getItem(testKey) !== testKey){store = [];}
      localStorage.removeItem(testKey);
    } catch(e){
      AlertService.set('Your browser doesn\'t support local storage');
      store = [];
    }

    function get() {
      if(!store){
        return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
      }else{
        return store;
      }
    }

    function put(todos) {
      if(!store){
        localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
      }else{
        store = todos;
      }
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
