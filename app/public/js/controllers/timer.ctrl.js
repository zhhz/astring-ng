angular.module('a-string')
.controller('TimerCtrl', ['$scope', 'Metronome',
  function($scope, Metronome){
    $scope.timerOn = false;
    $scope.elapse  = 0;

    function updateTimer(){
      $scope.elapse += 1;
      $scope.$digest();
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
