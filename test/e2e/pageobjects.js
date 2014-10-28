module.exports = createPageObjects;

function createPageObjects(){
  var pos  = {};
  pos.open = function() { browser.get('/'); };

  //======== NAV section
  pos.calendarBtn = function() { return element(by.id('calendar-btn')); };
  pos.prevBtn     = function() {return element(by.id('prev-btn'));};
  pos.nextBtn     = function() {return element(by.id('next-btn'));};
  pos.todayBtn    = function() {return element(by.id('today-btn'));};

  //======== NEW todo input
  pos.newTodoInput = function() {return element(by.id('new-input'))};
  pos.goBtn        = function() {return element(by.id('go-btn'));};
  pos.songList     = function() {return element.all(by.repeater('match in matches'));};

  //======== ACTIVE todos section
  pos.activeTodoList    = function() {return element.all(by.repeater('todo in activeCtrl.states.todos'));};
  pos.doneBtnForRow     = function(row){ return pos.activeTodoList().get(row).element(by.css('.btn-success')); };
  pos.deleteBtnForRow   = function(row){ return pos.activeTodoList().get(row).element(by.css('.btn-default')); };
  pos.todoContentForRow = function(row){ return pos.activeTodoList().get(row).element(by.css('.form-control')); };

  //======== COMPLETED todo section
  pos.completedTodoList = function() {return element.all(by.repeater('todo in completedCtrl.states.todos'));};
  pos.undoBtnForRow     = function(row){ return pos.completedTodoList().get(row).element(by.css('.btn-danger')) };
  pos.btnLastRow        = function() {return pos.completedTodoList().last().element(by.css('.btn-danger'));};

  //======== Metronome/Panel section
  pos.soundFont       = function(){ return element(by.tagName('script'))};
  pos.upBtn           = function(){ return element(by.id('up-btn'));};
  pos.downBtn         = function(){ return element(by.id('down-btn'));};
  pos.soundFontScript = function(){ return element.all(by.tagName('script')).last();};
  pos.startBtn        = function(){ return element(by.id('start-btn'));};
  pos.elapse          = function(){ return element(by.binding('states.elapse'));};
  pos.duration        = function(){ return element(by.binding('panelCtrl.states.duration'));};
  pos.beatsCount      = function(){ return element(by.css('.beats')).all(by.tagName('td')).count();};
  pos.metroBtn        = function(){ return element(by.id('metro-btn'));};
  pos.melodyBtn       = function(){ return element(by.id('melody-btn'));};
  pos.accompanyBtn    = function(){ return element(by.id('accompany-btn'));};

  //======== common shared
  pos.sleep      = function(span){browser.sleep(span);};
  pos.createTodo = function(){
    pos.newTodoInput().sendKeys('gavott');
    pos.newTodoInput().sendKeys(protractor.Key.ENTER);
    pos.newTodoInput().sendKeys(protractor.Key.ENTER);
  };


  /*
  pos.getRankForRow = function(row) {
    return element(
      by.repeater('team in teamListCtrl.teams')
        .row(row).column('team.rank'));
  };

  pos.isLoginLinkVisible = function() {
    return element(by.css('.login-link')).isDisplayed();
  };
  */

  return pos;
}
