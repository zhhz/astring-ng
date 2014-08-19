/**
 * The main app module
 */
angular.module('a-string', ['ngRoute', 'ui.bootstrap'])
.config(function ($routeProvider) {
  'use strict';

  $routeProvider.when('/', {
    controller: 'TodoCtrl',
    templateUrl: 'tpls/main.html',
    resolve: {
      songs: ['Songs', function(Songs){
        return Songs.getSongs();
      }]
    }
  }).otherwise({
    redirectTo: '/'
  });
});
