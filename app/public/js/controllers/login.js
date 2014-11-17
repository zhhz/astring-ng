angular.module('a-string')
.controller('LoginCtrl', ['$log', '$auth', 'States', 'AlertService',
  function($log, $auth, States, AlertService) {
    var self = this;

    // signed up users login
    self.login = function() {
      $auth.login({ email: self.email, password: self.password })
        .then(function() {
          $log.info('You have successfully logged in');
          States.init();
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
        }).catch(function(response) {
          $log.error(response.data.message);
          AlertService.set(response.data.message);
        });
    };
  }
]);
