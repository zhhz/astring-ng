angular.module('a-string')
.controller('ActiveTodosCtrl', ['$scope',
  function ActiveTodoCtrl($scope){

    $scope.removeTodo = function (todo) {
      $scope.todos.splice($scope.todos.indexOf(todo), 1);
    };

    $scope.doneTodo = function(todo){
      todo.completed = true;
      todo.completedAt = new Date();
    };

    $scope.toggleCurrent = function(id) {
      if(!$scope.currentId){
        $scope.currentId = id;
      }else if($scope.currentId === id){
        $scope.currentId = null;
      }else{
        $scope.currentId = id;
      }
    };
  }
]);
