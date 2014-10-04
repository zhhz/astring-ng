describe('AudioService', function(){
  beforeEach(module('a-string'));

  var audioService, win;
  beforeEach(inject(function(AudioService, $window){
    audioService = AudioService;
    win = $window;
  }));

  it('#getContext() should get the AudioContext', function(){
    var actx = new win.AudioContext()
    spyOn(audioService, 'getContext').andCallThrough();
    var ctx = audioService.getContext();

    expect(audioService.getContext).toHaveBeenCalled();
    expect(audioService.getContext.callCount).toEqual(1);
    expect(ctx).toEqual(actx);
  });

  it('#getContext() should failed to get the AudioContext if on old browser', function(){
    win.AudioContext = null;
    win.webkitAudioContext = null;

    spyOn(audioService, 'getContext').andCallThrough();
    var ctx = audioService.getContext();

    expect(audioService.getContext).toHaveBeenCalled();
    expect(audioService.getContext.callCount).toEqual(1);
    expect(ctx).toEqual(null);
  });

  it('#getBuffer() should get the buffers', function(){
    var buffer = audioService.getBuffers();
    expect(buffer).toEqual({});
  });

});
