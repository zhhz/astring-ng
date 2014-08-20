describe('Completed controller', function(){
  var ctrl;
  beforeEach(module('a-string'));
  beforeEach(inject(function($controller, $rootScope){
    todoList = [{
      'id': 1,
      'title': 'Uncompleted Item 0',
      'completed': true
    }];

    scope = $rootScope.$new();
    ctrl = $controller('CompletedTodosCtrl', {
      $scope: scope,
    });
    scope.todos = todoList;
    scope.timer = {elapse: 0, duration: 0};
  }));

  it('activeTodo() should mark a todo completed false and set completedAt null', function(){
    var todo = todoList[0];
    scope.activateTodo(todo);
    expect(scope.todos[0].completed).toBeFalsy();
    expect(scope.todos[0].completedAt).toBeNull;
  });

});

