describe('ActiveTodos controller', function(){
  var ctrl;
  beforeEach(module('a-string'));
  beforeEach(inject(function($controller, $rootScope){
    todoList = [{
      'id': 1,
      'title': 'Uncompleted Item 0',
      'completed': false
    }, {
      'id': 2,
      'title': 'Uncompleted Item 1',
      'completed': false
    }, {
      'id': 3,
      'title': 'Uncompleted Item 2',
      'completed': false
    }];

    scope = $rootScope.$new();
    ctrl = $controller('ActiveTodosCtrl', {
      $scope: scope
    });
    scope.todos = todoList;
    scope.states = {elapse: 35, duration: 100, currentTodo: null};
  }));

  it('removeTodo() should remove a todo', function(){
    var todo = todoList[1];
    var _count = scope.todos.length;
    scope.removeTodo(todo);
    expect(scope.todos.length).toBe(_count - 1);
  });

  it('doneTodo should mark a todo completed and set completedAt', function(){
    var todo = todoList[2];
    scope.doneTodo(todo);
    expect(scope.todos[2].completed).toBeTruthy();
    expect(scope.todos[2].completedAt).toBeNotNull;
  });

  it('toggleCurrent() should set todo as current', function(){
    var todo = todoList[0];
    scope.toggleCurrent(todo);

    expect(scope.states.currentTodo).toBe(todo);
  });

  it('toggleCurrent() should toggle if current is clicked', function(){
    var todo = todoList[0];
    scope.toggleCurrent(todo);
    expect(scope.states.currentTodo).toBe(todo);

    scope.toggleCurrent(todo);
    expect(scope.states.currentTodo).toBeNull;
  });
});

