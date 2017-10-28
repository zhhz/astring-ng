/**
 * The main app module
 */
angular.module('a-string', ['ngRoute',
                            'ngTouch',
                            'ngMessages',
                            'ngAnimate',
                            'ui.bootstrap',
                            'ui.calendar',
                            'satellizer',
                            'angular-loading-bar'])
//=======================================
//  routes
//=======================================
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
  .when('/home', {
    templateUrl: 'tpls/home.html',
    controller: 'HomeCtrl',
    controllerAs: 'homeCtrl'
  })
  .when('/calendar', {
    templateUrl: 'tpls/calendar.html',
    controller: 'CalendarCtrl',
    controllerAs: 'calendarCtrl'
  })
  .when('/tools', {
    templateUrl: 'tpls/tools.html',
    controller: 'ToolsCtrl',
    controllerAs: 'toolsCtrl'
  })
  .when('/todos', {
    templateUrl: 'tpls/main.html'
  })

  .otherwise({
    redirectTo: '/'
  });
})
//=======================================
//  auth
//=======================================
.config(function ($authProvider) {
  $authProvider.google({
    // production
    clientId: YOUR_CLIENT_ID
  });

  $authProvider.facebook({
    clientId: YOUR_CLIENT_ID
  });

  $authProvider.twitter({
    url: '/auth/twitter'
  });

  $authProvider.yahoo({
    clientId: YOUR_CLIENT_ID
  });

  $authProvider.linkedin({
    clientId: YOUR_CLIENT_ID
  });

  $authProvider.github({
    clientId: YOUR_CLIENT_ID
  });

})
//=======================================
//  loading-bar
//=======================================
.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider){
  cfpLoadingBarProvider.includeSpinner = false;
}]);

