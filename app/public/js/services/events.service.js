angular.module('a-string')
.factory('Events', ['StorageManager',
  function(StorageManager){
    var service = {};

    service.createEvent = function(event){
      return StorageManager.storage().createEvent(event);
    };

    service.updateEvent = function(event){
      return StorageManager.storage().updateEvent(event);
    };

    return service;
  }
]);
