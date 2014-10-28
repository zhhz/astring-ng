var pos = require('../pageobjects')();

describe('Completed todos section on home screen', function(){
  beforeEach(function(){
    pos.open();
    pos.createTodo();
  });

  it('shouldn\'t have any completed todo when starts', function(){
    expect(pos.completedTodoList().count()).toEqual(0);
  });

  it('should have a completed todo', function(){
    pos.doneBtnForRow(0).click();
    expect(pos.completedTodoList().count()).toEqual(1);
  });

  it('should be able to undo the completed todo', function(){
    pos.doneBtnForRow(0).click();
    expect(pos.completedTodoList().count()).toEqual(1);
    expect(pos.activeTodoList().count()).toEqual(0);
    pos.undoBtnForRow(0).click();
    expect(pos.completedTodoList().count()).toEqual(0);
    expect(pos.activeTodoList().count()).toEqual(1);
  });

  it('only the last undo btn should be enabled', function(){
    pos.createTodo();
    pos.createTodo();

    expect(pos.activeTodoList().count()).toEqual(3);

    pos.doneBtnForRow(2).click();
    expect(pos.completedTodoList().count()).toEqual(1);
    expect(pos.activeTodoList().count()).toEqual(2);

    pos.doneBtnForRow(1).click();
    expect(pos.completedTodoList().count()).toEqual(2);
    expect(pos.activeTodoList().count()).toEqual(1);

    pos.doneBtnForRow(0).click();
    expect(pos.completedTodoList().count()).toEqual(3);
    expect(pos.activeTodoList().count()).toEqual(0);

    var btn = pos.undoBtnForRow(0);
    expect(btn.isEnabled()).toBeFalsy();
    btn = pos.undoBtnForRow(1);
    expect(btn.isEnabled()).toBeFalsy();
    btn = pos.undoBtnForRow(2);
    expect(btn.isEnabled()).toBeTruthy();

    // make sure it is the last btn
    btn = pos.btnLastRow();
    expect(btn.isEnabled()).toBeTruthy();
  });
});
