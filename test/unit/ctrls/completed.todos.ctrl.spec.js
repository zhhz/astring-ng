describe('CompletedTodsCtrl', function(){
  beforeEach(module('a-string'));

  var ctrl, deferred, todos, states, rootScope;
  var todo;
  beforeEach(inject(function($controller, _$rootScope_, $q, Todos, States){
    todo = { id: 1, title: 'completed Item 0', completed: false, duration: 5 };

    deferred = $q.defer();
    rootScope = _$rootScope_;
    ctrl = $controller('CompletedTodosCtrl');
    todos = Todos;
    States.elapse = 20;
    states = States;
  }));

  it('#activeTodo() should mark a todo completed false and set completedAt null', function(){
    deferred.resolve({});
    spyOn(todos, 'updateTodo').andReturn(deferred.promise);

    ctrl.activateTodo(todo);

    expect(todo.completed).toBeFalsy();
    expect(todo.completedAt).toBeNull;
    expect(todo.duration).toBe(0);

    rootScope.$apply();

    expect(states.elapse).toBe(25);
  });

});

