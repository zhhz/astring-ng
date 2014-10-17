describe('ActiveTodos controller', function(){
  beforeEach(module('a-string'));

  var ctrl, states, todos, deferred, rootScope, songsService;
  var todolist, songs;
  beforeEach(inject(function($controller, _$rootScope_, $q, Todos, States, Songs){
    todolist = [ { 'id': 1, 'title': 'Uncompleted Item 0', 'completed': false },
                 { 'id': 2, 'title': 'Uncompleted Item 1', 'completed': false },
                 { 'id': 3, 'title': 'Uncompleted Item 2', 'completed': false }];
    songs = [{title: 'song1'}, {title: 'song2'}];

    ctrl = $controller('ActiveTodosCtrl');
    states = States;
    todos = Todos;
    songsService = Songs;
    deferred = $q.defer();
    rootScope = _$rootScope_;
  }));

  it('#removeTodo() should remove a todo', function(){
    var todo = todolist[1];
    states.todos = todolist;

    deferred.resolve([]);
    spyOn(todos, 'removeTodo').andReturn(deferred.promise);

    var _count = states.todos.length;
    ctrl.removeTodo(todo);

    rootScope.$apply();

    expect(todos.removeTodo).toHaveBeenCalledWith(todo);
    expect(states.todos.length).toBe(_count - 1);
  });

  it('#removeTodo() should unset the current todo before remove it', function(){
    var todo = todolist[0];
    states.currentTodo = todo;
    spyOn(ctrl, 'toggleCurrent');

    ctrl.removeTodo(todo);

    expect(ctrl.toggleCurrent).toHaveBeenCalled();
  });

  it('#doneTodo() should mark a todo as done', function(){
    var todo = todolist[2];
    states.elapse = 123;

    ctrl.doneTodo(todo);

    expect(todo.completed).toBeTruthy();
    expect(todo.completedAt).toBeNotNull;
    expect(todo.duration).toBe(123);
  });

  it('#donTodo() should reset the States.elapse', function(){
    var todo = todolist[1];

    deferred.resolve({});
    spyOn(todos, 'updateTodo').andReturn(deferred.promise);

    ctrl.doneTodo(todo);
    rootScope.$apply();

    expect(states.elapse).toEqual(0);
  });

  it('#doneTodo() should unset the current todo before mark it done', function(){
    var todo = todolist[0];
    states.currentTodo = todo;
    spyOn(ctrl, 'toggleCurrent');

    ctrl.doneTodo(todo);

    expect(ctrl.toggleCurrent).toHaveBeenCalled();
  });

  it('#toggleCurrent() should unset the current todo if it has one', function(){
    var todo = todolist[0];
    states.todos = todolist;
    states.currentTodo = todo;
    states.currentSongs = songs;

    expect(states.currentTodo).toEqual(todo);
    expect(states.currentSongs).toEqual(songs);

    ctrl.toggleCurrent(todo);

    expect(states.currentTodo).toBeNull;
    expect(states.currentSongs).toEqual([]);
  });

  it('#toggleCurrent() should set current todo if it dosn\'t have one', function(){
    var todo = todolist[2];

    deferred.resolve(songs);
    spyOn(songsService, 'getSongs').andReturn(deferred.promise);

    expect(states.currentTodo).toBeNull;
    expect(states.currentSongs).toEqual([]);

    ctrl.toggleCurrent(todo);

    rootScope.$apply();

    expect(songsService.getSongs).toHaveBeenCalledWith(todo);
    expect(states.currentTodo).toEqual(todo);
    expect(states.currentSongs).toEqual(songs);
  });

});

