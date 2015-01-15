angular.module('a-string')
.controller('TodoCtrl', ['States', '$location',
  function TodoCtrl(States, $location) {
    States.init();

    var self = this;
    self.states = States;

    self.gotoTodos = function(){
      States.activeMenu = 'todos';
      States.setDate(moment().format('YYYY-MM-DD'));
      $location.path('/todos');
    };
  }
]);
