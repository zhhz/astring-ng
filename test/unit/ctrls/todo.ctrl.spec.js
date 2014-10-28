describe('TodoCtrl', function(){
  beforeEach(module('a-string'));
  var ctrl, states,
      songs = [
        { book: "Book1", category: "Suzuki", title: "Twinkle Variations" },
        { book: "Book1", category: "Suzuki", title: "Go Tell Aunt Rhody" }],
      todos = [
        { title: "Twinkle Variations" },
        { title: "Go Tell Aunt Rhody" }];

  beforeEach(inject(function($controller, States){
    ctrl = $controller('TodoCtrl', {songs: songs, todos: todos});
    states = States;
  }));

  it('should set the States service with the songs', function(){
    expect(states.songs).toEqual(songs);
  });

  it('should set the States service with the todos', function(){
    expect(states.todos).toEqual(todos);
  });

  it('should set the States service isToday', function(){
    expect(states.isToday).toBeTruthy;
  });
});
