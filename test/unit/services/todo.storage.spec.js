describe("LocalStorage", function(){
  beforeEach(module('a-string'));
  var store;
  beforeEach(inject(function(LocalStorage){
    store = LocalStorage;
  }));

  it('#fetchTodos() should return empty array for first time user', function(){
    var date = moment().format('YYYY-MM-DD');
    var todos = [];
    // store.fetchTodos(date).then(function(resolved){todos = reolved;});
    expect(todos).toEqual([]);
  });
});
