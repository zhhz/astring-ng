angular.module('a-string')
.controller('HomeCtrl', ['States', 'Todos', 'Events', 'Utils', '$modal', '$log', '$location',
  function(States, Todos, Events, Utils, $modal, $log, $location){
    var self = this;
    States.activeMenu = 'home';
    States.init();
    self.total = 0;

    var dayClick = function(date, e, view){
      States.activeMenu = 'todos';
      States.setDate(date.format('YYYY-MM-DD'));
      $location.path('/todos');
    };

    var eventRender = function(event, element, view){};

    // when you click next/pre on the full calendar or change view
    var loadTasks = function (from, to, timezone, callback){
      Todos.getAggregateTodos(from.format('YYYY-MM-DD'), to.format('YYYY-MM-DD'))
        .then(function(resolved){
          // NOTE: the model is the aggregate results
          var tasks = [];
          var total = 0, date;
          _.each(resolved.data, function(t){
            total += t.value;
            tasks.push(buildEvent(t));
          });

          self.total = total;
          callback(tasks);
        }, function(reason){
          $log.error(reason);
        });
    };

    self.uiConfig = {
      calendar   : {
        header   : {
          left   : 'today prev,next',
          center : '',
          right  : 'title'
        },
        droppable   : false,
        dayClick    : dayClick,
        events      : loadTasks
      }
    };

    // build the event which the fullcalendar can understand
    function buildEvent(task){
      var color = Utils.colorThemeByTime(task.value);
      return {
        title: '✔ ' + Utils.formatSecondsAsTime(task.value),
        allDay: true,
        start: new Date(task._id.year, task._id.month, task._id.day),
        backgroundColor: task.backgroudColor || color.bg,
        borderColor: task.borderColor || color.bd,
        textColor: task.textColor || color.tx
      };
    }

  }
]);
