module.exports = createPageObjects;

function createPageObjects(){
  var pos = {};
  pos.open = function() {
    browser.get('/');
  };

  // NAV section
  pos.calendarBtn = function(){ return element(by.id('calendar-btn')); };
  pos.prevBtn = function(){ return element(by.id('prev-btn')); }
  pos.nextBtn = function(){ return element(by.id('next-btn')); }
  pos.todayBtn = function(){ return element(by.id('today-btn')); }


  pos.getUncompletedListRows = function() {
    return element.all(by.repeater('team in teamListCtrl.teams'));
  };

  pos.getRankForRow = function(row) {
    return element(
      by.repeater('team in teamListCtrl.teams')
        .row(row).column('team.rank'));
  };

  pos.getNameForRow = function(row) {
    return element(
      by.repeater('team in teamListCtrl.teams')
        .row(row).column('team.name'));
  };

  pos.isLoginLinkVisible = function() {
    return element(by.css('.login-link')).isDisplayed();
  };

  pos.isLogoutLinkVisible = function() {
    return element(by.css('.logout-link')).isDisplayed();
  };

  return pos;
}
