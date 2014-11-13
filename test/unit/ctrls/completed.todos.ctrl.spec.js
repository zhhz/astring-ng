describe('CompletedTodsCtrl', function(){
  beforeEach(module('a-string'));

  var ctrl, states, todo;
  beforeEach(inject(function($controller, _$rootScope_, $q, Todos, States){
    todo = { _id: 1, title: 'completed Item 0', completed: false, duration: 5 };
    ctrl = $controller('CompletedTodosCtrl');
    states = States;
  }));

  it('#activeTodo() should mark a todo completed false and set completedAt null', function(){
    spyOn(states, 'activateTodo');
    ctrl.activateTodo(todo);
    expect(states.activateTodo).toHaveBeenCalledWith(todo);
  });

});

