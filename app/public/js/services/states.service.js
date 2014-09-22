angular.module('a-string')
.factory('States', [function(){
    return {
      currentTodo : null,
      currentSongs: [],
      timerOn     : false,
      elapse      : 0,
      duration    : 0
    };
  }
]);

