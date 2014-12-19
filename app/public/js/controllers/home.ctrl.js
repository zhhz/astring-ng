angular.module('a-string')
.controller('HomeCtrl', ['States', 'Todos', 'Events', '$modal', '$log', '$location',
  function(States, Todos, Events, $modal, $log, $location){
    var self = this;
    States.activeMenu = 'home';
    States.init();

    var dayClick = function(){
      $location.path('/todos');
    };

    var eventRender = function(view, element){
      // $log.debug('view changed: ' + view.start, view.end);
    };

    var eventClick = function(event, jsEvent, view){
      var modalInstance = $modal.open({
        templateUrl  : 'eventForm.html',
        controller   : 'EventCtrl',
        controllerAs : 'eventCtrl',
        backdrop     : 'static',
        size         : 'sm',
        resolve      : { event : function(){ return event; } }
      });

      modalInstance.result.then(function () {
      }, function () {
      });
    };

    // when you click next/pre on the full calendar or change view
    var loadTasks = function (from, to, timezone, callback){
      Todos.getAggregateTodos(from.format('YYYY-MM-DD'), to.format('YYYY-MM-DD'))
        .then(function(resolved){
          // NOTE: the model is the aggregate results
          var tasks = [];
          var total = 0, date;
          _.each(resolved.data, function(t){
            date = t._id;
            total += t.value;
            // build the event which the fullcalendar can understand
            var te = {
              title: '✔ ' + formatSecondsAsTime(t.value),
              allDay: true,
              start: new Date(date.year, date.month, date.day)
            };
            tasks.push(te);
          });
          callback(tasks);
        }, function(reason){
          $log.error(reason);
        });
    };

    self.uiConfig = {
      calendar   : {
        height   : 450,
        editable : true,
        header   : {
          left   : 'today prev,next',
          center : '',
          right  : 'title'
        },
        eventClick  : eventClick,
        droppable   : false,
        eventRender : eventRender,
        dayClick    : dayClick,
        events      : loadTasks
      }
    };


    function formatSecondsAsTime(seconds) {
      var hours, hoursString, minutes, minutesString, secondsInt, secs, secondsStr;
      secondsInt = parseInt(seconds, 10) || 0;
      secs = parseInt(secondsInt % 60, 10);
      secondsStr = secs > 9 ? secs : '0' + secs;
      hours = parseInt(secondsInt / 60 / 60, 10);
      minutes = parseInt((secondsInt / 60) % 60, 10);
      hoursString = hours > 9 ? hours : '0' + hours;
      minutesString = minutes > 9 ? minutes : '0' + minutes;
      return hoursString + ':' + minutesString + ':' + secondsStr;
    }
  }
]);
