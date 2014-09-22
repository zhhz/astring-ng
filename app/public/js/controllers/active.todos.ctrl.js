angular.module('a-string')
.controller('ActiveTodosCtrl', ['$scope', 'Songs', 'Todos',
  function ActiveTodoCtrl($scope, Songs, Todos){

    $scope.removeTodo = function (todo) {
      if($scope.states.currentTodo === todo){
        $scope.toggleCurrent(todo);
      }
      Todos.removeTodo(todo);
    };

    $scope.doneTodo = function(todo){
      if($scope.states.currentTodo === todo){
        $scope.toggleCurrent(todo);
      }

      todo.completed = true;
      todo.completedAt = (new Date()).getTime();
      todo.duration = $scope.states.elapse;
      Todos.updateTodo(todo)
        .then(function(resolved){
          $scope.states.elapse = 0;
        }, function(reason){
          console.log(reason);
        });
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
