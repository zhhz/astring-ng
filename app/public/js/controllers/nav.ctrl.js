angular.module('a-string')
.controller('NavCtrl', ['$scope', 'Todos',
  function NavCtrl($scope, Todos){
    $scope.gotoCalendar = function(){console.log('TODO: goto calendar');};

    $scope.gotoPrevDay = function(){
      $scope.data.currentDate = moment($scope.data.currentDate, 'MM-DD-YYYY')
                            .subtract(1, 'day').format('L');
    };

    $scope.gotoToday = function(){
      $scope.data.currentDate = moment().format('L');
    };

    $scope.gotoNextDay = function(){
      $scope.data.currentDate = moment($scope.data.currentDate, 'MM-DD-YYYY')
                            .add(1, 'day').format('L');
    };

  }
]);
