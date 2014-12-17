angular.module('a-string')
.factory('Events', ['$q', '$log', 'StorageManager',
  function($q, $log, StorageManager){
    var service = {};
    var _start, _from, _to;

    service.calendarEvents = [];// processed events for calendar
    service.todoEvents = []; // processed events for todo list for the given day

    // I want return a promise so I can handle the returned events and pipe it to Fullcalendar
    service.fetchEvents = function(from, to){
      while(service.calendarEvents.length > 0){ service.calendarEvents.pop();}
      _start = null;

      var deferred = $q.defer();
      StorageManager.storage().getEvents(from, to)
        .then(function(resolved){
          deferred.resolve(_processEvents(resolved.data, from, to));
        }, function(reason){
          deferred.reject(reason);
        });
      return deferred.promise;
    };

    // this is mainly called from States service, to get only the given day's events
    service.getEvents = function(from, to){
      // NOTE:
      //   1. I can't assign a new empty [] to calendarEvents, because it is referenced in Fullcalendar eventSources
      //   2. this is the fasted soluion I know
      while(service.calendarEvents.length > 0){ service.calendarEvents.pop();}
      while(service.todoEvents.length > 0){ service.todoEvents.pop();}

      // because we only allowed to schedule one month ahead in the calendar
      _start = from;
      _from = moment(from, 'YYYY-MM-DD').subtract(1, 'month').format('YYYY-MM-DD');
      _to   = moment(to, 'YYYY-MM-DD').add(1, 'month').format('YYYY-MM-DD');

      StorageManager.storage().getEvents(_from, _to)
      .then(function(resolved){
        processEvents(resolved.data, _from, _to);
      }, function(reason){
        $log.error(reason);
      });
    };

    service.createEvent = function(event){
      StorageManager.storage().createEvent(event).then(function(resolved){
        processEvents([resolved.data], _from, _to);
      }, function(reason){
        $log.error(reason);
      });
    };

    service.deleteEvent = function(event){
      StorageManager.storage().deleteEvent(event).then(function(resolved){
        _.remove(service.calendarEvents, function(e){return e._id === event._id;});
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
      _.remove(service.calendarEvents, function(e){return e._id === event._id;});

      StorageManager.storage().updateEvent(event).then(function(resolved){
        processEvents([resolved.data], _from, _to);
      }, function(reason){
        $log.error(reason);
      });
    };

    ////////////////////////////////////////////////////////////////////////////
    // Helper functions for processing events
    // TODO: refactor DRY
    ////////////////////////////////////////////////////////////////////////////

    // this function is called from the calendar ctrl, only for handling calendar events
    function _processEvents(events, from, to){
      _from = moment(from, 'YYYY-MM-DD').subtract(1, 'month').format('YYYY-MM-DD');
      _to   = moment(to, 'YYYY-MM-DD').add(1, 'month').format('YYYY-MM-DD');

      _.each(events, function(e){
        if(!e.isRepeative){
          service.calendarEvents.push(_dupEvent(e.start, e));
        }else{
          var events_ = populateRepeatEvent(e, from, to);
          _.forEach(events_, function(e){
            service.calendarEvents.push(_dupEvent(e.start, e));
          });
        }
      });
      return service.calendarEvents;
    }


    // this function is called from todo/states service, for handling the event type tasks
    function processEvents(events, from, to){
      from = (new Date(from)).getTime();
      to = (new Date(to + ' 23:59:59')).getTime();

      // holds the regular and populated events
      _.each(events, function(e){
        if(!e.isRepeative){
          service.calendarEvents.push(_dupEvent(e.start, e));
          if(_start && moment(e.start).format('YYYY-MM-DD') === _start){
            service.todoEvents.push(e);
          }
        }else{
          var events_ = populateRepeatEvent(e, from, to);
          _.forEach(events_, function(e){
            service.calendarEvents.push(e);
            //FIXME: this is a performance hit
            if(_start && moment(e.start).format('YYYY-MM-DD') === _start){
              service.todoEvents.push(e);
            }
          });
        }
      });
    }

    var DAY_IN_MIL_SEC = 60 * 60 * 24 * 1000,
        WEEK_IN_MIL_SEC = 60 * 60 * 24 * 1000 * 7;
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
        isRepeative: event.isRepeative,
        repeat: event.repeat,
        allDay: true,
        _orig: event // save a original copy of the event, which will be used when updating the event
      };
    }

    return service;
  }
]);
