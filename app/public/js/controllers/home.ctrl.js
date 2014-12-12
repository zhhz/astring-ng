angular.module('a-string')
.controller('HomeCtrl', ['States',
  function(States){
    States.activeMenu = 'home';
    console.log('Home ctroller');
    var self = this;
    self.states = States;
  }
]);
