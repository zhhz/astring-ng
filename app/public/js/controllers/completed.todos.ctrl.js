angular.module('a-string')
.controller('CompletedTodosCtrl', ['Todos', 'States',
  function CompletedTodosCtrl(Todos, States){
    this.states = States;
    this.activateTodo = function(todo){
      States.activateTodo(todo);
    };
  }
]);
