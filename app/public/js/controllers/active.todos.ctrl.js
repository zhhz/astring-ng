angular.module('a-string')
.controller('ActiveTodosCtrl', ['$scope',
  function ActiveTodoCtrl($scope){

    $scope.removeTodo = function (todo) {
      $scope.todos.splice($scope.todos.indexOf(todo), 1);
    };

    $scope.doneTodo = function(todo){
      todo.completed = true;
      todo.completedAt = new Date();
      todo.duration = $scope.states.elapse;
      $scope.states.elapse = 0;
    };

    $scope.toggleCurrent = function(todo) {
      if(!$scope.states.currentTodo){
        $scope.states.currentTodo = todo;
      }else if($scope.states.currentTodo === todo){
        $scope.states.currentTodo = null;
      }else{
        $scope.states.currentTodo = todo;
      }
    };
  }
]);
