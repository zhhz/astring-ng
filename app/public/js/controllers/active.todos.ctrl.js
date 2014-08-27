angular.module('a-string')
.controller('ActiveTodosCtrl', ['$scope', 'Songs',
  function ActiveTodoCtrl($scope, Songs){

    $scope.removeTodo = function (todo) {
      if($scope.states.currentTodo === todo){
        $scope.toggleCurrent(todo);
      }
      $scope.todos.splice($scope.todos.indexOf(todo), 1);
    };

    $scope.doneTodo = function(todo){
      if($scope.states.currentTodo === todo){
        $scope.toggleCurrent(todo);
      }

      todo.completed = true;
      todo.completedAt = (new Date()).getTime();
      todo.duration = $scope.states.elapse;
      $scope.states.elapse = 0;
    };

    $scope.toggleCurrent = function(todo) {
      if($scope.states.currentTodo === todo){
        $scope.states.currentTodo = null;
        $scope.states.currentSongs = [];
      }else{
        Songs.getSongs(todo).then(function(songs){
          $scope.states.currentSongs = songs;
        });
        $scope.states.currentTodo = todo;
      }
    };
  }
]);
