angular.module('a-string')
.controller('TodoCtrl', ['$scope', 'States', 'Todos', 'songs', 'todos',
  function TodoCtrl($scope, States, Todos, songs, todos) {
    $scope.data = {};

    $scope.data.todos = todos;
    $scope.data.currentDate = moment().format('L');

    $scope.songs = songs;
    $scope.states = States;

    $scope.$watch('data.currentDate', function(newDate, oldDate){
      Todos.getTodos(newDate)
        .then(function(resolved){
          $scope.data.todos = resolved;

          var today = moment().format('L');
          $scope.data.isBefore = moment(newDate).isBefore(today, 'date');
          $scope.data.isAfter = moment(newDate).isAfter(today, 'date');
          $scope.data.isToday = moment(newDate).isSame(today, 'date');

          $scope.states.duration = _.reduce(resolved, function(result, v, k){
            return result + v.duration;
          }, 0);
        }, function(reason){
          console.log(reason);
        });
    });
  }
]);
