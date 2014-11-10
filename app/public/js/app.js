/**
 * The main app module
 */
angular.module('a-string', ['ngRoute', 'ngTouch', 'ui.bootstrap', 'satellizer'])
.config(function ($routeProvider, $authProvider) {
  'use strict';

  // console.warn = console.trace.bind(console);

  $routeProvider
  .when('/', {
    controller: 'TodoCtrl',
    controllerAs: 'todoCtrl',
    templateUrl: 'tpls/main.html',
    resolve: {
      todos: ['Todos', function(Todos){
        return Todos.getTodos(moment().format('L'));
      }],
      songs: ['Songs', function(Songs){
        return Songs.getBooks();
      }]
    }
  })
  .when('/signup', {
    templateUrl: 'tpls/signup.html',
    controller: 'SignupCtrl'
  })
  .when('/login', {
    templateUrl: 'tpls/login.html',
    controllerAs: 'loginCtrl',
    controller: 'LoginCtrl'
  })
  .when('/logout', {
    template: ' ',
    controller: 'LogoutCtrl'
  })
  .when('profile', {
    templateUrl: 'tpls/profile.html',
    controller: 'ProfileCtrl',
    resolve: {
      authenticated: ['$location', '$auth', function($location, $auth) {
        if (!$auth.isAuthenticated()) {
          return $location.path('/login');
        }
      }]
    }
  })
  .otherwise({
    redirectTo: '/'
  });

  $authProvider.facebook({
    clientId: '657854390977827'
  });

  $authProvider.google({
    clientId: '631036554609-v5hm2amv4pvico3asfi97f54sc51ji4o.apps.googleusercontent.com'
  });

  $authProvider.github({
    clientId: '0ba2600b1dbdb756688b'
  });

  $authProvider.linkedin({
    clientId: '77cw786yignpzj'
  });

  $authProvider.yahoo({
    clientId: 'dj0yJmk9dkNGM0RTOHpOM0ZsJmQ9WVdrOVlVTm9hVk0wTkRRbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD0wMA--',
  });

  $authProvider.twitter({
    url: '/auth/twitter'
  });

  $authProvider.oauth2({
    name: 'foursquare',
    url: '/auth/foursquare',
    clientId: 'MTCEJ3NGW2PNNB31WOSBFDSAD4MTHYVAZ1UKIULXZ2CVFC2K',
    redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
    authorizationEndpoint: 'https://foursquare.com/oauth2/authenticate'
  });
});
