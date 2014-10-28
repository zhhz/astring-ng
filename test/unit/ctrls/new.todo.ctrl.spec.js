describe('NewTodoCtrl', function(){
  beforeEach(module('a-string'));

  var ctrl, states, todos, deferred, provide, rootScope;
  var date = moment().format('L');

  beforeEach(inject(function($controller, $q, _$rootScope_, Todos, States){
    deferred = $q.defer();
    states = States;
    todos = Todos;
    rootScope = _$rootScope_;
    ctrl = $controller('NewTodoCtrl');

  }));

  it("should has property states", function(){
    expect(ctrl.states).toEqual(states);
  });

  it("#addTodo should not add empty todo", function(){
    var len = states.todos.length;
    ctrl.addTodo();
    expect(len).toEqual(states.todos.length);
  });

  it("#addTodo should not add empty todos conisting only of whitespaces", function(){
    var len = states.todos.length;
    ctrl.song = '   ';
    ret = ctrl.addTodo();
    expect(len).toEqual(states.todos.length)
  });

  it("should trim whitespaces for new todos", function(){
    var newTodo = {id: null, title: 'my new todo', startDate: states.currentDate};
    deferred.resolve(newTodo);
    spyOn(todos, 'createTodo').andReturn(deferred.promise);
    spyOn(todos, 'newTodo').andReturn({id: null});

    var len = states.todos.length;
    ctrl.song = '   my new todo   ';
    ctrl.addTodo();
    rootScope.$apply();
    expect(todos.createTodo).toHaveBeenCalledWith(newTodo);
    expect(len + 1).toEqual(states.todos.length);
    expect('my new todo').toEqual(states.todos[0].title);
  });
});
