/*
<div
  vis-graph
  data="toolsCtrl.graph.data"
  options="toolsCtrl.graph.options"
  event="select"
  callback="toolsCtrl.callbackFunction(params)"
  style="width: 100%; height: 600px"></div>
*/
angular.module('a-string')
.directive('visNetwork', [function() {
  return {
    restrict: 'A',
    scope: {
      data: '=data',
      options: '=options',
      event: '@event',
      callback: '&'
    },
    link: function(scope, element, attrs) {
      var container = element[0];
      var buildGraph = function(scope) {
        var graph = null;
        graph = new vis.Network(container, scope.data, scope.options);
        return graph.on(scope.event, function(properties) {
            if (properties.nodes.length !== 0) {
              scope.callback({params: properties});
            }
        });
      };
      scope.$watch('scope.data', function(newval, oldval) {
        buildGraph(scope);
      }, true);
    }
  };
}])
.directive('visTimeline', [function() {
  return {
    restrict: 'A',
    scope: {
      data: '=data',
      options: '=options',
      event: '@event',
      callback: '&'
    },
    link: function($scope, element, attrs) {
      var container = element[0], graph = null;
      $scope.$watch('data', function(newval, oldval) {
        if(graph !== null){ graph.destroy(); }

        graph = new vis.Timeline(container, $scope.data, $scope.options);
        graph.on($scope.event, function(properties) {
            if (properties.nodes.length !== 0) {
              $scope.callback({params: properties});
            }
        });
      }, true);
    }
  };
}])
.directive('visGraph', [function() {
  return {
    restrict: 'AE',
    scope: {
      data: '=data',
      options: '=options',
      event: '@event',
      callback: '&'
    },
    link: function(scope, element, attrs) {
      var graph = new vis.Graph3d(element[0], scope.data, scope.options);
      graph.on(scope.event, function(properties) {
        if (properties.nodes.length !== 0) {
          scope.callback({params: properties});
        }
      });
    }
  };
}]);
