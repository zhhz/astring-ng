describe('NewTodo controller', function () {
  var ctrl, scope;
  var todoStorage = {
    storage: {},
    get: function(){
      return this.storage;
    },
    put: function(value){
      this.storage = value;
    }
  };

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

  beforeEach(module('a-string'));

  beforeEach(inject(function ($controller, $rootScope, Songs) {
    todoStorage.storage = [];
    scope = $rootScope.$new();
    $rootScope.todos = todoStorage.get();
    ctrl = $controller('NewTodoCtrl', {
      $scope: scope,
      songs: songs
    });
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
