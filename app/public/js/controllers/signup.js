angular.module('a-string')
  .controller('SignupCtrl', ['$scope', '$auth', '$log', function($scope, $auth, $log) {
    $scope.signup = function() {
      $auth.signup({
        displayName: $scope.displayName,
        email: $scope.email,
        password: $scope.password
      }).catch(function(response) {
        $log.error(response.data.message);
      });
    };
  }]);
