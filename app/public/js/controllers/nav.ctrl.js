angular.module('a-string')
.controller('NavCtrl', ['States', 'Todos',
  function NavCtrl(States, Todos){
    this.states = States;

    this.gotoCalendar = function(){console.log('TODO: goto calendar');};

    this.gotoPrevDay = function(){
      States.setDate(moment(States.date, 'YYYY-MM-DD')
                            .subtract(1, 'day').format('YYYY-MM-DD'));
    };

    this.gotoToday = function(){
      States.setDate(moment().format('YYYY-MM-DD'));
    };

    this.gotoNextDay = function(){
      States.setDate(moment(States.date, 'YYYY-MM-DD')
                            .add(1, 'day').format('YYYY-MM-DD'));
    };
  }
]);
