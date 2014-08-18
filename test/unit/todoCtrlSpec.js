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

  it('should not have any Todos on start', function () {
    expect(scope.todos.length).toBe(0);
  });

  it('should not have Todo as current ', function () {
    expect(scope.currentId).toBeNull;
  });
});
