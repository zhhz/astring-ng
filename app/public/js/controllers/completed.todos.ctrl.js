angular.module('a-string')
.controller('CompletedTodosCtrl', ['$scope',
  function CompletedTodosCtrl($scope){

    $scope.activateTodo = function(todo){
      todo.completed = false;
      todo.completedAt = null;
      $scope.timer.elapse += todo.duration;
      todo.duration = 0;
    };
  }
]);
