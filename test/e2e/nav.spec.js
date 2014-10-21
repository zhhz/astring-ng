var moment = require('moment')
    po     = require('./pageobjects')();

describe('Nav section on the main page', function() {
  beforeEach(function(){
    po.open();
  });

  it('should show current date on left top of the page', function() {
    expect(po.calendarBtn().getText()).toEqual(moment().format('L'));
    expect(po.calendarBtn().getAttribute('class')).toContain('btn-info');
  });

  it('should show yesterday\'s date', function(){
    po.prevBtn().click();
    var selectedDate = moment().subtract(1, 'day').format('L')
    expect(po.calendarBtn().getText()).toEqual(selectedDate);
    expect(po.calendarBtn().getAttribute('class')).toContain('btn-danger');
  });

  it('should show tomorrow\'s date', function(){
    po.nextBtn().click();
    var selectedDate = moment().add(1, 'day').format('L')
    expect(po.calendarBtn().getText()).toEqual(selectedDate);
    expect(po.calendarBtn().getAttribute('class')).toContain('btn-warning');
  });

  it('should show today\'s date', function(){
    po.nextBtn().click();
    var selectedDate = moment().add(1, 'day').format('L')
    expect(po.calendarBtn().getText()).toEqual(selectedDate);

    po.todayBtn().click();
    expect(po.calendarBtn().getText()).toEqual(moment().format('L'));

    po.prevBtn().click();
    selectedDate = moment().subtract(1, 'day').format('L')
    expect(po.calendarBtn().getText()).toEqual(selectedDate);

    po.todayBtn().click();
    expect(po.calendarBtn().getText()).toEqual(moment().format('L'));
    expect(po.calendarBtn().getAttribute('class')).toContain('btn-info');
  });
});
