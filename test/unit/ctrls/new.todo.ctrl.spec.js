describe('NewTodoCtrl', function(){
  beforeEach(module('a-string'));

  var ctrl, states, todos, deferred, modal;
  var date = moment().format('L');

  beforeEach(inject(function($controller, $q,  Todos, States, $modal){
    deferred = $q.defer();
    states = States;
    todos = Todos;
    ctrl = $controller('NewTodoCtrl');
    modal = $modal;
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
    spyOn(states, 'createTodo');
    spyOn(todos, 'newTodo').andReturn({id: null});

    ctrl.song = '   my new todo   ';
    ctrl.addTodo();

    rootScope.$apply();

    expect(states.createTodo).toHaveBeenCalledWith(newTodo);
  });

  it("should not allow to add new todos on earlier days", function(){
    ctrl.song = 'new Todo';
    var modalInstance = {};
    deferred.reject();
    modalInstance.result = deferred.promise;
    states.date = moment().subtract(1, 'day').format('L');
    spyOn(modal, 'open').andReturn(modalInstance);

    ctrl.addTodo();
    expect(modal.open).toHaveBeenCalled();
  });
});
