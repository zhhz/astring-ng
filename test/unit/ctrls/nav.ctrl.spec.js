describe('NavCtrl', function(){
  beforeEach(module('a-string'));

  var ctrl, states;
  beforeEach(inject(function($controller, States){
    ctrl = $controller('NavCtrl');
    states = States;
    states.init();
    spyOn(states, 'fetchTodos');
  }));

  it('#gotoToday() should set date to today', function(){
    var today = moment().format('YYYY-MM-DD');

    ctrl.gotoToday();

    expect(states.fetchTodos.callCount).toEqual(1);
    expect(states.date).toEqual(moment().format('YYYY-MM-DD'));
    expect(states.isBefore).toBeFalsy();
    expect(states.isAfter).toBeFalsy();
    expect(states.isToday).toBeTruthy();
  });

  it('#gotoPrevDay() should set date to previous day', function(){
    var selectedDate = moment(states.date, 'YYYY-MM-DD').subtract(1, 'day').format('YYYY-MM-DD')

    ctrl.gotoPrevDay();

    expect(states.fetchTodos.callCount).toEqual(1);
    expect(states.date).toEqual(selectedDate);
    expect(states.isBefore).toBeTruthy();
    expect(states.isAfter).toBeFalsy();
  });

  it('#gotoNextDay() should set date to next day', function(){
    var selectedDate = moment(states.date, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD')

    ctrl.gotoNextDay();

    expect(states.fetchTodos.callCount).toEqual(1);
    expect(states.date).toEqual(selectedDate);
    expect(states.isBefore).toBeFalsy();
    expect(states.isAfter).toBeTruthy();
  });
});
