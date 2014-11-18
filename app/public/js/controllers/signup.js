angular.module('a-string')
.controller('SignupCtrl', ['$auth', '$log',
  function($auth, $log) {
    this.signup = function() {
      $auth.signup({
        displayName: this.displayName,
        email: this.email,
        password: this.password
      }).catch(function(response) {
        $log.error(response.data.message);
      });
    };
  }
]);
