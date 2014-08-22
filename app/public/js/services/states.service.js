angular.module('a-string')
.factory('States', [function(){
    return {
      currentTodo: null,
      timerOn    : false,
      bpm        : 60,
      elapse     : 0,
      duration   : 0     
    };
  }
]);
