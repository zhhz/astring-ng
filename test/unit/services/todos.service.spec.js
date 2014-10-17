describe("Todos service", function(){
  beforeEach(module('a-string'));

  var service, storage, deferred, $rootScope;
  var date;
  beforeEach(inject(function($q, _$rootScope_, Todos, TodoStorage){
    service = Todos;
    storage = TodoStorage;
    deferred = $q.defer();
    $rootScope = _$rootScope_;
    date = moment().format('L');
  }));

  it("#newTodo should return an un-saved todo object", function(){
    var newTodo = service.newTodo();
    expect(newTodo).toEqual({
        id: null,
        title: '',
        createdAt: (new Date()).getTime(),
        duration: 0,
        completedAt: null,
        completed: false
      });
  });

  it("#getTodos should successfully get todos from the server", function(){
    deferred.resolve([{title: 'the todo'}]);
    spyOn(storage, 'fetchTodos').andReturn(deferred.promise);
    var todos;
    service.getTodos(date).then(function(resolved){
      todos = resolved;
    });

    // promises are resolved/dispatched only on next $digest cycle
    $rootScope.$apply();

    expect(todos).toEqual([{title: 'the todo'}]);
    expect(storage.fetchTodos).toHaveBeenCalled();
    expect(storage.fetchTodos.callCount).toEqual(1);
  });

  it("#createTodo should successfully create a new todo", function(){
    deferred.resolve({startDate: date, title: 'new todo'});
    spyOn(storage, 'createTodo').andReturn(deferred.promise);

    var newTodo;
    service.createTodo({startDate: date, title: 'new todo'})
    .then(function(resolved){ newTodo = resolved; });
    $rootScope.$apply();
    expect(newTodo).toEqual({startDate: date, title: 'new todo'});
    expect(storage.createTodo).toHaveBeenCalled();
    expect(storage.createTodo.callCount).toEqual(1);
  });

  it("#removeTodo should delete a todo", function(){
    deferred.resolve([]);
    spyOn(storage, 'deleteTodo').andReturn(deferred.promise);

    var ret;
    service.removeTodo({startDate: date}).then(function(resolved){ret = resolved;});
    $rootScope.$apply();
    expect(ret).toEqual([]);
  });

  it("#get should retrieve the todo from the storage", function(){
    deferred.resolve({id: 1, startDate: date});
    spyOn(storage, 'get').andReturn(deferred.promise);

    var todo;
    service.get(1).then(function(resolved){todo = resolved;});
    $rootScope.$apply();
    expect(todo).toEqual({id: 1, startDate: date});
    expect(storage.get).toHaveBeenCalled();
    expect(storage.get.callCount).toEqual(1);
  });

});
