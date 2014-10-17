describe("States service", function(){
  beforeEach(module('a-string'));

  var service;
  beforeEach(inject(function(States){ service = States; }));

  it("should init the States service", function(){
    var initStates = {
      todos       : [],
      currentDate : moment().format('L'),

      songs       : [],

      currentTodo : null,
      currentSongs: [],

      timerOn     : false,
      elapse      : 0,
      duration    : 0
    };
    expect(service).toEqual(initStates);
  });
});
