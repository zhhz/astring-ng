/**
 * Directive that places focus on the element it is applied to when the
 * expression it binds to evaluates to true
 */
angular.module('a-string')
  .directive('asFocus', function ($timeout) {
    'use strict';

    return function (scope, elem, attrs) {
      scope.$watch(attrs.asFocus, function (newVal) {
        if (newVal) {
          $timeout(function () {
            elem[0].focus();
          }, 0, false);
        }
      });
    };
  });
