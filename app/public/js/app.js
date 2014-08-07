/**
 * The main app module
 */
angular.module('a-string', ['ngRoute'])
.config(function ($routeProvider) {
  'use strict';

  $routeProvider.when('/', {
    controller: 'TodoCtrl',
    templateUrl: 'tpls/main.html'
  }).when('/:status', {
    controller: 'TodoCtrl',
    templateUrl: 'tpls/main.html'
  }).otherwise({
    redirectTo: '/'
  });
});
