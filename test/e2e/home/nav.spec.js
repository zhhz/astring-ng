var moment = require('moment')
    po     = require('../pageobjects')();

describe('Nav section on the main page(not logged in)', function() {
  beforeEach(function(){ po.open(); });

  it('shouldn\'t show date nav on the page if not logged in', function() {
    expect(po.calendarBtn().isPresent()).toBeFalsy();
  });

  it('should show login link', function(){
    expect(po.loginLink().isDisplayed()).toBeTruthy();
    expect(po.logoutLink().isPresent()).toBeFalsy();
  });
});

describe('Nav section on the main page(logged in)', function() {
  beforeEach(function(){ po.open(); po.login(); });
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
