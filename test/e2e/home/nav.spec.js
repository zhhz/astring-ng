var po = require('../pageobjects')();

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

