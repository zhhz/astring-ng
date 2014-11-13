angular.module('a-string')
.controller('NewTodoCtrl', ['Todos', 'States', '$log', '$modal',
  function NewTodoCtrl(Todos, States, $log, $modal){
    var self = this;
    self.states = States;

    self.addTodo = function () {
      if(!self.song){ return; }

      // why I have to check this? Because user can leave the screen and come
      // back the next day.
      var today = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD');
      var selectedDate = moment(States.date, 'YYYY-MM-DD');
      if(selectedDate.isBefore(today, 'date')){
      // if(selectedDate.isSame(today, 'date')){
        // show modal window ask if the user want to switch to today's todo list
        var modalInstance = $modal.open({
          templateUrl: 'myModalContent.html',
          controller: 'ModalInstanceCtrl',
          controllerAs: 'modalCtrl',
          size: 'sm' // lg
        });

        modalInstance.result.then(function () {
          $log.info('Modal close at: ' + new Date());
          States.setDate(moment().format('YYYY-MM-DD'));
          self.createTodo();
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      }else{
        self.createTodo();
      }
    };

    self.createTodo = function(){
      var newTodo = Todos.newTodo();
      newTodo.startDate = States.date;
      if(!self.song.title){
        newTodo.title = self.song.trim();
      }else{
        newTodo.title = self.song.title.trim();
        newTodo.song = self.song;
      }
      if (!newTodo.title.length) {
        return;
      }
      States.createTodo(newTodo);

      self.song = '';
    };

  }
])
.controller('ModalInstanceCtrl', ['$modalInstance', 'States',
  function ($modalInstance, States) {
    this.states = States;
    this.yes = function () { $modalInstance.close('yes'); };
    this.no = function () { $modalInstance.dismiss('no'); };
  }
]);
