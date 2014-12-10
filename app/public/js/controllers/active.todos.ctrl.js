angular.module('a-string')
.controller('ActiveTodosCtrl', ['States',
  function ActiveTodoCtrl(States){
    this.states = States;

    this.removeTodo = function (todo) {
      States.removeTodo(todo);
    };

    this.doneTodo = function(todo){
      States.doneTodo(todo);
    };

    this.toggleCurrent = function(todo) {
      States.toggle(todo);
    };
  }
]);
