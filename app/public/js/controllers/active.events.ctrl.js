angular.module('a-string')
.controller('ActiveEventsCtrl', ['States',
  function ActiveEventsCtrl(States){
    this.states = States;

    this.doneEvent = function(event){
      States.doneEvent(event);
    };

    this.toggleCurrent = function(event) {
      States.toggle(event);
    };
  }
]);
