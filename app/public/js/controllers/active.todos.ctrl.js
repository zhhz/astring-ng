angular.module('a-string')
.controller('ActiveTodosCtrl', ['States', 'Todos',
  function ActiveTodoCtrl(States, Todos){
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
