describe("States service", function(){
  beforeEach(module('a-string'));

  var service, todos, songService, deferred, rootScope;
  var todolist, songs, books;
  beforeEach(inject(function(States, Todos, Songs, $q, _$rootScope_){
    service = States;
    todos = Todos;
    songService = Songs;
    deferred = $q.defer();
    rootScope = _$rootScope_;

    todolist = [ { '_id': 1, 'title': 'Uncompleted Item 0', 'completed': false },
                 { '_id': 2, 'title': 'Uncompleted Item 1', 'completed': false },
                 { '_id': 3, 'title': 'Uncompleted Item 2', 'completed': false }];
    songs = [{title: 'song1'}, {title: 'song2'}];
    books = [{title: 'book1'}, {title: 'book2'}];
  }));

  it("should init the States service", function(){
    deferred.resolve(books);
    spyOn(songService, 'getBooks').andReturn(deferred.promise);

    service.init();

    expect(service.date).toEqual(moment().format('YYYY-MM-DD'));
    expect(service.todos).toEqual([]);
    expect(service.songs).toEqual([]);
    expect(service.currentTodo).toBeNull;
    expect(service.currentSongs).toEqual([]);
    expect(service.timerOn).toEqual(false);
    expect(service.elapse).toEqual(0);
    expect(service.duration).toEqual(0);

    rootScope.$apply();
    expect(service.songs).toEqual(books);
  });

  it('#setDate() should be able to set current selected date', function(){
    // yesterday
    var date = moment().subtract(1, 'day').format('YYYY-MM-DD');
    service.setDate(date);
    expect(service.date).toEqual(date);
    expect(service.isBefore).toBeTruthy();
    expect(service.isAfter).toBeFalsy();
    expect(service.isToday).toBeFalsy();
    // today
    date = moment().format('YYYY-MM-DD');
    service.setDate(date);
    expect(service.date).toEqual(date);
    expect(service.isBefore).toBeFalsy();
    expect(service.isAfter).toBeFalsy();
    expect(service.isToday).toBeTruthy();
    // tomorrow
    date = moment().add(1, 'day').format('YYYY-MM-DD');
    service.setDate(date);
    expect(service.date).toEqual(date);
    expect(service.isBefore).toBeFalsy();
    expect(service.isAfter).toBeTruthy();
    expect(service.isToday).toBeFalsy();
  });

  it("#fetchTodos() should fetch and set todos and aggrate the duration", function(){
    var todoList = [
      {title: '1', duration: 1},
      {title: '2', duration: 2},
      {title: '3', duration: 3}
    ];
    deferred.resolve({data: todoList});
    spyOn(todos, 'getTodos').andReturn(deferred.promise);

    service.fetchTodos();
    rootScope.$apply();
    expect(todos.getTodos).toHaveBeenCalledWith(service.date);
    expect(service.todos).toEqual(todoList);
    expect(service.duration).toEqual(6);
  });

  it('#toggle() should set current todo if it dosn\'t have one', function(){
    var todo = todolist[1];

    deferred.resolve(songs);
    spyOn(songService, 'getSongs').andReturn(deferred.promise);

    expect(service.currentTodo).toBeNull;
    expect(service.currentSongs).toBeNull;

    service.toggle(todo);

    rootScope.$apply();

    expect(songService.getSongs).toHaveBeenCalledWith(todo);
    expect(service.currentTodo).toEqual(todo);
    expect(service.currentSongs).toEqual(songs);
  });

  it('#toggle() should unset the current song', function(){
    var todo = todolist[0];
    service.currentTodo = todo;
    service.currentSongs = songs;

    service.toggle(todo);
    expect(service.currentTodo).toBeNull;
    expect(service.currentSongs).toEqual([]);
  });

  it('#doneTodo() should mark a todo as done', function(){
    var todo = todolist[2];
    service.elapse = 123;

    service.doneTodo(todo);

    expect(todo.completed).toBeTruthy();
    expect(todo.completedAt).toBeNotNull;
    expect(todo.duration).toBe(123);
  });

  it('#doneTodo() should reset the States.elapse', function(){
    var todo = todolist[1];

    deferred.resolve({});
    spyOn(todos, 'updateTodo').andReturn(deferred.promise);

    service.doneTodo(todo);
    rootScope.$apply();

    expect(service.elapse).toEqual(0);
  });

  it('#doneTodo() should unset the current todo before mark it done', function(){
    var todo = todolist[0];
    service.currentTodo = todo;
    spyOn(service, 'toggle');

    service.doneTodo(todo);

    expect(service.toggle).toHaveBeenCalled();
  });

  it('#activeTodo() should mark a todo completed to false and set completedAt null', function(){
    deferred.resolve({});
    spyOn(todos, 'updateTodo').andReturn(deferred.promise);

    var todo = todolist[2];
    todo.duration = 5;

    service.elapse = 20;

    service.activateTodo(todo);

    expect(todo.completed).toBeFalsy();
    expect(todo.completedAt).toBeNull;
    expect(todo.duration).toBe(0);

    rootScope.$apply();

    expect(service.elapse).toBe(25);
  });

  it('#createTodo() should create a new todo', function(){
    var todo = {};
    deferred.resolve(todo);

    service.todos = todolist;
    var len = todolist.length;
    service.createTodo(todo);
    rootScope.$apply();
    expect(service.todos.length).toEqual(len + 1);
  });

});
