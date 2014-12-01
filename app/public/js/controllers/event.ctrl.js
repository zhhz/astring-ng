angular.module('a-string')
.controller('EventCtrl', ['$modalInstance', 'States', 'event',
  function ($modalInstance, States, event) {
    var self = this;
    self.states = States;
    self.event = event;

    self.createOrUpdate = function () {
      if(typeof(self.event.title) === 'object'){
        self.event.details = self.event.title;
        self.event.title = self.event.details.title;
      }
      if(self.event._id){
        States.updateEvent(self.event);
      }else{
        States.createEvent(self.event);
      }
      $modalInstance.close('yes');
    };

    self.cancel = function () { $modalInstance.dismiss('no'); };

    // config the datepicker
    self.dateOptions = {
      startingDay: 0,
      showWeeks: false
    };
    // config for popup
    self.format = 'yyyy-MM-dd';
    self.minDate = new Date();
    self.maxDate = moment().add(31, 'day');
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
