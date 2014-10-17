angular.module('a-string')
.controller('TodoCtrl', ['States', 'songs', 'todos',
  function TodoCtrl(States, songs, todos) {
    States.todos = todos;
    States.songs = songs;
  }
]);
