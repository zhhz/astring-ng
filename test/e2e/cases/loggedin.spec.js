var po = require('../pageobjects')(),
    moment = require('moment'),
    mongoose = require('mongoose');

describe('Nav section on the main page(logged in)', function() {
  beforeEach(function(){ po.open(); po.login(); po.brandLink().click(); });
  afterEach(function(){ po.logoutLink().click(); });

  it('should show logout link on the nav', function(){
    expect(po.logoutLink().isPresent()).toBeTruthy();
    expect(po.loginLink().isPresent()).toBeFalsy();
  });

  it('should show current date on left top of the page', function() {
    expect(po.calendarBtn().getText()).toEqual(moment().format('YYYY-MM-DD'));
    expect(po.calendarBtn().getAttribute('class')).toContain('btn-info');
  });

  it('should show yesterday\'s date', function(){
    po.prevBtn().click();
    var selectedDate = moment().subtract(1, 'day').format('YYYY-MM-DD')
    expect(po.calendarBtn().getText()).toEqual(selectedDate);
    expect(po.calendarBtn().getAttribute('class')).toContain('btn-danger');
  });

  it('should show tomorrow\'s date', function(){
    po.nextBtn().click();
    var selectedDate = moment().add(1, 'day').format('YYYY-MM-DD')
    expect(po.calendarBtn().getText()).toEqual(selectedDate);
    expect(po.calendarBtn().getAttribute('class')).toContain('btn-warning');
  });

  it('should show today\'s date', function(){
    po.nextBtn().click();
    var selectedDate = moment().add(1, 'day').format('YYYY-MM-DD')
    expect(po.calendarBtn().getText()).toEqual(selectedDate);

    po.todayBtn().click();
    expect(po.calendarBtn().getText()).toEqual(moment().format('YYYY-MM-DD'));

    po.prevBtn().click();
    selectedDate = moment().subtract(1, 'day').format('YYYY-MM-DD')
    expect(po.calendarBtn().getText()).toEqual(selectedDate);

    po.todayBtn().click();
    expect(po.calendarBtn().getText()).toEqual(moment().format('YYYY-MM-DD'));
    expect(po.calendarBtn().getAttribute('class')).toContain('btn-info');
  });

});

var reset_test_db = function(){
  var Task = mongoose.model('Task');
  Task.remove({}, function(err){ // console.log(' => Tasks collection removed');
  });
}

describe('When user logged in', function(){

  beforeEach(function(){ po.open(); po.login(); po.brandLink().click(); });

  // 1. create todo for today
  it('should be able to create a new todo for today', function(){
    expect(po.activeTodoList().count()).toEqual(0);
    po.createTodo();
    expect(po.activeTodoList().count()).toEqual(1);
  });

  // 2. create todo for future
  it('should be able to create new todos for a future day', function(){
    expect(po.activeTodoList().count()).toEqual(0);
    po.nextBtn().click();
    po.createTodo();
    expect(po.activeTodoList().count()).toEqual(1);
  });

  // 3. can't create todo for past
  it('should not be able to create new todo for the past days', function(){
    expect(po.activeTodoList().count()).toEqual(0);
    po.prevBtn().click();
    expect(po.newTodoInput().isDisplayed()).toBeFalsy();
  });

  afterEach(function(){
    po.logoutLink().click();
    reset_test_db();
  });

});
