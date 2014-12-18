angular.module('a-string')
.controller('HomeCtrl', ['States', 'Todos', 'Events',
  function(States, Todos, Events){
    var self = this;
    States.activeMenu = 'home';
    States.init();

    var dayClick = function(){
      self.alertMessage = 'Day clicked';
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
      Events.fetchEvents(from.format('YYYY-MM-DD'), to.format('YYYY-MM-DD'))
        .then(function(resolved){
          callback(resolved);
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
  }
]);
