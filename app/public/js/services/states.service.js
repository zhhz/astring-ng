angular.module('a-string')
.factory('States', ['$window', '$q', '$auth', 'Todos', 'Events', 'Songs', '$log', 'AlertService',
  function($window, $q, $auth, Todos, Events, Songs, $log, AlertService){
    var service = {};

    service.alert = AlertService;

    service.isAuthenticated = function(){
      return $auth.isAuthenticated();
    };

    service.displayName = function(){
      var tokenName = 'satellizer_token';
      var token = $window.localStorage[tokenName];
      var name = '';
      if (token) {
        if (token.split('.').length === 3) {
          var base64Url = token.split('.')[1];
          var base64 = base64Url.replace('-', '+').replace('_', '/');
          name = JSON.parse($window.atob(base64)).dis || '';
        }
      }
      return name;
    };

    service.init = function(){
      service.reset();
      if(!service.songs || _.isEmpty(service.songs)){
        Songs.getBooks().then(function(books){
          service.songs = books;
        }, function(reason){
          $log.error(reason);
        });
      }
      service.setDate(moment().format('YYYY-MM-DD'));
    };

    service.reset = function(){
      service.date = moment().format('YYYY-MM-DD');
      service.todos = [];
      service.eventTodos = Events.todoEvents;
      service.currentTodo = null;
      service.currentSongs = [];
      service.timerOn = false;
      service.elapse = 0;
      service.duration = 0;
    };

    service.setDate = function(date){
      if(!date){return null;}

      service.date = date;
      var today = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD');
      var selectedDate = moment(service.date, 'YYYY-MM-DD');
      service.isBefore = selectedDate.isBefore(today);
      service.isAfter = selectedDate.isAfter(today);
      service.isToday = selectedDate.isSame(today);

      service.fetchTodos();
    };

    // ============== TODO ===================================
    service.fetchTodos = function(){
      Todos.getTodos(service.date)
        .then(function(resolved){
          service.todos = resolved.data;
          service.duration = _.reduce(resolved.data, function(result, v, k){
            return result + v.duration;
          }, 0);
        }, function(reason){
          $log.error(reason);
        });

      Events.getEvents(service.date, service.date);
    };

    service.toggle = function(todo){
      if(service.currentTodo === todo){
        service.currentTodo = null;
        service.currentSongs = [];
      }else{
        Songs.getSongs(todo).then(function(res){
          service.currentSongs = res.data;
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
      if(!$auth.isAuthenticated()){
        AlertService.set('Congratulations! You\'v completed the todo. You can upload to the server after you log in.');
      }
    };

    service.removeTodo = function (todo) {
      if(service.currentTodo === todo){
        service.toggle(todo);
      }
      Todos.removeTodo(todo)
        .then(function(resolved){
          _.remove(service.todos, function(t){return t._id === todo._id;});
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
        service.todos.push(resolved.data);
      }, function(reason){
        $log.error(reason);
      });
    };

    service.doneEvent = function(event){
      var todo         = Todos.newTodo();
      todo.title       = event.title;
      todo.startDate   = moment(event.start).format('YYYY-MM-DD');
      todo.completed   = true;
      todo.completedAt = (new Date()).getTime();
      todo.duration    = service.elapse;
      todo.refId       = event._id;

      // 1. create a completed todo
      Todos.createTodo(todo).then(function(resolved){
        service.todos.push(resolved.data);

        // 2. update the eventTodos
        _.remove(service.eventTodos, function(e){
          return e._id === event._id;
        });
        // 3. clear the timer
        service.elapse = 0;
      }, function(reason){
        $log.error(reason);
      });

    };

    // =======================================================
    function eventIncompletedTodos(events){
      _.map(events, function(e){
        // if the event task is done
        var find = _.find(service.todos, function(todo){return todo.refId === e._id;});
        if(!find && moment(e.start).format('YYYY-MM-DD') === service.date){
          service.eventTodos.push(e);
        }
      });
    }

    return service;
  }
]);
