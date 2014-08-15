angular.module('a-string')
.controller('TodoCtrl', ['$scope', '$routeParams', '$filter', 'todoStorage', 'Todos', 'songs',
  function TodoCtrl($scope, $routeParams, $filter, todoStorage, Todos, songs) {
    'use strict';

    var todos = $scope.todos = todoStorage.get();
    $scope.editedTodo = null;
    $scope.currentId = null;
    $scope.songs = songs;

    $scope.$watch('todos', function (newValue, oldValue) {
      $scope.remainingCount = $filter('filter')(todos, { completed: false }).length;
      $scope.completedCount = todos.length - $scope.remainingCount;
      $scope.allChecked = !$scope.remainingCount;
      if (newValue !== oldValue) { // This prevents unneeded calls to the local storage
        todoStorage.put(todos);
      }
    }, true);

    // Monitor the current route for changes and adjust the filter accordingly.
    $scope.$on('$routeChangeSuccess', function () {
      var status = $scope.status = $routeParams.status || '';

      $scope.statusFilter = (status === 'active') ?
        { completed: false } : (status === 'completed') ?
        { completed: true } : null;
    });

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
      todos.push(newTodo);

      $scope.song = '';
    };

    $scope.editTodo = function (todo) {
      $scope.editedTodo = todo;
      // Clone the original todo to restore it on demand.
      $scope.originalTodo = angular.extend({}, todo);
    };

    $scope.doneEditing = function (todo) {
      $scope.editedTodo = null;
      todo.title = todo.title.trim();

      if (!todo.title) {
        $scope.removeTodo(todo);
      }
    };

    $scope.revertEditing = function (todo) {
      todos[todos.indexOf(todo)] = $scope.originalTodo;
      $scope.doneEditing($scope.originalTodo);
    };

    $scope.removeTodo = function (todo) {
      todos.splice(todos.indexOf(todo), 1);
    };

    $scope.clearCompletedTodos = function () {
      $scope.todos = todos = todos.filter(function (val) {
        return !val.completed;
      });
    };

    $scope.markAll = function (completed) {
      todos.forEach(function (todo) {
        todo.completed = !completed;
      });
    };

    $scope.toggleCurrent = function(id) {
      if(!$scope.currentId){
        $scope.currentId = id;
      }else if($scope.currentId === id){
        $scope.currentId = null;
      }else{
        $scope.currentId = id;
      }
    };
  }
]);
