angular.module('a-string')
.controller('LoginCtrl', ['$location', '$log', '$auth', 'States', 'AlertService',
  function($location, $log, $auth, States, AlertService) {
    var self = this;

    // signed up users login
    self.login = function() {
      $auth.login({ email: self.email, password: self.password })
        .then(function() {
          $log.info('You have successfully logged in');
          $location.path('/home');
        }).catch(function(response) {
          $log.error(response.data.message);
          AlertService.set(response.data.message);
        });
    };

    // OAuth users
    self.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function() {
          $log.info('You have successfully logged in');
          $location.path('/home');
        }).catch(function(response) {
          $log.error(response.data.message);
          AlertService.set(response.data.message);
        });
    };
  }
]);
