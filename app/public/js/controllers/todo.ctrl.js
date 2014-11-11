angular.module('a-string')
.controller('TodoCtrl', ['States',
  function TodoCtrl(States) {
    States.init();
    this.states = States;
  }
]);
