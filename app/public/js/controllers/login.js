angular.module('a-string')
.controller('LoginCtrl', ['$location', '$log', '$auth', 'States', 'AlertService',
  function($location, $log, $auth, States, AlertService) {
    var self = this;

    // signed up users login
    self.login = function() {
      $auth.login({ email: self.email, password: self.password })
        .then(function() {
          States.displayName = resolved.data.displayName;
          $location.path('/home');
        }).catch(function(response) {
          $log.error(response.data.message);
          AlertService.set(response.data.message);
        });
    };

    // OAuth users
    self.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function(resolved) {
          States.displayName = resolved.data.displayName;
          $location.path('/home');
        }).catch(function(response) {
          $log.error(response.data.message);
          AlertService.set(response.data.message);
        });
    };
  }
]);
