if (typeof (AS) === 'undefined') { var AS = {}; }

angular.module('a-string')
.directive('asMetronome', ['AudioService', 'States', function(AudioService, States){
  var beatsPerBar = 4;
  var player, dial;

  function renderBeats(){
    $('.beats').empty().append('<tr></tr>');
    var tr = $('.beats').find('tr');
    for(var i = 0; i < beatsPerBar; i++){
      tr.append('<td id="beat' + i + '">' + (i + 1) +'</td>');
    }
  }

  function drawPlayhead(curr, prev){
    $('#beat' + curr).addClass('beat');
    $('#beat' + prev).removeClass('beat');
  }


  var metronome = new Metro();
  metronome.init(AudioService.getContext());
  metronome.setDrawPlayheadCb(drawPlayhead);

  var self = this;
  var cb = function(){
    player = AS.player();
  };

  if(!AS.MIDILoaded){
    new AS.loader(cb);
  }

  return {
    restrict: 'E',
    templateUrl: 'tpls/metronome.html',
    link: function(scope, element, attrs, ngModel){
      scope.states = States;
      scope.mode = 'metronome';

      scope.beatsUp = function(){
        beatsPerBar += 1;
        if(beatsPerBar > 8){beatsPerBar = 8;}
        metronome.setBPB(beatsPerBar);
        renderBeats();
      };

      scope.beatsDown = function(){
        beatsPerBar -= 1;
        if(beatsPerBar < 2){beatsPerBar = 2;}
        metronome.setBPB(beatsPerBar);
        renderBeats();
      };

      scope.switchMode = function(mode){
        if(scope.states.timerOn){ stop(); }

        scope.mode = mode;
        scope.currentSong = scope.states.currentSongs[0];
        if('melody' === mode){
          scope.nodes = scope.currentSong.melody;
        }else if('accompany' === mode){
          scope.nodes = scope.currentSong.accompany;
        }else{
          scope.nodes = null;
        }

        if(scope.states.timerOn){ start(); }
      };

      function start(){
        metronome.startTimer();

        if(scope.nodes){
          player.setBpm(scope.bpm);
          player.setSong(scope.nodes);
          player.start();
        }else{
          metronome.startMetro();
        }
      }

      function stop(){
        metronome.stopTimer();
        if(scope.nodes){
          player.stop();
        }else{
          metronome.stopMetro();
        }
      }

      scope.toggleStart = function(){
        /* jshint -W030 */
        scope.states.timerOn ? stop() : start();
        /* jshint +W030 */
        scope.states.timerOn = !scope.states.timerOn;
      };

      scope.$watch('states.currentSongs', function(newValue, oldValue){
        // always switch to metronome mode when current todo/songs changed
        scope.switchMode('metronome');
        scope.nodes = null;
        scope.bpm = newValue.length > 0 ? newValue[0].bpm : scope.bpm;
        dial.val(scope.bpm);


        beatsPerBar = newValue.length > 0 ? newValue[0].bpb : 4;
        metronome.setBPB(beatsPerBar);
        renderBeats();
      });

      function updateTimer(){
        if(States){
          scope.$apply(function(){
            States.elapse += 1;
            States.duration += 1;
          });
        }
      }
      metronome.setUpdateTimerCb(updateTimer);

      dial = $('.dial').attr('data-value', '80').dial({
        change: function(value){
          if(scope.states.timerOn){stop();}

          metronome.setTempo(value);
          scope.bpm = value;

          if(scope.states.timerOn){start();}
        }
      });
    }
  };
}]);

//==== Sound Loader ========================================
function SoundLoader(context, url, index) {
  this.context = context;
  this.url = url;
  this.index = index;
  this.startedLoading = false;
  this.isLoaded_ = false;
  this.buffer = 0;
}

SoundLoader.prototype.isLoaded = function() {
  return this.isLoaded_;
};

SoundLoader.prototype.loadedSound = function (buffer) {
  var that = this;
  this.context.decodeAudioData(buffer, function(theBuffer) {
    that.buffer = theBuffer;
  });

  this.isLoaded_ = true;
};

SoundLoader.prototype.load = function() {
  if (this.startedLoading) {
    return;
  }

  this.startedLoading = true;

  // Load asynchronously
  var request = new XMLHttpRequest();
  request.open('GET', this.url, true);
  request.responseType = 'arraybuffer';
  this.request = request;

  var asset = this;

  request.onload = function() {
    asset.loadedSound(request.response);
  };

  request.send();
};

/*
 * The metronome has two roles:
 *   - a timer to count how much time the user is using
 *   - a metronome of course
 */
function Metro() {
  var NOTE_LENGTH  = 0.2;

  var soundList = [],
      soundInfoList = [
        {name:'SeikoSQ50_high', url:'/media/metro/SeikoSQ50_high.wav'},
        {name:'SeikoSQ50_low',  url:'/media/metro/SeikoSQ50_low.wav'}
      ],
      bpp          = 4, // beats per bar
      count        = 0,
      spb          = 60.0 / 80,
      noteTime     = 0.0,
      ticking      = false,
      flashing     = false,
      timeoutId    = null,
      startTime    = null,
      lastDrawTime = -1,
      drawPlayheadCb = null,
      updateTimerCb = null,
      context;

  function init(ctx, drawPlayhead, updateTimer){
    context = ctx;
    startLoadingAssets();
    drawPlayheadCb = drawPlayhead || null;
    updateTimerCb = updateTimer || null;
  }

  function setUpdateTimerCb(cb){
    updateTimerCb = cb;
  }

  function setDrawPlayheadCb(cb){
    drawPlayheadCb = cb;
  }

  function startLoadingAssets() {
    for (var i = 0; i < soundInfoList.length; i++) {
      soundList[i] = new SoundLoader(context, soundInfoList[i].url, i);
      soundList[i].load();
    }
  }
  function handleStart() {
    noteTime = 0.0;
    startTime = context.currentTime;
    schedule();
  }

  function handleStop() {
    clearTimeout(timeoutId);
    if(drawPlayheadCb !== null){
      drawPlayheadCb(-1, (count - 1) % bpp);
    }
    count = 0;
  }

  function schedule() {
    var currentTime = context.currentTime;
    if((currentTime - startTime) >= 1){
      startTime = currentTime;
      if(updateTimerCb){ updateTimerCb(); }
    }

    while (noteTime < currentTime + NOTE_LENGTH) {
      // the sound
      tick(noteTime);

      // Attempt to synchronize drawing time with sound
      if (noteTime !== lastDrawTime) {
        lastDrawTime = noteTime;
        drawPlayhead();
      }

      advanceTick();
    }

    timeoutId = setTimeout(schedule, 0);
  }

  function drawPlayhead() {
    if(drawPlayheadCb !== null && flashing){
      var curr = count % bpp;
      var prev = (count - 1) % bpp;
      drawPlayheadCb(curr, prev);
    }
  }

  function advanceTick() {
    count++;
    noteTime += spb;
  }


  function tick(noteTime) {
    // the startTime > 0 here will make sure the AudioContext.currentTime starts to leap:
    // Interestingly, the audio context time starts at 0 if nothing has played.
    // Once a sound is playing it will keep track of how many seconds have passed even if all sounds are stopped.
    // Like a stopwatch you can start but never turn off.
    if(!ticking && startTime > 0){ return; }

    var volumeNode, lowPassFilter;

    var soundSource = context.createBufferSource();
    var hl = count % bpp;
    var data = hl === 0 ? soundList[0].buffer : soundList[1].buffer;
    // var soundBuffer = context.createBuffer(data, true);
    // soundSource.buffer = soundBuffer;
    soundSource.buffer = data;

    // volumeNode = context.createGainNode();
    volumeNode = context.createGain();
    volumeNode.gain.value = 1;
    volumeNode.connect(context.destination);

    // Wiring
    soundSource.connect(volumeNode);

    if (soundSource.noteOn) { // old api
      soundSource.noteOn(noteTime || 0);
      soundSource.noteOff(noteTime + NOTE_LENGTH);
    } else { // new api
      soundSource.start(noteTime || 0);
      soundSource.stop(noteTime + NOTE_LENGTH);
    }
  }

  function setTempo(tempo){
    spb = 60.0 / tempo;
  }

  function setBeatsPerBar(beats){
    bpp = beats;
  }

  function startTicking(){
    ticking = true;
    flashing = true;
  }

  function stopTicking(){
    ticking = false;
    flashing = false;
  }

  function toggleMetro(){
    ticking = !ticking;
    flashing = !flashing;
  }

  return {
    init: init,

    setUpdateTimerCb: setUpdateTimerCb,
    setDrawPlayheadCb: setDrawPlayheadCb,

    startTimer: handleStart,
    stopTimer:  handleStop,

    startMetro: startTicking,
    stopMetro: stopTicking,
    toggleMetro: toggleMetro,

    setTempo: setTempo,
    setBPB: setBeatsPerBar
  };
}
