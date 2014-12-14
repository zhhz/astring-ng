angular.module('a-string')
.controller('HomeCtrl', ['States',
  function(States){
    var self = this;
    States.activeMenu = 'home';
    States.init();
    self.states = States;
  }
]);
