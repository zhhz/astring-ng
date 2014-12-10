angular.module('a-string')
.factory('States', ['$q', '$auth', 'Todos', 'Events', 'Songs', '$log', 'AlertService',
  function($q, $auth, Todos, Events, Songs, $log, AlertService){
    var service = {};

    service.alert = AlertService;

    service.isAuthenticated = function(){
      return $auth.isAuthenticated();
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
      service._events = [];// local cache for un-processed events
      service.events = []; // processed/populated events, ready for render in calendar
      service.eventTasks = []; // processed/populated events, ready for render on tasks/todo screen
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
          // then we fetch the events
          service.fetchEvents();
        }, function(reason){
          $log.error(reason);
        });
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

        // 2. update the eventTasks
        _.remove(service.eventTasks, function(e){
          return e._id === event._id;
        });
      }, function(reason){
        $log.error(reason);
      });


    };


    // ============== EVENTS ===================================
    service.fetchEvents = function(from, to){
      service.eventTasks = [];

      // because we only allowed to schedule one month ahead in the calendar
      if(!from) {
        from = moment(service.date, 'YYYY-MM-DD').subtract(1, 'month').format('YYYY-MM-DD');
        to   = moment(service.date, 'YYYY-MM-DD').add(1, 'month').format('YYYY-MM-DD');
      }

      Events.getEvents(from, to).then(function(resolved){
        // we keep a copy of original events
        service._events = resolved.data;
        // then we have an array of populated (e.g. repeative) events
        service.events = processEvents(resolved.data, from ,to);
        _eventTasksForTheDay(service.events);
      }, function(reason){
        $log.error(reason);
      });
    };

    service.createEvent = function(event){
      Events.createEvent(event).then(function(resolved){
        service._events.push(resolved.data);
        // re-populated (e.g. repeative) events
        var newEvents = processEvents([resolved.data]);
        _eventTasksForTheDay(newEvents);
      }, function(reason){
        $log.error(reason);
      });
    };

    service.updateEvent = function(event){
      // FIXME: I have to make the remove happens earlier, because if it in the resolve callback(which it should be)
      //  all the events will be clear from the event view in FullCalender
      //  @see directives/calendar.js
      //  eventsWatcher.onRemoved = function(event) {
      //    calendar.fullCalendar('removeEvents', function(e) {
      //      return e._id === event._id;
      //    });
      //  };
      _.remove(service.events, function(e){return e._id === event._id;});

      // merge the properties
      var _e = _.find(service._events, function(e){return e._id === event._id;});
      _.each(_e, function(v, k){ _e[k] = event[k]; });

      Events.updateEvent(_e).then(function(resolved){
        // remove the cashed event
        _.remove(service._events, function(e){ return e._id === event._id; });
        _.remove(service.eventTasks, function(e){return e._id === event._id;});

        // push the updated event to the local cache
        service._events.push(resolved.data);
        var newEvents = processEvents([resolved.data]);
        _eventTasksForTheDay(newEvents);
      }, function(reason){
        $log.error(reason);
      });
    };

    service.deleteEvent = function(event){
      var _e = _.find(service._events, function(e){return e._id === event._id;});
      Events.deleteEvent(event).then(function(resolved){
        _.remove(service._events, function(e){ return e._id === _e._id;});
        _.remove(service.events, function(e){return e._id === _e._id;});
        _.remove(service.eventTasks, function(e){return e._id === _e._id;});
      }, function(reason){
        $log.error(reason);
      });
    };

    ////////////////////////////////////////////////////////////////////////////
    // Helper functions for processing events
    // TODO: refactor DRY
    ////////////////////////////////////////////////////////////////////////////
    var DAY_IN_MIL_SEC = 60 * 60 * 24 * 1000,
        WEEK_IN_MIL_SEC = 60 * 60 * 24 * 1000 * 7;
    function processEvents(events, from, to){
      if(!from) {
        from = moment(service.date, 'YYYY-MM-DD').subtract(1, 'month').format('YYYY-MM-DD');
        to   = moment(service.date, 'YYYY-MM-DD').add(1, 'month').format('YYYY-MM-DD');
      }
      from = (new Date(from)).getTime();
      to = (new Date(to + ' 23:59:59')).getTime();

      // holds the regular and populated events
      var _processedEvents = [];
      _.each(events, function(e){
        if(!e.isRepeative){
          _processedEvents.push(_dupEvent(e.start, e));
        }else{
          var events_ = populateRepeatEvent(e, from, to);
          _.forEach(events_, function(e){
            _processedEvents.push(e);
          });
        }
      });
      return _processedEvents;
    }

    function populateRepeatEvent(repeatEvent, from, to){
      var ret = [];
      var every, eventStart, eventEnd, mmnt, step, loop;
      switch(repeatEvent.repeat.frequency){
        case 'daily':
          every = repeatEvent.repeat.every;

          eventStart = (new Date(repeatEvent.start)).getTime();
          eventEnd = (new Date(repeatEvent.end)).getTime();
          loop = eventStart;
          for(;loop <= to; loop += every * DAY_IN_MIL_SEC){
            if(loop >= from && loop >= eventStart && loop <= eventEnd){
              ret.push(_dupEvent(loop, repeatEvent));
            }
          }
          break;
        case 'weekly':
          every = repeatEvent.repeat.every;
          eventStart = (new Date(repeatEvent.start)).getTime();
          eventEnd = (new Date(repeatEvent.end)).getTime();
          loop = eventStart;
          // loop = loop > eventStart ? loop : eventStart;
          for(;loop <= to; loop += every * WEEK_IN_MIL_SEC){
            if(loop >= from && loop >= eventStart && loop <= eventEnd){
              ret.push(_dupEvent(loop, repeatEvent));
            }
          }
          break;
        // TODO: no monthly allowed for now
        /*
        case 'monthly':
          every = repeatEvent.repeat.every;
          eventStart = (new Date(repeatEvent.start)).getTime();
          eventEnd = (new Date(repeatEvent.end)).getTime();
          loop = eventStart;
          mmnt = moment(loop);
          step = 0;
          for(;loop <= to; loop = step){
            if(loop >= from && loop >= eventStart && loop <= eventEnd){
              ret.push(_dupEvent(loop, repeatEvent));
            }
            step = moment(loop).add('M', every).toDate().getTime();
          }
          break;
        */
        default:
          break;
      }
      return ret;
    }

    function _dupEvent(mili, event){
      var date = new Date(mili);

      return {
        _id: event._id,
        title: event.title,
        start: date,
        end: date,
        allDay: true
      };
    }

    function _eventTasksForTheDay(events){
      _.map(events, function(e){
        // if the event task is done
        var find = _.find(service.todos, function(todo){return todo.refId === e._id;});
        if(!find && moment(e.start).format('YYYY-MM-DD') === service.date){
          service.eventTasks.push(e);
        }
      });
    }

    return service;
  }
]);
