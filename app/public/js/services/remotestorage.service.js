angular.module('a-string')
.factory('RemoteStorage', ['$http',
  function($http){
    var service = {};

    //========== TODOS TABLE =======================================
    service.getTodo = function(id){
      return $http.get('/api/tasks/' + id);
    };

    service.fetchTodos = function(date){
      return $http.get('/api/tasks?date=' + date);
    };

    service.createTodo = function(todo){
      return $http.post('/api/tasks/', todo);
    };

    service.deleteTodo = function(todo){
      return $http.delete('/api/tasks/' + todo._id);
    };

    service.updateTodo = function(todo){
      return $http.put('/api/tasks/' + todo._id, todo);
    };

    service.todosMrByDay = function(from, to){
      return $http.get('/api/tasks/mrByDay?start=' + from + '&end=' + to);
    };

    service.todosMrAll = function(){
      return $http.get('/api/tasks/mrAll');
    };

    service.todoTimelines = function(song){
      if(!song){
        return $http.get('/api/tasks/timelines/');
      }else{
        return $http.get('/api/tasks/timelines/' + song);
      }
    };

    service.todoTimeSpent = function(song){
      if(!song){
        return $http.get('/api/tasks/timeSpent/');
      }else{
        return $http.get('/api/tasks/timeSpent/' + song);
      }
    };

    //========== EVENTS TABLE =====================================
    service.getEvents = function(from, to){
      return $http.get('/api/events?from=' + from + '&to=' + to);
    };

    service.createEvent = function(event){
      return $http.post('/api/events/', event);
    };

    service.updateEvent = function(event){
      return $http.put('/api/events/' + event._id, event);
    };

    service.deleteEvent = function(event){
      return $http.delete('/api/events/' + event._id);
    };

    return service;
  }
]);
