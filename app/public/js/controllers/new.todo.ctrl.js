angular.module('a-string')
.controller('NewTodoCtrl', ['$scope', 'Todos',
  function NewTodoCtrl($scope, Todos){

    $scope.addTodo = function () {
      if(!$scope.song){ return null; }

      var newTodo = Todos.newTodo();
      newTodo.startDate = $scope.data.currentDate;
      if(!$scope.song.title){
        newTodo.title = $scope.song.trim();
      }else{
        newTodo.title = $scope.song.title.trim();
        newTodo.song = $scope.song;
      }
      if (!newTodo.title.length) {
        return;
      }
      Todos.createTodo(newTodo)
        .then(function(resolved){
          // console.log($scope.data.todos);
        }, function(reason){
          console.log(reason);
        });

      $scope.song = '';
    };
  }
]);
