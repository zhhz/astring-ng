angular.module('a-string')
.controller('PanelCtrl', ['States',
  function PanelCtrl(States){
    this.states = States;
  }
]);
