angular.module('a-string')
.controller('NewTodoCtrl', ['$scope', 'Todos',
  function NewTodoCtrl($scope, Todos){
    $scope.addTodo = function () {
      var newTodo = Todos.newTodo();
      if(!$scope.song.title){
        newTodo.title = $scope.song.trim();
      }else{
        newTodo.title = $scope.song.title.trim();
        newTodo.song = $scope.song;
      }
      if (!newTodo.title.length) {
        return;
      }
      $scope.todos.push(newTodo);

      $scope.song = '';
    };
  }
]);
