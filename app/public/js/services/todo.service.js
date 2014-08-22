angular.module('a-string')
.factory('Todos', ['md5',
  function(md5){
    var service = {

      newTodo: function(){
        return {
                 id: md5.createHash((new Date()).getTime() + 'a-string'),
                 title: '',
                 createdAt: (new Date()).getTime(),
                 duration: 0,
                 completedAt: null,
                 completed: false
        };
      }
    };
    return service;
  }
]);
