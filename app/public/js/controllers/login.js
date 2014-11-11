angular.module('a-string')
  .controller('LoginCtrl', function($scope, $log, $auth) {
    var self = this;
    self.login = function() {
      $auth.login({ email: $scope.email, password: $scope.password })
        .then(function() {
          $log.info('You have successfully logged in');
        }).catch(function(response) {
          $log.error(response.data.message);
        });
    };
    self.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function() {
          $log.info('You have successfully logged in');
        }).catch(function(response) {
          $log.error(response.data.message);
        });
    };
  });
