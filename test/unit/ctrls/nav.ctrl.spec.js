describe('NavCtrl', function(){
  beforeEach(module('a-string'));

  var ctrl, states;
  beforeEach(inject(function($controller, States){
    ctrl = $controller('NavCtrl');
    states = States;
    spyOn(states, 'fetchTodos');
  }));

  it('#gotoToday() should set date to today', function(){
    var today = moment().format('L');

    ctrl.gotoToday();

    expect(states.fetchTodos.callCount).toEqual(1);
    expect(states.date).toEqual(moment().format('L'));
    expect(states.isBefore).toBeFalsy();
    expect(states.isAfter).toBeFalsy();
    expect(states.isToday).toBeTruthy();
  });

  it('#gotoPrevDay() should set date to previous day', function(){
    var selectedDate = moment(states.date, 'MM-DD-YYYY').subtract(1, 'day').format('L')

    ctrl.gotoPrevDay();

    expect(states.fetchTodos.callCount).toEqual(1);
    expect(states.date).toEqual(selectedDate);
    expect(states.isBefore).toBeTruthy();
    expect(states.isAfter).toBeFalsy();
  });

  it('#gotoNextDay() should set date to next day', function(){
    var selectedDate = moment(states.date, 'MM-DD-YYYY').add(1, 'day').format('L')

    ctrl.gotoNextDay();

    expect(states.fetchTodos.callCount).toEqual(1);
    expect(states.date).toEqual(selectedDate);
    expect(states.isBefore).toBeFalsy();
    expect(states.isAfter).toBeTruthy();
  });
});
