angular.module('a-string')
.controller('NewTodoCtrl', ['Todos', 'States',
  function NewTodoCtrl(Todos, States){
    var self = this;
    self.addTodo = function () {
      if(!self.song){ return; }

      var newTodo = Todos.newTodo();
      newTodo.startDate = States.currentDate;
      if(!self.song.title){
        newTodo.title = self.song.trim();
      }else{
        newTodo.title = self.song.title.trim();
        newTodo.song = self.song;
      }
      if (!newTodo.title.length) {
        return;
      }
      Todos.createTodo(newTodo).then(function(resolved){
        States.todos.push(resolved);
      }, function(reason){
        console.log(reason);
      });

      self.song = '';
    };
  }
]);
