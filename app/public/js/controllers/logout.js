angular.module('a-string')
  .controller('LogoutCtrl', function($auth, $log, States) {
    if (!$auth.isAuthenticated()) { return; }
    $auth.logout().then(function() {
      $log.info('You have been logged out');
      States.reset();
    });
  });
