angular.module('a-string')
.controller('TodoCtrl', ['$scope', 'States', 'Todos', 'songs', 'todos',
  function TodoCtrl($scope, States, Todos, songs, todos) {
    $scope.data = {};

    $scope.data.todos = todos;
    $scope.data.currentDate = moment().format('L');

    $scope.songs = songs;
    $scope.states = States;

    $scope.$watch('data.currentDate', function(newDate, oldDate){
      console.log(' =>  => new date: %s', newDate);
      Todos.getTodos(newDate)
        .then(function(resolved){
          $scope.data.todos = resolved;
        }, function(reason){
          console.log(reason);
        });
    });
  }
]);
