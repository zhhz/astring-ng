if (typeof (AS) === 'undefined') { var AS = {}; }
if (typeof (MIDI) === 'undefined') { var MIDI = {}; }

// make the player a singleton
AS.player = function(){
  if(typeof(AS._player) === 'undefined' && AS.MIDILoaded){
    AS._player = new Player(AS.context, AS.audioBuffers);
  }else if(!AS.MIDILoaded){
    console.log('Soundfonts are not loaded yet!');
  }
  return AS._player;

  // =======================================================================
  // === private, hide the player from outside access =======================
  // =======================================================================
  function Player(context, audioBuffers){
    var playing = false;

    var bpm = 80;
    var milSecPerBeat = 60 / bpm * 1000;

    var playerTime = 0;
    var endTime = 0;
    var restart = 0;
    var sources = {};
    var masterVolume = 127;

    var song = [];
    var songData = [];

    var setVolume = function (channel, volume) {
      masterVolume = volume;
    };

    var start, resume;
    start = resume = function () {
      if (playerTime < -1) { playerTime = -1; }
      startAudio(playerTime);
    };

    var pause = function () {
      var tmp = restart;
      stopAudio();
      restart = tmp;
    };

    var stop = function () {
      stopAudio();
      restart = 0;
      playerTime = 0;
    };

    var addListener = function(callback) {
      onMidiEvent = callback;
    };

    var removeListener = function() {
      onMidiEvent = undefined;
    };

    var getLength = function() {
      var length = songData.length;
      var totalTime = 0.5;
      for (var n = 0; n < length; n++) {
        totalTime += songData[n][1];
      }
      return totalTime;
    };

    var noteOn = function (channel, note, velocity, delay) {
      /// check whether the note exists
      if (!MIDI.channels[channel]) { return; }
      var instrument = MIDI.channels[channel].instrument;

      if (!audioBuffers[instrument + '' + note]) { return; }

      /// convert relative delay to absolute delay
      if (delay < context.currentTime) { delay += context.currentTime; }
      /// crate audio buffer
      var source = context.createBufferSource();
      sources[channel + '' + note] = source;
      source.buffer = audioBuffers[instrument + '' + note];
      source.connect(context.destination);
      ///
      if (context.createGain) { // firefox
        source.gainNode = context.createGain();
      } else { // chrome
        source.gainNode = context.createGainNode();
      }
      var value = (velocity / 127) * (masterVolume / 127) * 2 - 1;
      source.gainNode.connect(context.destination);
      source.gainNode.gain.value = Math.max(-1, value);
      source.connect(source.gainNode);
      if (source.noteOn) { // old api
        source.noteOn(delay || 0);
      } else { // new api
        source.start(delay || 0);
      }
      return source;
    };

    var noteOff = function (channel, note, delay) {
      delay = delay || 0;
      if (delay < context.currentTime) { delay += context.currentTime; }
      var source = sources[channel + '' + note];
      if (!source) { return; }
      if (source.gainNode) {
        // @Miranet: "the values of 0.2 and 0.3 could ofcourse be used as 
        // a 'release' parameter for ADSR like time settings."
        // add { "metadata": { release: 0.3 } } to soundfont files
        var gain = source.gainNode.gain;
        gain.linearRampToValueAtTime(gain.value, delay);
        gain.linearRampToValueAtTime(-1, delay + 0.2);
      }
      if (source.noteOff) { // old api
        source.noteOff(delay + 0.3);
      } else {
        source.stop(delay + 0.3);
      }
      ///
      delete sources[channel + '' + note];
    };

    var eventQueue = []; // hold events to be triggered
    var queuedTime;
    var startTime = 0; // to measure time elapse
    var noteRegistrar = {}; // get event for requested note
    var onMidiEvent; // listener callback
    var scheduleTracking = function (channel, note, currentTime, offset, message, velocity) {
      var interval = window.setTimeout(function () {
        var data = {
          channel: channel,
          note: note,
          now: currentTime,
          end: endTime,
          message: message,
          velocity: velocity
        };
        //
        if (message === 128) {
          delete noteRegistrar[note];
        } else {
          noteRegistrar[note] = data;
        }
        if (onMidiEvent) {
          onMidiEvent(data);
        }
        playerTime = currentTime;
        if (playerTime === queuedTime && queuedTime < endTime) {// grab next sequence(100 of the notes)
          startAudio(queuedTime + 0.1, true);
        }else if (playerTime === queuedTime && queuedTime === endTime) {// restart the song
          startAudio(0);
        }
      }, currentTime - offset);
      return interval;
    };
    var startAudio = function (currentTime, fromCache) {
      if (!fromCache) {
        if (typeof (currentTime) === 'undefined') { currentTime = restart; }
        if (playing) { stopAudio(); }
        playing = true;
        endTime = getLength();
      }
      var note;
      var offset = 0;
      var messages = 0;
      var length = songData.length;
      //
      queuedTime = 0.5;
      startTime = context.currentTime;
      //
      for (var n = 0; n < length && messages < 100; n++) {
        queuedTime += songData[n][1];
        if (queuedTime < currentTime) {
          offset = queuedTime;
          continue;
        }
        currentTime = queuedTime - offset;
        var event = songData[n][0].event;
        if (event.type !== 'channel') { continue; }
        var channel = event.channel;
        switch (event.subtype) {
          case 'noteOn':
            if (MIDI.channels[channel].mute) { break; }
            note = event.noteNumber;
            eventQueue.push({
              event: event,
              source: noteOn(channel, note, event.velocity, currentTime / 1000 + context.currentTime),
              interval: scheduleTracking(channel, note, queuedTime, offset, 144, event.velocity)
            });
            messages++;
            break;
          case 'noteOff':
            if (MIDI.channels[channel].mute) { break; }
            note = event.noteNumber;
            eventQueue.push({
              event: event,
              source: noteOff(channel, note, currentTime / 1000 + context.currentTime),
              interval: scheduleTracking(channel, note, queuedTime, offset, 128)
            });
            break;
          default:
            break;
        }
      }
    };

    var stopAudio = function () {
      playing = false;
      restart += (context.currentTime - startTime) * 1000;
      // stop the audio, and intervals
      var o;
      while (eventQueue.length) {
        o = eventQueue.pop();
        window.clearInterval(o.interval);
        if (!o.source) { continue; } // is not webaudio
        if (typeof(o.source) === 'number') {
          window.clearTimeout(o.source);
        } else { // webaudio
          o.source.disconnect(0);
        }
      }
      // run callback to cancel any notes still playing
      for (var key in noteRegistrar) {
        o = noteRegistrar[key];
        if (noteRegistrar[key].message === 144 && onMidiEvent) {
          onMidiEvent({
            channel: o.channel,
            note: o.note,
            now: o.now,
            end: o.end,
            message: 128,
            velocity: o.velocity
          });
        }
      }
      // reset noteRegistrar
      noteRegistrar = {};
    };

    var setSong = function(songArray){
      song = songArray;
      processSong();
    };

    var isPlaying = function(){
      return playing;
    };

    var setBpm = function(theBpm){
      bpm = theBpm;
      milSecPerBeat = 60 / bpm * 1000;

      if(playing){
        stopAudio();
        processSong();
        startAudio(0);
      }else{
        processSong();
      }
    };

    var processSong = function(){
      songData = [];
      for(var i = 0; i < song.length; i++){
        var node = song[i];
        var notes = node.notes;
        // the noteOn
        for(var j = 0, len = notes.length; j < len; j++){
          songData.push([{event: {type: 'channel', channel: 0, subtype: 'noteOn', noteNumber: notes[j], velocity: 127}}, 0]);
        }
        // the noteOff
        for(var k = 0, len2 = notes.length; k < len2; k++){
          songData.push([{event: {type: 'channel', channel: 0, subtype: 'noteOff', noteNumber: notes[k], velocity: 127}}, (k === 0 ? milSecPerBeat * node.duration : 0)]);
        }
      }
    };

    // public API of the player
    return {
      setSong: setSong,
      setBpm: setBpm,

      isPlaying: isPlaying,
      start: start,
      stop:  stop,
      pause: pause,
      resume: resume,

      addListener: addListener,
      removeListener: removeListener
    };
  }
};



