angular.module('a-string')
.controller('NavCtrl', ['States', 'Todos',
  function NavCtrl(States, Todos){
    var self = this;
    self.gotoCalendar = function(){console.log('TODO: goto calendar');};

    self.gotoPrevDay = function(){
      States.currentDate = moment(States.currentDate, 'MM-DD-YYYY')
                            .subtract(1, 'day').format('L');
      fetchTodos();
    };

    self.gotoToday = function(){
      States.currentDate = moment().format('L');
      fetchTodos();
    };

    self.gotoNextDay = function(){
      States.currentDate = moment(States.currentDate, 'MM-DD-YYYY')
                            .add(1, 'day').format('L');
      fetchTodos();
    };

    function fetchTodos(){
      Todos.getTodos(States.currentDate)
        .then(function(resolved){
          States.todos = resolved;

          var today = moment(moment().format('L'), 'MM-DD-YYYY');
          var selectDate = moment(States.currentDate, 'MM-DD-YYYY');
          States.isBefore = selectDate.isBefore(today, 'date');
          States.isAfter = selectDate.isAfter(today, 'date');

          States.duration = _.reduce(resolved, function(result, v, k){
            return result + v.duration;
          }, 0);
        }, function(reason){
          console.log(reason);
        });
    }
  }
]);
