angular.module('a-string')
.controller('NewTodoCtrl', ['$scope', 'Todos',
  function NewTodoCtrl($scope, Todos){
    var newTodo = {
      id: null,
      title: '',
      createdAt: (new Date()).getTime(),
      duration: 0,
      completedAt: null,
      completed: false
    };

    $scope.addTodo = function () {
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
      Todos.createTodo(newTodo);

      $scope.song = '';
    };
  }
]);
