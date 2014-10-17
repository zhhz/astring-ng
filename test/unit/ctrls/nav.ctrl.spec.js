describe('NavCtrl', function(){
  beforeEach(module('a-string'));

  var ctrl, deferred, todos, states, rootScope, todoList;
  beforeEach(inject(function($controller, _$rootScope_, $q, Todos, States){
    deferred = $q.defer();
    rootScope = _$rootScope_;
    ctrl = $controller('NavCtrl');
    todos = Todos;
    states = States;
    todoList =[{duration: 1}, {duration: 2}, {duration: 3}];
  }));

  it('#gotoToday() should set currentDate to today', function(){
    var today = moment().format('L');
    deferred.resolve(todoList);
    spyOn(todos, 'getTodos').andReturn(deferred.promise);

    ctrl.gotoToday();

    rootScope.$apply();
    expect(todos.getTodos).toHaveBeenCalledWith(today);
    expect(states.currentDate).toEqual(moment().format('L'));
    expect(states.todos).toEqual(todoList);
    expect(states.isBefore).toBeFalsy();
    expect(states.isAfter).toBeFalsy();
    expect(states.duration).toBe(6);
  });

  it('#gotoPrevDay() should set currentDate to previous day', function(){
    var selectedDate = moment(states.currentDate, 'MM-DD-YYYY').subtract(1, 'day').format('L')
    deferred.resolve(todoList);
    spyOn(todos, 'getTodos').andReturn(deferred.promise);

    ctrl.gotoPrevDay();

    rootScope.$apply();

    expect(todos.getTodos).toHaveBeenCalledWith(selectedDate);
    expect(states.currentDate).toEqual(selectedDate);
    expect(states.todos).toEqual(todoList);
    expect(states.isBefore).toBeTruthy();
    expect(states.isAfter).toBeFalsy();
    expect(states.duration).toBe(6);
  });

  it('#gotoNextDay() should set currentDate to next day', function(){
    var selectedDate = moment(states.currentDate, 'MM-DD-YYYY').add(1, 'day').format('L')
    deferred.resolve(todoList);
    spyOn(todos, 'getTodos').andReturn(deferred.promise);

    ctrl.gotoNextDay();

    rootScope.$apply();

    expect(todos.getTodos).toHaveBeenCalledWith(selectedDate);
    expect(states.currentDate).toEqual(selectedDate);
    expect(states.todos).toEqual(todoList);
    expect(states.isBefore).toBeFalsy();
    expect(states.isAfter).toBeTruthy();
    expect(states.duration).toBe(6);
  });


});
