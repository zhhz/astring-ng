angular.module('a-string')
.controller('TodoCtrl', ['$scope', 'todoStorage', 'songs',
  function TodoCtrl($scope, todoStorage, songs) {
    'use strict';

    var todos = $scope.todos = todoStorage.get();
    $scope.currentId = null;
    $scope.songs = songs;
    $scope.timer = {duration: 0, elapse: 0};

    angular.forEach(todos, function(value, key){
      if(value.completed){
        $scope.timer.duration += value.duration;
      }
    });

    $scope.$watch('todos', function (newValue, oldValue) {
      if (newValue !== oldValue) { // This prevents unneeded calls to the local storage
        todoStorage.put(todos);
      }
    }, true);
  }
]);
