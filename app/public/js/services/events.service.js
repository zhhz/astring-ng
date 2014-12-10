angular.module('a-string')
.factory('Events', ['StorageManager',
  function(StorageManager){
    var service = {};

    service.getEvents = function(from, to){
      return StorageManager.storage().getEvents(from, to);
    };

    service.createEvent = function(event){
      return StorageManager.storage().createEvent(event);
    };

    service.updateEvent = function(event){
      return StorageManager.storage().updateEvent(event);
    };

    service.deleteEvent = function(event){
      return StorageManager.storage().deleteEvent(event);
    };

    return service;
  }
]);
