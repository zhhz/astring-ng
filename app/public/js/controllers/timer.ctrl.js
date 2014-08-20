angular.module('a-string')
.controller('TimerCtrl', ['$scope', 'Metronome',
  function($scope, Metronome){
    $scope.timerOn = false;

    function updateTimer(){
      $scope.$apply(function(){
        $scope.timer.elapse   += 1;
        $scope.timer.duration += 1;
      });
    }

    var metronome = Metronome.getInstance();
    metronome.setUpdateTimerCb(updateTimer);


    $scope.toggleStart = function(){
      if($scope.timerOn){
        metronome.stopTimer();
        metronome.stopMetro();
      }else{
        metronome.startTimer();
        metronome.startMetro();
      }

      $scope.timerOn = !$scope.timerOn;
    };
  }
]);
