/**
 * The main app module
 */
angular.module('a-string', ['ngRoute', 'ngTouch', 'ngMessages', 'ngAnimate', 'ui.bootstrap', 'satellizer'])
.config(function ($routeProvider, $authProvider) {
  'use strict';

  // console.warn = console.trace.bind(console);

  $routeProvider
  .when('/', {
    templateUrl: 'tpls/main.html'
  })
  .when('/signup', {
    templateUrl: 'tpls/signup.html',
    controller: 'SignupCtrl',
    controllerAs: 'signupCtrl'
  })
  .when('/login', {
    templateUrl: 'tpls/login.html',
    controller: 'LoginCtrl',
    controllerAs: 'loginCtrl'
  })
  .when('/logout', {
    template: ' ',
    controller: 'LogoutCtrl'
  })
  .when('/profile', {
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

  $authProvider.google({
    clientId: '750530476209-3cu1c6a8o2or8su24khll06odcd3eph3.apps.googleusercontent.com'
  });

  $authProvider.facebook({
    clientId: '1551037841780082'
  });

  $authProvider.twitter({
    url: '/auth/twitter'
  });

  $authProvider.yahoo({
    clientId: 'dj0yJmk9dkNGM0RTOHpOM0ZsJmQ9WVdrOVlVTm9hVk0wTkRRbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD0wMA--'
  });

  $authProvider.linkedin({
    clientId: '77cw786yignpzj'
  });

  $authProvider.github({
    clientId: '0ba2600b1dbdb756688b'
  });

});
