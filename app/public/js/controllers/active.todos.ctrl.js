angular.module('a-string')
.controller('ActiveTodosCtrl', ['States', 'Todos',
  function ActiveTodoCtrl(States, Todos){
    var self = this;
    self.states = States;

    self.removeTodo = function (todo) {
      States.removeTodo(todo);
    };

    self.doneTodo = function(todo){
      States.doneTodo(todo);
    };

    self.toggleCurrent = function(todo) {
      States.toggle(todo);
    };
  }
]);
