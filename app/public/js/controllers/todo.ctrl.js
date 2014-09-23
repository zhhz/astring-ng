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

          var today = moment(moment().format('L'), 'MM-DD-YYYY');
          var selectDate = moment(newDate, 'MM-DD-YYYY');
          $scope.data.isBefore = selectDate.isBefore(today, 'date');
          $scope.data.isAfter = selectDate.isAfter(today, 'date');
          $scope.data.isToday = selectDate.isSame(today, 'date');

          $scope.states.duration = _.reduce(resolved, function(result, v, k){
            return result + v.duration;
          }, 0);
        }, function(reason){
          console.log(reason);
        });
    });
  }
]);
