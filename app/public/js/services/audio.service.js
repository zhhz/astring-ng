angular.module('a-string')
.factory('AudioService', function(){
  var _service = {}, _ctx, _buffers;

  _service.getContext = function(){
    if(!_ctx){
      if (window.AudioContext || window.webkitAudioContext) {
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        _ctx = new AudioContext();
      }else{
        var msg = 'AudioContext not found: Web Audio API is not supported by this browser';
        console.log(msg);
        // throw new Error(msg);
        _ctx = null;
      }
    }
    return _ctx;
  };

  _service.getBuffers = function(){
    if(!_buffers){ _buffers = {}; }
    return _buffers;
  };

  return _service;
});
