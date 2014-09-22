angular.module('a-string')
.controller('CompletedTodosCtrl', ['$scope', 'Todos',
  function CompletedTodosCtrl($scope, Todos){

    $scope.activateTodo = function(todo){
      todo.completed = false;
      todo.completedAt = null;
      $scope.states.elapse += todo.duration;
      todo.duration = 0;
  
      Todos.updateTodo(todo)
        .then(function(resolved){

        }, function(reason){
          console.log(reason);
        });
    };
  }
]);
