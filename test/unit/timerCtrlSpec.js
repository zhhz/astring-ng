describe('Timer controller', function(){
  var ctrl, todoList;
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
    ctrl = $controller('TimerCtrl', {
      $scope: scope
    });
    scope.todos = todoList;
  }));

/*
  it('toggleStart() should toggle the timer', function(){
    scope.toggleStart();
    expect(scope.timerOn).toBeTruthy();
  });
*/

});
