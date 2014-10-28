angular.module('a-string')
.controller('PanelCtrl', ['States',
  function PanelCtrl(States){
    var self = this;
    self.states = States;
  }
]);
