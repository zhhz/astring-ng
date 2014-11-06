angular.module('a-string')
.factory('AlertService', function() {
  return {
    errorMessage: null,
    set: function(msg) { this.errorMessage = msg; },
    clear: function() { this.errorMessage = null; }
  };
});
