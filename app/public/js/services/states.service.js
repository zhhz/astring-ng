angular.module('a-string')
.factory('States', [function(){
    return {
      currentTodo: null,
      timerOn    : false,
      elapse     : 0,
      duration   : 0,
      currentSongs: []
    };
  }
]);

