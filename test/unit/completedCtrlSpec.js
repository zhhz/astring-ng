describe('Completed controller', function(){
  var ctrl;
  beforeEach(module('a-string'));
  beforeEach(inject(function($controller, $rootScope){
    todoList = [{
      'id': 1,
      'title': 'Uncompleted Item 0',
      'completed': true,
      'duration': 5
    }];

    scope = $rootScope.$new();
    ctrl = $controller('CompletedTodosCtrl', {
      $scope: scope,
    });
    scope.todos = todoList;
    scope.states = {elapse: 0, duration: 20, currentTodo: null};
  }));

  it('activeTodo() should mark a todo completed false and set completedAt null', function(){
    var todo = todoList[0];
    scope.activateTodo(todo);
    expect(scope.todos[0].completed).toBeFalsy();
    expect(scope.todos[0].completedAt).toBeNull;
    expect(scope.states.elapse).toBe(5);
    expect(scope.todos[0].duration).toBe(0);
  });

});

