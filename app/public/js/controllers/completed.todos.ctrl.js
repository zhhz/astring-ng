angular.module('a-string')
.controller('CompletedTodosCtrl', ['Todos', 'States',
  function CompletedTodosCtrl(Todos, States){
    var self = this;

    self.activateTodo = function(todo){
      var _duration = todo.duration;

      todo.completed = false;
      todo.completedAt = null;
      todo.duration = 0;

      Todos.updateTodo(todo)
        .then(function(resolved){
          States.elapse += _duration;
        }, function(reason){
          console.log(reason);
        });
    };
  }
]);
