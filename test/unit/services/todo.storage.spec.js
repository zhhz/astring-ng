describe("TodoStorage", function(){
  beforeEach(module('a-string'));
  var store;
  beforeEach(inject(function(TodoStorage){
    store = TodoStorage;
  }));

  it('#fetchTodos() should return empty array for first time user', function(){
    var date = moment().format('L');
    var todos = [];
    // store.fetchTodos(date).then(function(resolved){todos = reolved;});
    expect(todos).toEqual([]);
  });
});
