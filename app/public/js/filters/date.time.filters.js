angular.module('a-string')
.filter('secondsToTime', [function(){
  var filter = function(seconds){
    var hours, hoursString, minutes, minutesString, secondsInt, secs, secondsStr;
    secondsInt = parseInt(seconds, 10) || 0;
    secs = parseInt(secondsInt % 60, 10);
    secondsStr = secs > 9 ? secs : '0' + secs;
    hours = parseInt(secondsInt / 60 / 60, 10);
    minutes = parseInt((secondsInt / 60) % 60, 10);
    hoursString = hours > 9 ? hours : '0' + hours;
    minutesString = minutes > 9 ? minutes : '0' + minutes;
    return hoursString + ':' + minutesString + ':' + secondsStr;
  };
  return filter;
}]);
