angular.module('a-string')
.controller('ActiveTodosCtrl', ['States', 'Songs', 'Todos',
  function ActiveTodoCtrl(States, Songs, Todos){
    var self = this;

    self.removeTodo = function (todo) {
      if(States.currentTodo === todo){
        self.toggleCurrent(todo);
      }
      Todos.removeTodo(todo)
        .then(function(resolved){
          _.remove(States.todos, function(t){return t.id === todo.id;});
        }, function(reason){
          console.log(reason);
        });
    };

    self.doneTodo = function(todo){
      if(States.currentTodo === todo){
        self.toggleCurrent(todo);
      }

      todo.completed = true;
      todo.completedAt = (new Date()).getTime();
      todo.duration = States.elapse;
      Todos.updateTodo(todo)
        .then(function(resolved){
          States.elapse = 0;
        }, function(reason){
          console.log(reason);
        });
    };

    self.toggleCurrent = function(todo) {
      if(States.currentTodo === todo){
        States.currentTodo = null;
        States.currentSongs = [];
      }else{
        Songs.getSongs(todo).then(function(songs){
          States.currentSongs = songs;
        });
        States.currentTodo = todo;
      }
    };
  }
]);
