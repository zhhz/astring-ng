angular.module('a-string')
.controller('ToolsCtrl', ['$log', '$window', '$modal', 'States', 'Todos', 'Utils',
  function($log, $window, $modal, States, Todos, Utils){
    States.activeMenu = 'tools';
    var self = this;
    self.options = {
      editable: false,
      align: 'left',
      showCurrentTime: false
    };
    // NOTE: I can't not use the vis's DataSet, because it will break when
    //       using $watch in the directive
    self.data = [];

    // pre load the mapreduced time spent
    Todos.mrAll().then(function(resolved){
      self.todos = resolved.data;
      self.total = self.todos.reduce(function(v, t){return v + t.value;}, 0);
    }, function(reason){
      $log.error(reason);
    });

    self.timeline = function() {
      if(self.data.length === 0){
        Todos.timeline().then(function(resolved){
          _.each(resolved.data, function(todo){
            self.data.push({
              id      : todo._id,
              content : todo.title,
              start   : todo.completedAt
            });
          });
        }, function(reason){
          $log.error(reason);
        });
      }
    };

    self.history = function(song){
      var items = [];
      Todos.timeSpent(song).then(function(resolved){
        _.each(resolved.data, function(todo){
          items.push({
            id      : todo._id,
            content : todo.title + '<br />(' + Utils.formatSecondsAsTime(todo.duration) + ')',
            start   : todo.completedAt
          });
        });
        showTimeline(items);
      }, function(reason){
        $log.error(reason);
      });
    };

    function showTimeline(data){
      var modalInstance = $modal.open({
        templateUrl  : 'timelineGraph.html',
        controller   : 'TimelineCtrl',
        controllerAs : 'timelineCtrl',
        size         : 'lg',
        resolve      : { data : function(){ return data; },
                         options: function(){return self.options;} }
      });

      modalInstance.result.then(function () {
        // $log.info('Modal close at: ' + new Date());
      }, function () {
        // $log.info('Modal dismissed at: ' + new Date());
      });
    }
  }
]);
