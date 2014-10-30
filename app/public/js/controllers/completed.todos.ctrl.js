angular.module('a-string')
.controller('CompletedTodosCtrl', ['Todos', 'States',
  function CompletedTodosCtrl(Todos, States){
    var self = this;
    self.states = States;

    self.activateTodo = function(todo){
      States.activateTodo(todo);
    };
  }
]);
