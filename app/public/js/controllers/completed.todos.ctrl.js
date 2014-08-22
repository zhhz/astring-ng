angular.module('a-string')
.controller('CompletedTodosCtrl', ['$scope',
  function CompletedTodosCtrl($scope){

    $scope.activateTodo = function(todo){
      todo.completed = false;
      todo.completedAt = null;
      $scope.states.elapse += todo.duration;
      todo.duration = 0;
    };
  }
]);
