angular.module('a-string')
  .factory('StorageManager', ['$auth', 'LocalStorage', 'RemoteStorage',
    function($auth, LocalStorage, RemoteStorage){
      var manager = {};

      manager.storage = function(){
        if($auth.isAuthenticated()){
          return RemoteStorage;
        }else{
          return LocalStorage;
        }
      };

      return manager;
    }
  ]
);
