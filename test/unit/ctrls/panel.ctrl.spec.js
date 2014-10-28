describe('PanelCtrl', function(){
  beforeEach(module('a-string'));

  var ctrl, states;
  beforeEach(inject(function($controller, States){
    ctrl = $controller('PanelCtrl', {States: States});
    states = States;
  }));

  it('should have the states', function(){
    expect(ctrl.states).toEqual(states);
  });
});
