angular.module('a-string')
.controller('CompletedTodosCtrl', ['$scope',
  function ActiveTodoCtrl($scope){

    $scope.activeTodo = function(todo){
      todo.completed = false;
      todo.completedAt = null;
    };
  }
]);
