angular.module('a-string')
.controller('CalendarCtrl', ['$log', 'States',
  function($log, States){
    var self = this;

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    var events = [
      {title: 'All Day Event',start: new Date(y, m, 1)},
      {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
      {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
      {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
      {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
      {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
    ];

    self.eventSources = [events];

    var alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
      self.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };
    var eventClick = function( date, jsEvent, view){
      self.alertMessage = (date.title + ' was clicked');
    };
    var alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
      self.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };

    var eventRender = function(view, element){
      $log.debug('view changed: ' + view.start, view.end);
    };

    var dayClick = function(){
    };

    self.addEvent = function() {
      self.events.push({
        title: 'Open Sesame',
        start: new Date(y, m, 28),
        end: new Date(y, m, 29),
        className: ['openSesame']
      });
    };

    self.remove = function(index) {
      self.events.splice(index,1);
    };

    self.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'title',
          center: '',
          right: 'today prev,next'
        },
        eventClick: eventClick,
        eventDrop: alertOnDrop,
        eventResize: alertOnResize,
        eventRender: eventRender
      }
    };

  }
]);
