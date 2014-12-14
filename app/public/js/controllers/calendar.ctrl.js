angular.module('a-string')
.controller('CalendarCtrl', ['$log', '$modal', 'States', 'Events',
  function($log, $modal, States, Events){
    States.activeMenu = 'calendar';

    var self = this;

    var alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
      // self.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };
    var alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
      // self.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };

    var eventRender = function(view, element){
      // $log.debug('view changed: ' + view.start, view.end);
    };

    var dayClick = function(){
      self.alertMessage = 'Day clicked';
    };

    self.addEvent = function() {
      // show modal window ask if the user want to switch to today's todo list
      var modalInstance = $modal.open({
        templateUrl: 'eventForm.html',
        controller: 'EventCtrl',
        controllerAs: 'eventCtrl',
        backdrop: 'static',
        size: 'sm',
        resolve: {
          event: function(){
            return {
              start       : new Date(),
              end         : new Date(),
              isRepeative : false,
              repeat      : {
                frequency : 'daily',
                every     : 1
              }
            };
          }
        }
      });

      modalInstance.result.then(function () {
        $log.info('Modal close at: ' + new Date());
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
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
        $log.info('Modal close at: ' + new Date());
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };


    // this event sources will handle add/update/delte calendar event
    self.eventSources = [Events.calendarEvents];

    // when you click next/pre on the full calendar
    var loadEvents = function (from, to, timezone, callback){
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
        eventResize : alertOnResize,
        eventRender : eventRender,
        dayClick    : dayClick,
        // events      : Events.calendarEvents
        events      : loadEvents
      }
    };

  }
]);
