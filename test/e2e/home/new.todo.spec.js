var po = require('../pageobjects')();

describe('New todo input on main page', function(){
  var input;
  beforeEach(function(){
    po.open();
    input = po.newTodoInput();
  });

  it('should show placeholder', function(){
    expect(po.newTodoInput().getAttribute('placeholder')).toEqual('What needs to be done?');
  });

  it('should be able to choose from the dropdown list(typeahead) when start typing gavotte', function(){
    input.sendKeys('gavotte');
    var songs = po.songList();
    expect(songs.count()).toEqual(7);

    input.sendKeys(protractor.Key.ENTER);
    expect(input.getAttribute('value')).toEqual('Gavotte');

    input.sendKeys(protractor.Key.ENTER);
    expect(input.getAttribute('value')).toEqual('');
  });

  it('should be able to input a todo without choose from the dropdown', function(){
    input.sendKeys('unknown song');
    var songs = po.songList();
    expect(songs.count()).toEqual(0);

    input.sendKeys(protractor.Key.ENTER);
    expect(input.getAttribute('value')).toEqual('');
  });

  it('should be cleared after created a new todo', function(){
    input.sendKeys('twinkle');
    input.sendKeys(protractor.Key.ENTER);
    input.sendKeys(protractor.Key.ENTER);
    expect(input.getAttribute('value')).toEqual('');
    expect(po.newTodoInput().getAttribute('placeholder')).toEqual('What needs to be done?');
  });
});
