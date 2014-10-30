describe('ActiveTodos controller', function(){
  beforeEach(module('a-string'));

  var ctrl, states, todo;
  beforeEach(inject(function($controller, States){
    todo = { 'id': 1, 'title': 'Uncompleted Item 0', 'completed': false };
    ctrl = $controller('ActiveTodosCtrl');
    states = States;
  }));

  it('should have property states', function(){
    expect(ctrl.states).toEqual(states);
  });

  it('#removeTodo() should call States service', function(){
    spyOn(states, 'removeTodo');
    ctrl.removeTodo(todo);
    expect(states.removeTodo).toHaveBeenCalledWith(todo);
  });

  it('#doneTodo() should call States service', function(){
    spyOn(states, 'doneTodo');
    ctrl.doneTodo(todo);
    expect(states.doneTodo).toHaveBeenCalledWith(todo);
  });

  it('#toggleCurrent() should call States service', function(){
    spyOn(states, 'toggle');
    ctrl.toggleCurrent(todo);
    expect(states.toggle).toHaveBeenCalledWith(todo);
  });

});

