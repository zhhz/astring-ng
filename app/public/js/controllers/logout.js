angular.module('a-string')
  .controller('LogoutCtrl', function($auth, $log) {
    if (!$auth.isAuthenticated()) { return; }
    $auth.logout().then(function() {
      $log.info('You have been logged out');
    });
  });
