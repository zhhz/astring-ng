angular.module('a-string')
.controller('TimelineCtrl', ['$log','$modalInstance', 'data', 'options',
  function($log, $modalInstance, data, options){
    var self = this;

    self.ok = function() { $modalInstance.close('yes'); };
    self.data = data;
    self.options = options;

  }
]);
