angular.module('a-string')
.controller('CalendarCtrl', ['$log', '$modal', 'States',
  function($log, $modal, States){
    States.activeMenu = 'calendar';

    var self = this;
    self.eventSources = [States.events];

    var alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
      self.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };
    var alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
      self.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };

    var eventRender = function(view, element){
      $log.debug('view changed: ' + view.start, view.end);
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
        resolve      : {
          event      : function(){
            return _.find(States._events, function(e){return e._id === event._id;});
          }
        }
      });

      modalInstance.result.then(function () {
        $log.info('Modal close at: ' + new Date());
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    self.uiConfig = {
      calendar   : {
        height   : 450,
        editable : true,
        header   : {
          left   : 'title',
          center : '',
          right  : 'today prev,next'
        },
        eventClick  : eventClick,
        eventDrop   : alertOnDrop,
        eventResize : alertOnResize,
        eventRender : eventRender,
        dayClick    : dayClick
      }
    };

  }
]);
