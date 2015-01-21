angular.module('a-string')
.controller('TimelineCtrl', ['$log','$modalInstance', 'data', 'options', 'graph', 'song',
  function($log, $modalInstance, data, options, graph, song){
    var self = this;

    self.ok = function() { $modalInstance.close('yes'); };
    self.data = data;
    self.options = options;
    self.graph = graph;
    self.title = song;
  }
]);
