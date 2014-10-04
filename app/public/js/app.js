/**
 * The main app module
 */
angular.module('a-string', ['ngRoute', 'ngTouch', 'ui.bootstrap'])
.config(function ($routeProvider) {
  'use strict';

  $routeProvider.when('/', {
    controller: 'TodoCtrl',
    templateUrl: 'tpls/main.html',
    resolve: {
      todos: ['Todos', function(Todos){
        return Todos.getTodos(moment().format('L'));
      }],
      songs: ['Songs', function(Songs){
        return Songs.getBooks();
      }]
    }
  }).otherwise({
    redirectTo: '/'
  });
});
