angular.module('a-string')
.directive('asAlertBar', [function() {
  return {
    restrict: 'A',
    template: '<div class="alert alert-danger" ng-show="errorMessage">' +
      '<button type="button" class="close" ng-click="hideAlert()">x</button>' +
      '{{errorMessage}}</div>',

    link: function(scope, elem, attrs) {
      var alertMessageAttr = attrs['alertmessage'];
      scope.errorMessage = null;

      scope.$watch(alertMessageAttr, function(newVal) {
        scope.errorMessage = newVal;
      });
      scope.hideAlert = function() {
        scope.errorMessage = '';
      };
    }
  };
}]);
