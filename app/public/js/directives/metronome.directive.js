angular.module('a-string')
.directive('asMetronome', ['AudioService', 'States', function(AudioService, States){
  var notesPerBeat = 4;

  function renderBeats(){
    $('.beats').empty().append('<tr></tr>');
    var tr = $('.beats').find('tr');
    for(var i = 0; i < notesPerBeat; i++){
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

  return {
    restrict: 'E',
    templateUrl: 'tpls/metronome.html',
    link: function(scope, element, attrs, ngModel){
      scope.states = States;
      function updateTimer(){
        if(States){
          scope.$apply(function(){
            States.elapse += 1;
            States.duration += 1;
          });
        }
      }
      metronome.setUpdateTimerCb(updateTimer);

      scope.beatsUp = function(){
        notesPerBeat += 1;
        if(notesPerBeat > 8){notesPerBeat = 8;}
        metronome.setBPP(notesPerBeat);
        renderBeats();
      };

      scope.beatsDown = function(){
        notesPerBeat -= 1;
        if(notesPerBeat < 2){notesPerBeat = 2;}
        metronome.setBPP(notesPerBeat);
        renderBeats();
      };

      scope.toggleStart = function(){
        if(scope.states.timerOn){
          metronome.stopTimer();
          metronome.stopMetro();
        }else{
          metronome.startTimer();
          metronome.startMetro();
        }
        scope.states.timerOn = !scope.states.timerOn;
      };

      $('.dial').attr('data-value', '80').dial({
        change: function(value){
          metronome.setTempo(value);
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
      ticking      = true,
      flashing     = true,
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
    setBPP: setBeatsPerBar
  };
}
