angular.module('a-string')
.factory('States', [function(){
    return {
      todos       : [],
      currentDate : moment().format('L'),

      songs       : [],

      currentTodo : null,
      currentSongs: [],

      timerOn     : false,
      elapse      : 0,
      duration    : 0
    };
  }
]);
