angular.module('a-string')
.controller('ToolsCtrl', ['States',
  function(States){
    console.log('Tools control');
    States.activeMenu = 'tools';
  }
]);
