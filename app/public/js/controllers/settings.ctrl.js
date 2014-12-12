angular.module('a-string')
.controller('SettingsCtrl', ['States',
  function(States){
    console.log('Setting control');
    States.activeMenu = 'settings';
  }
]);
