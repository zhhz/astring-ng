/**
 * Services that persists and retrieves TODOs from localStorage
 */
angular.module('a-string')
  .factory('todoStorage', function () {
    'use strict';

    var STORAGE_ID = 'a-string-todos';

    return {
      get: function () {
        return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
      },

      put: function (todos) {
        localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
      }
    };
  });
