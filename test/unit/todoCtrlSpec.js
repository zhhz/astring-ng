/*global describe, it, beforeEach, inject, expect*/

describe('Todo Controller', function () {
  var songs = [
    {
      book: "Book1",
      category: "Suzuki",
      title: "Twinkle Variations"
    },
    {
      book: "Book1",
      category: "Suzuki",
      title: "Go Tell Aunt Rhody"
    },
    {
      book: "Book2",
      category: "Suzuki",
      title: "Gavotte From Mignon"
    },
    {
      book: "Book8",
      category: "Suzuki",
      title: "Allegro in E Minor for Violin and Continuo, BWV 1023"
    }
  ];
  var ctrl, scope, mockBackend;
  var todoList;
  var todoStorage = {
    storage: {},
    get: function () {
      return this.storage;
    },
    put: function (value) {
      this.storage = value;
    }
  };

  // Load the module containing the app, only 'ng' is loaded by default.
  beforeEach(module('a-string'));

  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, Songs) {
    mockBackend = _$httpBackend_;
    scope = $rootScope.$new();
    ctrl = $controller('TodoCtrl', {
      $scope: scope,
      songs: songs
    });
  }));

  it('should have a list of songs', function(){
    expect(scope.songs).toEqual(songs);
  });

  it('should not have an edited Todo on start', function () {
    expect(scope.editedTodo).toBeNull();
  });

  it('should not have any Todos on start', function () {
    expect(scope.todos.length).toBe(0);
  });

  it('should not have any Todos as current ', function () {
    expect(scope.currentTodo).toBeNull;
  });

  it('should have all Todos completed', function () {
    scope.$digest();
    expect(scope.allChecked).toBeTruthy();
  });

  describe('having no Todos', function () {
    var ctrl;

    beforeEach(inject(function ($controller) {
      todoStorage.storage = [];
      ctrl = $controller('TodoCtrl', {
        $scope: scope,
        todoStorage: todoStorage,
        songs: songs
      });
      scope.$digest();
    }));

    it('should not add empty Todos', function () {
      scope.song = '';
      scope.addTodo();
      scope.$digest();
      expect(scope.todos.length).toBe(0);
    });

    it('should not add items consisting only of whitespaces', function () {
      scope.song = {};
      scope.song.title = '   ';
      scope.addTodo();
      scope.$digest();
      expect(scope.todos.length).toBe(0);
    });


    it('should trim whitespace from new Todos', function () {
      scope.song = {};
      scope.song.title = '  buy some unicorns  ';
      scope.addTodo();
      scope.$digest();
      expect(scope.todos.length).toBe(1);
      expect(scope.todos[0].title).toBe('buy some unicorns');
    });

    it('should has the id and createdAt set when create a new todo', function (){
      scope.song = {};
      scope.song.title = 'a new todo';
      scope.addTodo();
      scope.$digest();
      expect(scope.todos.length).toBe(1);
      expect(scope.todos[0].id).not.toBeNull();
      expect(scope.todos[0].createdAt).not.toBeNull();
    });
  });

  describe('having some saved Todos', function () {
    var ctrl;

    beforeEach(inject(function ($controller) {
      todoList = [{
          'title': 'Uncompleted Item 0',
          'completed': false
        }, {
          'title': 'Uncompleted Item 1',
          'completed': false
        }, {
          'title': 'Uncompleted Item 2',
          'completed': false
        }, {
          'title': 'Completed Item 0',
          'completed': true
        }, {
          'title': 'Completed Item 1',
          'completed': true
        }];

      todoStorage.storage = todoList;
      ctrl = $controller('TodoCtrl', {
        $scope: scope,
        todoStorage: todoStorage,
        songs: songs
      });
      scope.$digest();
    }));

    it('should count Todos correctly', function () {
      expect(scope.todos.length).toBe(5);
      expect(scope.remainingCount).toBe(3);
      expect(scope.completedCount).toBe(2);
      expect(scope.allChecked).toBeFalsy();
    });

    it('should save Todos to local storage', function () {
      expect(todoStorage.storage.length).toBe(5);
    });

    it('should remove Todos w/o title on saving', function () {
      var todo = todoList[2];
      todo.title = '';

      scope.doneEditing(todo);
      expect(scope.todos.length).toBe(4);
    });

    it('should trim Todos on saving', function () {
      var todo = todoList[0];
      todo.title = ' buy moar unicorns  ';

      scope.doneEditing(todo);
      expect(scope.todos[0].title).toBe('buy moar unicorns');
    });

    it('clearCompletedTodos() should clear completed Todos', function () {
      scope.clearCompletedTodos();
      expect(scope.todos.length).toBe(3);
    });

    it('markAll() should mark all Todos completed', function () {
      scope.markAll();
      scope.$digest();
      expect(scope.completedCount).toBe(5);
    });

    it('revertTodo() get a Todo to its previous state', function () {
      var todo = todoList[0];
      scope.editTodo(todo);
      todo.title = 'Unicorn sparkly skypuffles.';
      scope.revertEditing(todo);
      scope.$digest();
      expect(scope.todos[0].title).toBe('Uncompleted Item 0');
    });
  });
  describe('select a todo item', function(){
    var ctrl;
    beforeEach(inject(function($controller){
      todoList = [{
          'id': 1,
          'title': 'Uncompleted Item 0',
          'completed': false
        }, {
          'id': 2,
          'title': 'Uncompleted Item 1',
          'completed': false
        }, {
          'id': 3,
          'title': 'Uncompleted Item 2',
          'completed': false
        }];

      todoStorage.storage = todoList;
      ctrl = $controller('TodoCtrl', {
        $scope: scope,
        todoStorage: todoStorage,
        songs: songs
      });
      scope.$digest();
    }));

    beforeEach(function() {
      this.addMatchers({
        toEqualData: function(expected) {
          return angular.equals(this.actual, expected);
        }
      });
    });

    it('toggleCurrent() should set todo as current', function(){
      var todo = todoList[0];
      scope.toggleCurrent(todo.id);

      expect(scope.currentId).toBe(todo.id);
    });

    it('toggleCurrent() should toggle if current is clicked', function(){
      var todo = todoList[0];
      scope.toggleCurrent(todo.id);
      expect(scope.currentId).toBe(todo.id);

      scope.toggleCurrent(todo.id);
      expect(scope.currentId).toBeNull;
    });
  });

});
