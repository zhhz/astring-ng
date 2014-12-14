angular.module('a-string')
.controller('EventCtrl', ['$modalInstance', 'States', 'Events', 'event',
  function ($modalInstance, States, Events, event) {
    var self = this;
    self.states = States;
    if(!event._orig){
      self.event = event;
    }else{
      self.event = event._orig;
    }

    self.createOrUpdate = function () {
      if(typeof(self.event.title) === 'object'){
        self.event.details = self.event.title;
        self.event.title = self.event.details.title;
      }
      if(self.event._id){
        Events.updateEvent(self.event);
      }else{
        Events.createEvent(self.event);
      }
      $modalInstance.close('yes');
    };

    self.cancel = function () { $modalInstance.dismiss('no'); };

    self.delete = function() {
      Events.deleteEvent(event);
      $modalInstance.close('yes');
    };

    // config the datepicker
    self.dateOptions = {
      startingDay: 0,
      showWeeks: false
    };

    // config for popup
    self.format = 'yyyy-MM-dd';
    self.minDate = new Date();
    self.maxDate = moment().add(180, 'day');
    self.btnBar = false;

    self.openFrom = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      self.fromOpened = true;
    };
    self.openTo = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      self.toOpened = true;
    };

  }
]);
