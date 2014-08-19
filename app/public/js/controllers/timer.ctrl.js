angular.module('a-string')
.controller('TimerCtrl', ['$scope', 'Metronome',
  function($scope, Metronome){
    $scope.timerOn = false;
    var metronome = Metronome.getInstance();

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
