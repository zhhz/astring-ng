describe('TodoCtrl', function(){
  beforeEach(module('a-string'));
  var ctrl, states;

  beforeEach(inject(function($controller, States){
    spyOn(States, 'init');
    ctrl = $controller('TodoCtrl');
    states = States;
  }));

  it('should init States service', function(){
    expect(states.init.callCount).toEqual(1);
    expect(ctrl.states).toEqual(states);
  });
});
