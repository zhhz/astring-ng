angular.module('a-string')
.controller('TodoCtrl', ['States', 'songs', 'todos', 'AlertService',
  function TodoCtrl(States, songs, todos, AlertService) {
    States.alert   = AlertService;
    States.todos   = todos;
    States.songs   = songs;
    States.isToday = true;

    this.states = States;
  }
]);
