var pos = require('../pageobjects')();

describe('Active todos section on home screen', function(){
  beforeEach(function(){
    pos.open();
  });

  it('shouldn\'t have any todos when starts', function(){
    expect(pos.activeTodoList().count()).toEqual(0);
  });

  it('should have active todos', function(){
    pos.createTodo();
    expect(pos.activeTodoList().count()).toEqual(1);
  });

  it('should be able to finish a todo', function(){
    pos.createTodo();

    expect(pos.activeTodoList().count()).toEqual(1);
    pos.doneBtnForRow(0).click();
    expect(pos.activeTodoList().count()).toEqual(0);
  });

  it('should be able to delete a todo', function(){
    pos.createTodo();

    expect(pos.activeTodoList().count()).toEqual(1);
    pos.deleteBtnForRow(0).click();
    expect(pos.activeTodoList().count()).toEqual(0);
  });

  it('should be able to toggle a todo', function(){
    pos.createTodo();

    var rowBody = pos.todoContentForRow(0);
    expect(rowBody.getAttribute('class')).toEqual('form-control');
    pos.activeTodoList().get(0).click();
    expect(rowBody.getAttribute('class')).toContain('current');
    pos.activeTodoList().get(0).click();
    expect(rowBody.getAttribute('class')).toEqual('form-control');
  });

  afterEach(function(){
  });
});
