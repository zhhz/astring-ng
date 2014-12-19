angular.module('a-string')
.factory('Utils', ['States',
  function(States){
    var utils = {};

    utils.colorThemeByTime = function(time){
      if(time > 1800){// 30 min
        return {
          bg: '#00ff00',
          bd: '#006600',
          tx: '#002200'
        };
      }else if(time > 900){ // 15 min
        return {
          bg: '#00ff00',
          bd: '#006600',
          tx: '#002200'
        };
      }else{
        return {
          bg: '#00ff00',
          bd: '#006600',
          tx: '#002200'
        };
      }
    };

    utils.formatSecondsAsTime = function(seconds) {
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

    return utils;
  }
]);
