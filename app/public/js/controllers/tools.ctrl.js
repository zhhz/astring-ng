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
      self.options = {
        xLabel: 'Date',
        xStep: 1,
        yLabel: 'Month',
        yStep: 1,
        zLabel: 'Year',
        zStep: 1,
        width:  '820px',
        height: '450px',
        style: 'dot-size',
        showPerspective: false,
        showGrid: true,
        keepAspectRatio: false,
        legendLabel:'Min',
        verticalRatio: 0.3,
        cameraPosition: {
          horizontal: -0.54,
          vertical: 0.5,
          distance: 1.6
        }
      };

      Todos.timeSpent(song).then(function(resolved){
        _.each(resolved.data, function(todo){
          var date = moment(todo.completedAt);
          items.push({
            x: date.date(),
            y: date.month() + 1,
            z: date.year(),
            style: todo.duration / 60
          });
        });
        showGraph(items, '3d', song);
      }, function(reason){
        $log.error(reason);
      });
    };

    function showGraph(data, graph, song){
      var modalInstance = $modal.open({
        templateUrl  : 'timelineGraph.html',
        controller   : 'TimelineCtrl',
        controllerAs : 'timelineCtrl',
        size         : 'lg',
        resolve      : {
                         data : function(){ return data; },
                         options: function(){return self.options;},
                         graph: function(){return graph || '2d';},
                         song: function(){return song || 'Time Spent';}
                       }
      });

      modalInstance.result.then(function () {
        // $log.info('Modal close at: ' + new Date());
      }, function () {
        // $log.info('Modal dismissed at: ' + new Date());
      });
    }
/*
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
        showGraph(items);
      }, function(reason){
        $log.error(reason);
      });
    };
*/
  }
]);
