angular.module('a-string')
.controller('CompletedTodosCtrl', ['$scope',
  function ActiveTodoCtrl($scope){

    $scope.activateTodo = function(todo){
      todo.completed = false;
      todo.completedAt = null;
    };
  }
]);
