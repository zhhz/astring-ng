angular.module('a-string')
.controller('TodoCtrl', ['$scope', 'States', 'todoStorage', 'songs',
  function TodoCtrl($scope, States, todoStorage, songs) {
    'use strict';

    var todos = $scope.todos = todoStorage.get();
    $scope.songs = songs;
    $scope.states = States;


    angular.forEach(todos, function(value, key){
      if(value.completed){
        States.duration += value.duration;
      }
    });

    $scope.$watch('todos', function (newValue, oldValue) {
      if (newValue !== oldValue) { // This prevents unneeded calls to the local storage
        todoStorage.put(todos);
      }
    }, true);
  }
]);
