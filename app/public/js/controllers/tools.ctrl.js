angular.module('a-string')
.controller('ToolsCtrl', ['$log', '$window', '$modal', 'States', 'Todos', 'Utils',
  function($log, $window, $modal, States, Todos, Utils){
    States.activeMenu = 'tools';
    var self = this;

    // pre load the mapreduced time spent
    Todos.mrAll().then(function(resolved){
      self.todos = resolved.data;
      self.total = self.todos.reduce(function(v, t){return v + t.value;}, 0);
    }, function(reason){
      $log.error(reason);
    });

    self.timeline = function() {
      // load timeline
    };

    self.history = function(song){
      var items = new vis.DataSet({
        type: { start: 'ISODate', end: 'ISODate' }
      });

      Todos.timeSpent(song).then(function(resolved){
        _.each(resolved.data, function(todo){
          items.add({
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
      var options = {
        editable: false,
        align: 'left',
        showCurrentTime: false
      };

      var modalInstance = $modal.open({
        templateUrl  : 'timelineGraph.html',
        controller   : 'TimelineCtrl',
        controllerAs : 'timelineCtrl',
        size         : 'lg',
        resolve      : { data : function(){ return data; },
                         options: function(){return options;} }
      });

      modalInstance.result.then(function () {
        // $log.info('Modal close at: ' + new Date());
      }, function () {
        // $log.info('Modal dismissed at: ' + new Date());
      });
    }


    /*
      var data = null;
      var graph = null;
      // create the data table.
      data = new vis.DataSet();

      // create some shortcuts to math functions
      var sqrt = Math.sqrt;
      var pow = Math.pow;
      var random = Math.random;

      // create the animation data
      var imax = 100;
      for (var i = 0; i < imax; i++) {
        var x = pow(random(), 2);
        var y = pow(random(), 2);
        var z = pow(random(), 2);

        var dist = sqrt(pow(x, 2) + pow(y, 2) + pow(z, 2));
        var range = sqrt(2) - dist;

        data.add({x:x,y:y,z:z,style:range});
      }

      // specify options
      var options = {
        width:  '600px',
        height: '600px',
        style: 'dot-size',
        showPerspective: false,
        showGrid: true,
        keepAspectRatio: true,
        legendLabel:'value',
        verticalRatio: 1.0,
        cameraPosition: {
          horizontal: -0.54,
          vertical: 0.5,
          distance: 1.6
        }
      };

      self.callbackFunction = function(params) {
        $window.alert(angular.toJson(params) );
      };
      // create our graph
      self.graph = {
        data: data,
        options: options
      };
      */
  }
]);
