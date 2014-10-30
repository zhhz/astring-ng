angular.module('a-string')
.controller('NavCtrl', ['States', 'Todos',
  function NavCtrl(States, Todos){
    this.states = States;

    var self = this;
    self.gotoCalendar = function(){console.log('TODO: goto calendar');};

    self.gotoPrevDay = function(){
      States.setDate(moment(States.date, 'MM-DD-YYYY')
                            .subtract(1, 'day').format('L'));
    };

    self.gotoToday = function(){
      States.setDate(moment().format('L'));
    };

    self.gotoNextDay = function(){
      States.setDate(moment(States.date, 'MM-DD-YYYY')
                            .add(1, 'day').format('L'));
    };

  }
]);
