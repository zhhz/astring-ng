angular.module('a-string')
.factory('States', ['Todos', 'Songs', '$log',
  function(Todos, Songs, $log){
    var service = {};

    service.date = moment().format('L');
    service.todos = [];
    service.songs = [];
    service.currentTodo = null;
    service.currentSongs = [];
    service.timerOn = false;
    service.elapse = 0;
    service.duration = 0;

    service.setDate = function(date){
      service.date = date;

      var today = moment(moment().format('L'), 'MM-DD-YYYY');
      var selectedDate = moment(service.date, 'MM-DD-YYYY');
      service.isBefore = selectedDate.isBefore(today, 'date');
      service.isAfter = selectedDate.isAfter(today, 'date');
      service.isToday = selectedDate.isSame(today);

      service.fetchTodos();
    };

    service.fetchTodos = function(){
      Todos.getTodos(service.date)
        .then(function(resolved){
          service.todos = resolved;
          service.duration = _.reduce(resolved, function(result, v, k){
            return result + v.duration;
          }, 0);
        }, function(reason){
          $log.error(reason);
        });
    };

    service.toggle = function(todo){
      if(service.currentTodo === todo){
        service.currentTodo = null;
        service.currentSongs = [];
      }else{
        Songs.getSongs(todo).then(function(songs){
          service.currentSongs = songs;
        });
        service.currentTodo = todo;
      }
    };

    service.doneTodo = function(todo){
      if(service.currentTodo === todo){
        service.toggle(todo);
      }

      todo.completed = true;
      todo.completedAt = (new Date()).getTime();
      todo.duration = service.elapse;
      Todos.updateTodo(todo)
        .then(function(resolved){
          service.elapse = 0;
        }, function(reason){
          $log.error(reason);
        });
    };

    service.removeTodo = function (todo) {
      if(service.currentTodo === todo){
        service.toggle(todo);
      }
      Todos.removeTodo(todo)
        .then(function(resolved){
          _.remove(service.todos, function(t){return t.id === todo.id;});
        }, function(reason){
          $log.error(reason);
        });
    };

    service.activateTodo = function(todo){
      var _duration = todo.duration;

      todo.completed = false;
      todo.completedAt = null;
      todo.duration = 0;

      Todos.updateTodo(todo)
        .then(function(resolved){
          service.elapse += _duration;
        }, function(reason){
          $log.error(reason);
        });
    };

    service.createTodo = function(todo){
      Todos.createTodo(todo).then(function(resolved){
        service.todos.push(resolved);
      }, function(reason){
        $log.error(reason);
      });
    };

    return service;
  }
]);
