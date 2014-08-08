angular.module('a-string')
.controller('TodoCtrl', ['$scope', '$routeParams', '$filter', 'todoStorage', 'md5',
  function TodoCtrl($scope, $routeParams, $filter, todoStorage, md5) {
    'use strict';

    function blankTodo(){
      return {
               id: null,
               title: '',
               isCurrent: false,
               createdAt: null,
               startedAt: null,
               completedAt: null,
               completed: false
             };
    }

    var todos = $scope.todos = todoStorage.get();
    $scope.newTodo = blankTodo();
    $scope.editedTodo = null;
    $scope.currentTodo = null;


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
      var newTodo = $scope.newTodo;
      newTodo.title = newTodo.title.trim();
      if (!newTodo.title.length) {
        return;
      }
      // TODO
      newTodo.id = md5.createHash((new Date()).getTime() + 'a-string');
      newTodo.createdAt = new Date();
      todos.push(newTodo);

      $scope.newTodo = blankTodo();
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

    $scope.setCurrent = function(todo) {
      if(!$scope.currentTodo){
        todo.isCurrent = true;
        $scope.currentTodo = todo;
      }else if($scope.currentTodo.id === todo.id){
        $scope.currentTodo = null;
        todo.isCurrent = false;
      }else{
        $scope.currentTodo.isCurrent = false;
        todo.isCurrent = true;
        $scope.currentTodo = todo;
      }
    };
  }
]);
