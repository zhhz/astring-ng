/*
  Rewrite based on MIDI.js

  -------------------------------------
  MIDI.LoadPlugin : 0.1.2
  -------------------------------------
  https://github.com/mudcube/MIDI.js
  -------------------------------------
*/
if (typeof (AS) === "undefined") var AS = {};
if (typeof (MIDI) === "undefined") var MIDI = {};
if (typeof (MIDI.Soundfont) === "undefined") MIDI.Soundfont = {};

AS.loader = function(callback){
  AS.MIDILoaded = false;

  if (window.AudioContext || window.webkitAudioContext) {
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    AS.context = new AudioContext();
    AS.audioBuffers = {};
  }else{
    var msg = "Your browser dosn't support WebAudio API!";
    console.log(msg);
    throw new Error(msg);
  }

  MIDI.loader = new widgets.Loader();
  MIDI.loadPlugin({
    soundfontUrl: "/soundfont/",
    instrument: 'acoustic_grand_piano',
    callback: function () {
        AS.MIDILoaded = true;
        callback();
        MIDI.loader.stop();
      }
  });
};


if (typeof (widgets) === "undefined") var widgets = {};
widgets.Loader = function (configure) {
  var noCanvas = !document.createElement("canvas").getContext;
  if (noCanvas) return;

  var fadeOutSpeed = 400;
  var defaultConfig = {
    id: "loader",
    bars: 12,
    radius: 0,
    lineWidth: 20,
    lineHeight: 70,
    timeout: 0,
    display: true
  };

  var transitionCSS = function(type, ms) {
    return ' -webkit-transition-property: '+type+'; -webkit-transition-duration: '+ms+'ms; -moz-transition-property: '+type+'; -moz-transition-duration: '+ms+'ms; -o-transition-property: '+type+'; -o-transition-duration: '+ms+'ms; -ms-transition-property: '+type+'; -ms-transition-duration: '+ms+'ms;';
  };

  var getWindowSize = function (element) {
    var width, height;
    if (window.innerWidth && window.innerHeight) {
      width = window.innerWidth;
      height = window.innerHeight;
    } else if (document.compatMode === "CSS1Compat" && document.documentElement && document.documentElement.offsetWidth) {
      width = document.documentElement.offsetWidth;
      height = document.documentElement.offsetHeight;
    } else if (document.body && document.body.offsetWidth) {
      width = document.body.offsetWidth;
      height = document.body.offsetHeight;
    }
    if (element) {
      width = element.offsetWidth;
    }
    return {
      width: width,
      height: height
    };
  };
  var that = this;
  if (typeof (configure) === "string") configure = { message: configure };
  if (typeof (configure) === "boolean") configure = { display: false };
  if (typeof (configure) === "undefined") configure = {};
  configure.container = configure.container || document.body;
  if (!configure.container) return;

  /// Mixin the default configurations.
  for (var key in defaultConfig) {
    if (typeof (configure[key]) === "undefined") {
      configure[key] = defaultConfig[key];
    }
  }

  /// Setup element
  var canvas = document.getElementById(configure.id);
  if (!canvas) {
    var div = document.createElement("div");
    var span = document.createElement("span");
    span.className = "message";
    div.appendChild(span);
    div.className = defaultConfig.id;
    div.style.cssText = transitionCSS("opacity", fadeOutSpeed);
    this.span = span;
    this.div = div;
    canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    canvas.id = configure.id;
    canvas.style.cssText = "opacity: 1; position: absolute; z-index: 10000;";
    div.appendChild(canvas);
    configure.container.appendChild(div);
  } else {
    this.span = canvas.parentNode.getElementsByTagName("span")[0];
  }

  /// Configure
  var delay = configure.delay;
  var bars = configure.bars;
  var radius = configure.radius;
  var max = configure.lineHeight + 20;
  var size = max * 2 + configure.radius * 2;
  var windowSize = getWindowSize(configure.container);
  var width = windowSize.width - size;
  var height = windowSize.height - size;
  var deviceRatio = window.devicePixelRatio || 1;
  ///
  canvas.width = size * deviceRatio;
  canvas.height = size  * deviceRatio;
  ///
  var iteration = 0;
  var ctx = canvas.getContext("2d");
  ctx.globalCompositeOperation = "lighter";
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  ctx.shadowBlur = 1;
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";

  /// Public functions.
  this.messages = {};
  this.message = function (message, onstart) {
    if (!this.interval) return this.start(onstart, message);
    return this.add({
      message: message, 
      onstart: onstart
    });
  };

  this.update = function(id, message, percent) {
    /* jshint -W004 */
    if (!id) for (var id in this.messages);
    if (!id) return this.message(message);
    var item = this.messages[id];
    item.message = message;
    if (typeof(percent) === "number") item.span.innerHTML = percent + "%";
    if (message.substr(-3) === "...") { // animated dots
      item._message = message.substr(0, message.length - 3);
      item.messageAnimate = [".&nbsp;&nbsp;", "..&nbsp;", "..."].reverse();
    } else { // normal
      item._message = message;
      item.messageAnimate = false;
    }
    ///
    item.element.innerHTML = message;
    /* jshint +W004 */
  };

  this.add = function (conf) {
    if (typeof(conf) === "string") conf = { message: conf };
    var background = configure.background ? configure.background : "rgba(0,0,0,0.65)";
    this.span.style.cssText = "background: " + background + ";";
    this.div.style.cssText = transitionCSS("opacity", fadeOutSpeed);
    if (this.stopPropagation) {
      this.div.style.cssText += "background: rgba(0,0,0,0.25);";
    } else {
      this.div.style.cssText += "pointer-events: none;";
    }
    ///
    canvas.parentNode.style.opacity = 1;
    canvas.parentNode.style.display = "block";
    if (configure.background) this.div.style.background = configure.backgrond;
    ///
    var timestamp = (new Date()).getTime();
    var seed = Math.abs(timestamp * Math.random() >> 0);
    var message = conf.message;
    ///
    var container = document.createElement("div");
    container.style.cssText = transitionCSS("opacity", 500);
    var span = document.createElement("span");
    span.style.cssText = "float: right; width: 50px;";
    var node = document.createElement("span");
    node.innerHTML = message;
    ///
    container.appendChild(node);
    container.appendChild(span);
    ///
    var item = this.messages[seed] = {
      seed: seed,
      container: container,
      element: node,
      span: span,
      message: message,
      timeout: (conf.timeout || configure.timeout) * 1000,
      timestamp: timestamp,
      getProgress: conf.getProgress
    };
    this.span.appendChild(container);
    this.span.style.display = "block";
    this.update(item.seed, message);
    /// Escape event loop.
    if (conf.onstart) {
      window.setTimeout(conf.onstart, 50);
    }
    ///
    this.center();
    ///
    if (!this.interval) {
      if (!conf.delay) renderAnimation();
      window.clearInterval(this.interval);
      this.interval = window.setInterval(renderAnimation, 30);
    }
    /// Return identifier.
    return seed;
  };

  this.remove = function (seed) {
    iteration += 0.07;
    var timestamp = (new Date()).getTime();
    if (typeof(seed) === "object") seed = seed.join(":");
    if (seed) seed = ":" + seed + ":";
    /// Remove element.
    for (var key in this.messages) {
      var item = this.messages[key];
      if (!seed || seed.indexOf(":" + item.seed + ":") !== -1) {
        delete this.messages[item.seed];
        item.container.style.color = "#99ff88";
        removeChild(item);
        if (item.getProgress) item.span.innerHTML = "100%";
      }
    }
  };

  this.start = function (onstart, message) {
    if (!(message || configure.message)) return;
    return this.add({
      message: message || configure.message, 
      onstart: onstart
    });
  };

  this.stop = function () {
    this.remove();
    window.clearInterval(this.interval);
    delete this.interval;
    if (configure.oncomplete) configure.oncomplete();
    if (canvas && canvas.style) {
      div.style.cssText += "pointer-events: none;";
      window.setTimeout(function() {
        that.div.style.opacity = 0;
      }, 1);
      window.setTimeout(function () {
        if (that.interval) return;
        that.stopPropagation = false;
        canvas.parentNode.style.display = "none";
        ctx.clearRect(0, 0, size, size);
      }, fadeOutSpeed * 1000);
    }
  };

  this.center = function() {
    var windowSize = getWindowSize(configure.container);
    var width = windowSize.width - size;
    var height = windowSize.height - size;
    /// Center the animation within the content.
    canvas.style.left = (width / 2) + "px";
    canvas.style.top = (height / 2) + "px";
    canvas.style.width = (size) + "px";
    canvas.style.height = (size) + "px";
    that.span.style.top = (height / 2 + size - 10) + "px";
  };

  var style = document.createElement("style");
  /* jshint -W043 */
  style.innerHTML = '\
                    .loader { color: #fff; position: fixed; left: 0; top: 0; width: 100%; height: 100%; z-index: 100000; opacity: 0; display: none; }\
                    .loader span.message { font-family: monospace; font-size: 14px; margin: auto; opacity: 1; display: none; border-radius: 10px; padding: 0px; width: 300px; text-align: center; position: absolute; z-index: 10000; left: 0; right: 0; }\
                    .loader span.message div { border-bottom: 1px solid #222; padding: 5px 10px; clear: both; text-align: left; opacity: 1; }\
                    .loader span.message div:last-child { border-bottom: none; }\
                    ';
  /* jshint +W043 */
  document.head.appendChild(style);
  /// Private functions.
  var removeChild = function(item) {
    window.setTimeout(function() { // timeout in case within same event loop.
      item.container.style.opacity = 0;
    }, 1);
    window.setTimeout(function() { // wait for opacity=0 before removing the element.
      item.container.parentNode.removeChild(item.container);
    }, 250);
  };
  var renderAnimation = function () {
    var timestamp = (new Date()).getTime();
    for (var key in that.messages) {
      var item = that.messages[key];
      var nid = iteration / 0.07 >> 0;
      if (nid % 5 === 0 && item.getProgress) {
        if (item.timeout && item.timestamp && timestamp - item.timestamp > item.timeout) {
          that.remove(item.seed);
          continue;
        }
        var progress = item.getProgress();
        if (progress >= 100) {
          that.remove(item.seed);
          continue;
        }
        item.span.innerHTML = (progress >> 0) + "%";
      }
      if (nid % 10 === 0) {
        if (item.messageAnimate) {
          var length = item.messageAnimate.length;
          var n = nid / 10 % length;
          var text = item._message + item.messageAnimate[n];
          item.element.innerHTML = text;
        }
      }
    }
    if (!key) {
      that.stop();
    }
    //
    ctx.save();
    ctx.clearRect(0, 0, size * deviceRatio, size * deviceRatio);
    ctx.scale(deviceRatio, deviceRatio);
    ctx.translate(size / 2, size / 2);
    var hues = 360 - 360 / bars;
    for (var i = 0; i < bars; i++) {
      var angle = (i / bars * 2 * Math.PI) + iteration;
      ctx.save();
      ctx.translate(radius * Math.sin(-angle), radius * Math.cos(-angle));
      ctx.rotate(angle);
      // round-rect properties
      var x = -configure.lineWidth / 2;
      var y = 0;
      var width = configure.lineWidth;
      var height = configure.lineHeight;
      var curve = width / 2;
      // round-rect path
      ctx.beginPath();
      ctx.moveTo(x + curve, y);
      ctx.lineTo(x + width - curve, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + curve);
      ctx.lineTo(x + width, y + height - curve);
      ctx.quadraticCurveTo(x + width, y + height, x + width - curve, y + height);
      ctx.lineTo(x + curve, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - curve);
      ctx.lineTo(x, y + curve);
      ctx.quadraticCurveTo(x, y, x + curve, y);
      // round-rect fill
      var hue = ((i / (bars - 1)) * hues);
      ctx.fillStyle = "hsla(" + hue + ", 100%, 50%, 0.85)";
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
    iteration += 0.07;
  };
  //
  if (configure.display === false) return this;
  //
  this.start();
  //
  return this;
};

MIDI.audioDetect = function(callback) {
  var supports = {};
  var pending = 0;
  var canPlayThrough = function (src) {
    pending ++;
    var audio = new Audio();
    var mime = src.split(";")[0];
    audio.id = "audio";
    audio.setAttribute("preload", "auto");
    audio.setAttribute("audiobuffer", true);
    audio.addEventListener("error", function() {
      supports[mime] = false;
      pending --;
    }, false);
    audio.addEventListener("canplaythrough", function() {
      supports[mime] = true;
      pending --;
    }, false);
    audio.src = "data:" + src;
    document.body.appendChild(audio);
  };

  var audio = new Audio();
  if (typeof(audio.canPlayType) === "undefined") return callback(supports);
  // see what we can learn from the browser
  var vorbis = audio.canPlayType('audio/ogg; codecs="vorbis"');
  vorbis = (vorbis === "probably" || vorbis === "maybe");
  var mpeg = audio.canPlayType('audio/mpeg');
  mpeg = (mpeg === "probably" || mpeg === "maybe");
  // maybe nothing is supported
  if (!vorbis && !mpeg) {
    callback(supports);
    return;
  }
  // or maybe something is supported
  if (vorbis) canPlayThrough("audio/ogg;base64,T2dnUwACAAAAAAAAAADqnjMlAAAAAOyyzPIBHgF2b3JiaXMAAAAAAUAfAABAHwAAQB8AAEAfAACZAU9nZ1MAAAAAAAAAAAAA6p4zJQEAAAANJGeqCj3//////////5ADdm9yYmlzLQAAAFhpcGguT3JnIGxpYlZvcmJpcyBJIDIwMTAxMTAxIChTY2hhdWZlbnVnZ2V0KQAAAAABBXZvcmJpcw9CQ1YBAAABAAxSFCElGVNKYwiVUlIpBR1jUFtHHWPUOUYhZBBTiEkZpXtPKpVYSsgRUlgpRR1TTFNJlVKWKUUdYxRTSCFT1jFloXMUS4ZJCSVsTa50FkvomWOWMUYdY85aSp1j1jFFHWNSUkmhcxg6ZiVkFDpGxehifDA6laJCKL7H3lLpLYWKW4q91xpT6y2EGEtpwQhhc+211dxKasUYY4wxxsXiUyiC0JBVAAABAABABAFCQ1YBAAoAAMJQDEVRgNCQVQBABgCAABRFcRTHcRxHkiTLAkJDVgEAQAAAAgAAKI7hKJIjSZJkWZZlWZameZaouaov+64u667t6roOhIasBACAAAAYRqF1TCqDEEPKQ4QUY9AzoxBDDEzGHGNONKQMMogzxZAyiFssLqgQBKEhKwKAKAAAwBjEGGIMOeekZFIi55iUTkoDnaPUUcoolRRLjBmlEluJMYLOUeooZZRCjKXFjFKJscRUAABAgAMAQICFUGjIigAgCgCAMAYphZRCjCnmFHOIMeUcgwwxxiBkzinoGJNOSuWck85JiRhjzjEHlXNOSuekctBJyaQTAAAQ4AAAEGAhFBqyIgCIEwAwSJKmWZomipamiaJniqrqiaKqWp5nmp5pqqpnmqpqqqrrmqrqypbnmaZnmqrqmaaqiqbquqaquq6nqrZsuqoum65q267s+rZru77uqapsm6or66bqyrrqyrbuurbtS56nqqKquq5nqq6ruq5uq65r25pqyq6purJtuq4tu7Js664s67pmqq5suqotm64s667s2rYqy7ovuq5uq7Ks+6os+75s67ru2rrwi65r66os674qy74x27bwy7ouHJMnqqqnqq7rmarrqq5r26rr2rqmmq5suq4tm6or26os67Yry7aumaosm64r26bryrIqy77vyrJui67r66Ys67oqy8Lu6roxzLat+6Lr6roqy7qvyrKuu7ru+7JuC7umqrpuyrKvm7Ks+7auC8us27oxuq7vq7It/KosC7+u+8Iy6z5jdF1fV21ZGFbZ9n3d95Vj1nVhWW1b+V1bZ7y+bgy7bvzKrQvLstq2scy6rSyvrxvDLux8W/iVmqratum6um7Ksq/Lui60dd1XRtf1fdW2fV+VZd+3hV9pG8OwjK6r+6os68Jry8ov67qw7MIvLKttK7+r68ow27qw3L6wLL/uC8uq277v6rrStXVluX2fsSu38QsAABhwAAAIMKEMFBqyIgCIEwBAEHIOKQahYgpCCKGkEEIqFWNSMuakZM5JKaWUFEpJrWJMSuaclMwxKaGUlkopqYRSWiqlxBRKaS2l1mJKqcVQSmulpNZKSa2llGJMrcUYMSYlc05K5pyUklJrJZXWMucoZQ5K6iCklEoqraTUYuacpA46Kx2E1EoqMZWUYgupxFZKaq2kFGMrMdXUWo4hpRhLSrGVlFptMdXWWqs1YkxK5pyUzDkqJaXWSiqtZc5J6iC01DkoqaTUYiopxco5SR2ElDLIqJSUWiupxBJSia20FGMpqcXUYq4pxRZDSS2WlFosqcTWYoy1tVRTJ6XFklKMJZUYW6y5ttZqDKXEVkqLsaSUW2sx1xZjjqGkFksrsZWUWmy15dhayzW1VGNKrdYWY40x5ZRrrT2n1mJNMdXaWqy51ZZbzLXnTkprpZQWS0oxttZijTHmHEppraQUWykpxtZara3FXEMpsZXSWiypxNhirLXFVmNqrcYWW62ltVprrb3GVlsurdXcYqw9tZRrrLXmWFNtBQAADDgAAASYUAYKDVkJAEQBAADGMMYYhEYpx5yT0ijlnHNSKucghJBS5hyEEFLKnINQSkuZcxBKSSmUklJqrYVSUmqttQIAAAocAAACbNCUWByg0JCVAEAqAIDBcTRNFFXVdX1fsSxRVFXXlW3jVyxNFFVVdm1b+DVRVFXXtW3bFn5NFFVVdmXZtoWiqrqybduybgvDqKqua9uybeuorqvbuq3bui9UXVmWbVu3dR3XtnXd9nVd+Bmzbeu2buu+8CMMR9/4IeTj+3RCCAAAT3AAACqwYXWEk6KxwEJDVgIAGQAAgDFKGYUYM0gxphhjTDHGmAAAgAEHAIAAE8pAoSErAoAoAADAOeecc84555xzzjnnnHPOOeecc44xxhhjjDHGGGOMMcYYY4wxxhhjjDHGGGOMMcYYY0wAwE6EA8BOhIVQaMhKACAcAABACCEpKaWUUkoRU85BSSmllFKqFIOMSkoppZRSpBR1lFJKKaWUIqWgpJJSSimllElJKaWUUkoppYw6SimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaVUSimllFJKKaWUUkoppRQAYPLgAACVYOMMK0lnhaPBhYasBAByAwAAhRiDEEJpraRUUkolVc5BKCWUlEpKKZWUUqqYgxBKKqmlklJKKbXSQSihlFBKKSWUUkooJYQQSgmhlFRCK6mEUkoHoYQSQimhhFRKKSWUzkEoIYUOQkmllNRCSB10VFIpIZVSSiklpZQ6CKGUklJLLZVSWkqpdBJSKamV1FJqqbWSUgmhpFZKSSWl0lpJJbUSSkklpZRSSymFVFJJJYSSUioltZZaSqm11lJIqZWUUkqppdRSSiWlkEpKqZSSUmollZRSaiGVlEpJKaTUSimlpFRCSamlUlpKLbWUSkmptFRSSaWUlEpJKaVSSksppRJKSqmllFpJKYWSUkoplZJSSyW1VEoKJaWUUkmptJRSSymVklIBAEAHDgAAAUZUWoidZlx5BI4oZJiAAgAAQABAgAkgMEBQMApBgDACAQAAAADAAAAfAABHARAR0ZzBAUKCwgJDg8MDAAAAAAAAAAAAAACAT2dnUwAEAAAAAAAAAADqnjMlAgAAADzQPmcBAQA=");
  if (mpeg) canPlayThrough("audio/mpeg;base64,/+MYxAAAAANIAUAAAASEEB/jwOFM/0MM/90b/+RhST//w4NFwOjf///PZu////9lns5GFDv//l9GlUIEEIAAAgIg8Ir/JGq3/+MYxDsLIj5QMYcoAP0dv9HIjUcH//yYSg+CIbkGP//8w0bLVjUP///3Z0x5QCAv/yLjwtGKTEFNRTMuOTeqqqqqqqqqqqqq/+MYxEkNmdJkUYc4AKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq");
  // lets find out!
  var time = (new Date()).getTime(); 
  var interval = window.setInterval(function() {
    var now = (new Date()).getTime();
    var maxExecution = now - time > 5000;
    if (!pending || maxExecution) {
      window.clearInterval(interval);
      callback(supports);
    }
  }, 1);
};


MIDI.loadPlugin = function(conf) {

  if (typeof(conf) === "function") conf = {
    callback: conf
  };

  /// Get the instrument name.
  var instruments = conf.instruments || conf.instrument || "acoustic_grand_piano";
  if (typeof(instruments) !== "object") instruments = [ instruments ];
  ///
  for (var n = 0; n < instruments.length; n ++) {
    var instrument = instruments[n];
    if (typeof(instrument) === "number") {
      instruments[n] = MIDI.GeneralMIDI.byId[instrument];
    }
  }
  // soundfont url
  MIDI.soundfontUrl = conf.soundfontUrl || MIDI.soundfontUrl || "./soundfont/";
  // Detect the best type of audio to use.
  MIDI.audioDetect(function(types) {
    var filetype;
    // use audio/ogg when supported
    if (conf.targetFormat) {
      filetype = conf.targetFormat;
    } else { // use best quality
      filetype = types["audio/ogg"] ? "ogg" : "mp3";
    }
    // load the specified sondfont
    load(filetype, instruments, conf);
  });

  var load = function(filetype, instruments, conf) {
    if (MIDI.loader) MIDI.loader.message("Web Audio API...");
    var queue = createQueue({
      items: instruments,
      getNext: function(instrumentId) {
        sendRequest({
          url: MIDI.soundfontUrl + instrumentId + "-" + filetype + ".js",
        onprogress: getPercent,
        onload: function(response) {
          addSoundfont(response.responseText);
          if (MIDI.loader) MIDI.loader.update(null, "Downloading...", 100);
          queue.getNext();
        }
        });
      },
      onComplete: function() {
        connect(conf);
      }
    });
  };

  var sendRequest = function(conf) {
    var req = new XMLHttpRequest();
    req.open(conf.data ? "POST" : "GET", conf.url, true);
    if (req.overrideMimeType) req.overrideMimeType("text/plain; charset=x-user-defined");
    if (conf.data) req.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    if (conf.responseType) req.responseType = conf.responseType;
    if (conf.onerror) req.onerror = conf.onerror;
    if (conf.onprogress) req.onprogress = conf.onprogress;
    req.onreadystatechange = function (event) {
      if (req.readyState === 4) {
        if (req.status !== 200 && req.status != 304) {
          if (conf.onerror) conf.onerror(event, false);
          return;
        }
        if (conf.onload) {
          conf.onload(req);
        }
      }
    };
    req.send(conf.data);
    return req;
  };


  var connect = function (conf) {
    var urlList = [];
    var keyToNote = MIDI.keyToNote;
    for (var key in keyToNote) urlList.push(key);
    var bufferList = [];
    var pending = {};
    var oncomplete = function(instrument) {
      delete pending[instrument];
      for (var key in pending) break;
      if (!key) conf.callback();
    };
    for (var instrument in MIDI.Soundfont) {
      pending[instrument] = true;
      for (var i = 0; i < urlList.length; i++) {
        audioLoader(instrument, urlList, i, bufferList, oncomplete);
      }
    }
  };

  var audioLoader = function (instrument, urlList, index, bufferList, callback) {
    var synth = MIDI.GeneralMIDI.byName[instrument];
    var instrumentId = synth.number;
    var url = urlList[index];
    if (!MIDI.Soundfont[instrument][url]) { // missing soundfont
      return callback(instrument);
    }
    var base64 = MIDI.Soundfont[instrument][url].split(",")[1];
    var buffer = Base64Binary.decodeArrayBuffer(base64);
    AS.context.decodeAudioData(buffer, function (buffer) {
      var msg = url;
      while (msg.length < 3) msg += "&nbsp;";
      if (typeof (MIDI.loader) !== "undefined") {
        MIDI.loader.update(null, synth.instrument + "<br>Processing: " + (index / 87 * 100 >> 0) + "%<br>" + msg);
      }
      buffer.id = url;
      bufferList[index] = buffer;
      //
      if (bufferList.length === urlList.length) {
        while (bufferList.length) {
          buffer = bufferList.pop();
          if (!buffer) continue;
          AS.audioBuffers[instrumentId + "" + buffer.id] = buffer;
        }
        callback(instrument);
      }
    });
  };

  var addSoundfont = function(text) {
    var script = document.createElement("script");
    script.language = "javascript";
    script.type = "text/javascript";
    script.text = text;
    document.body.appendChild(script);
  };

  var getPercent = function(event) {
    if (!this.totalSize) {
      if (this.getResponseHeader("Content-Length-Raw")) {
        this.totalSize = parseInt(this.getResponseHeader("Content-Length-Raw"));
      } else {
        this.totalSize = event.total;
      }
    }
    ///
    var percent = this.totalSize ? Math.round(event.loaded / this.totalSize * 100) : "";
    if (MIDI.loader) MIDI.loader.update(null, "Downloading...", percent);
  };

  var createQueue = function(conf) {
    var self = {};
    self.queue = [];
    for (var key in conf.items) {
      if (conf.items.hasOwnProperty(key)) {
        self.queue.push(conf.items[key]);
      }
    }
    self.getNext = function() {
      if (!self.queue.length) return conf.onComplete();
      conf.getNext(self.queue.shift());
    };
    setTimeout(self.getNext, 1);
    return self;
  };
};



/*
   helper functions
*/

// instrument-tracker
MIDI.GeneralMIDI = (function (arr) {
  var clean = function(v) {
    return v.replace(/[^a-z0-9 ]/gi, "").replace(/[ ]/g, "_").toLowerCase();
  };
  var ret = {
    byName: {},
  byId: {},
  byCategory: {}
  };
  for (var key in arr) {
    var list = arr[key];
    for (var n = 0, length = list.length; n < length; n++) {
      var instrument = list[n];
      if (!instrument) continue;
      var num = parseInt(instrument.substr(0, instrument.indexOf(" ")), 10);
      instrument = instrument.replace(num + " ", "");
      ret.byId[--num] = ret.byName[clean(instrument)] = ret.byCategory[clean(key)] = {
        id: clean(instrument),
        instrument: instrument,
        number: num,
        category: key
      };
    }
  }
  return ret;
})({
  'Piano': ['1 Acoustic Grand Piano', '2 Bright Acoustic Piano', '3 Electric Grand Piano', '4 Honky-tonk Piano', '5 Electric Piano 1', '6 Electric Piano 2', '7 Harpsichord', '8 Clavinet'],
  'Chromatic Percussion': ['9 Celesta', '10 Glockenspiel', '11 Music Box', '12 Vibraphone', '13 Marimba', '14 Xylophone', '15 Tubular Bells', '16 Dulcimer'],
  'Organ': ['17 Drawbar Organ', '18 Percussive Organ', '19 Rock Organ', '20 Church Organ', '21 Reed Organ', '22 Accordion', '23 Harmonica', '24 Tango Accordion'],
  'Guitar': ['25 Acoustic Guitar (nylon)', '26 Acoustic Guitar (steel)', '27 Electric Guitar (jazz)', '28 Electric Guitar (clean)', '29 Electric Guitar (muted)', '30 Overdriven Guitar', '31 Distortion Guitar', '32 Guitar Harmonics'],
  'Bass': ['33 Acoustic Bass', '34 Electric Bass (finger)', '35 Electric Bass (pick)', '36 Fretless Bass', '37 Slap Bass 1', '38 Slap Bass 2', '39 Synth Bass 1', '40 Synth Bass 2'],
  'Strings': ['41 Violin', '42 Viola', '43 Cello', '44 Contrabass', '45 Tremolo Strings', '46 Pizzicato Strings', '47 Orchestral Harp', '48 Timpani'],
  'Ensemble': ['49 String Ensemble 1', '50 String Ensemble 2', '51 Synth Strings 1', '52 Synth Strings 2', '53 Choir Aahs', '54 Voice Oohs', '55 Synth Choir', '56 Orchestra Hit'],
  'Brass': ['57 Trumpet', '58 Trombone', '59 Tuba', '60 Muted Trumpet', '61 French Horn', '62 Brass Section', '63 Synth Brass 1', '64 Synth Brass 2'],
  'Reed': ['65 Soprano Sax', '66 Alto Sax', '67 Tenor Sax', '68 Baritone Sax', '69 Oboe', '70 English Horn', '71 Bassoon', '72 Clarinet'],
  'Pipe': ['73 Piccolo', '74 Flute', '75 Recorder', '76 Pan Flute', '77 Blown Bottle', '78 Shakuhachi', '79 Whistle', '80 Ocarina'],
  'Synth Lead': ['81 Lead 1 (square)', '82 Lead 2 (sawtooth)', '83 Lead 3 (calliope)', '84 Lead 4 (chiff)', '85 Lead 5 (charang)', '86 Lead 6 (voice)', '87 Lead 7 (fifths)', '88 Lead 8 (bass + lead)'],
  'Synth Pad': ['89 Pad 1 (new age)', '90 Pad 2 (warm)', '91 Pad 3 (polysynth)', '92 Pad 4 (choir)', '93 Pad 5 (bowed)', '94 Pad 6 (metallic)', '95 Pad 7 (halo)', '96 Pad 8 (sweep)'],
  'Synth Effects': ['97 FX 1 (rain)', '98 FX 2 (soundtrack)', '99 FX 3 (crystal)', '100 FX 4 (atmosphere)', '101 FX 5 (brightness)', '102 FX 6 (goblins)', '103 FX 7 (echoes)', '104 FX 8 (sci-fi)'],
  'Ethnic': ['105 Sitar', '106 Banjo', '107 Shamisen', '108 Koto', '109 Kalimba', '110 Bagpipe', '111 Fiddle', '112 Shanai'],
  'Percussive': ['113 Tinkle Bell', '114 Agogo', '115 Steel Drums', '116 Woodblock', '117 Taiko Drum', '118 Melodic Tom', '119 Synth Drum'],
  'Sound effects': ['120 Reverse Cymbal', '121 Guitar Fret Noise', '122 Breath Noise', '123 Seashore', '124 Bird Tweet', '125 Telephone Ring', '126 Helicopter', '127 Applause', '128 Gunshot']
});

// channel-tracker
MIDI.channels = (function () { // 0 - 15 channels
  var channels = {};
  for (var n = 0; n < 16; n++) {
    channels[n] = { // default values
      instrument: 0,
      // Acoustic Grand Piano
      mute: false,
      mono: false,
      omni: false,
      solo: false
    };
  }
  return channels;
})();

//
MIDI.pianoKeyOffset = 21;

// note conversions
MIDI.keyToNote = {}; // C8  == 108
MIDI.noteToKey = {}; // 108 ==  C8
(function () {
  var A0 = 0x15; // first note
  var C8 = 0x6C; // last note
  var number2key = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
  for (var n = A0; n <= C8; n++) {
    var octave = (n - 12) / 12 >> 0;
    var name = number2key[n % 12] + octave;
    MIDI.keyToNote[name] = n;
    MIDI.noteToKey[n] = name;
  }
})();

/*
   Copyright (c) 2011, Daniel Guerrero
   All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions are met:
 * Redistributions of source code must retain the above copyright
 notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 notice, this list of conditions and the following disclaimer in the
 documentation and/or other materials provided with the distribution.
 * Neither the name of the Daniel Guerrero nor the
 names of its contributors may be used to endorse or promote products
 derived from this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL DANIEL GUERRERO BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var Base64Binary = {
  _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

  /* will return a  Uint8Array type */
  decodeArrayBuffer: function(input) {
    var bytes = Math.ceil( (3*input.length) / 4.0);
    var ab = new ArrayBuffer(bytes);
    this.decode(input, ab);

    return ab;
  },

  decode: function(input, arrayBuffer) {
    //get last chars to see if are valid
    var lkey1 = this._keyStr.indexOf(input.charAt(input.length-1));		 
    var lkey2 = this._keyStr.indexOf(input.charAt(input.length-1));		 

    var bytes = Math.ceil( (3*input.length) / 4.0);
    if (lkey1 == 64) bytes--; //padding chars, so skip
    if (lkey2 == 64) bytes--; //padding chars, so skip

    var uarray;
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    var j = 0;

    if (arrayBuffer)
      uarray = new Uint8Array(arrayBuffer);
    else
      uarray = new Uint8Array(bytes);

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    for (i=0; i<bytes; i+=3) {	
      //get the 3 octects in 4 ascii chars
      enc1 = this._keyStr.indexOf(input.charAt(j++));
      enc2 = this._keyStr.indexOf(input.charAt(j++));
      enc3 = this._keyStr.indexOf(input.charAt(j++));
      enc4 = this._keyStr.indexOf(input.charAt(j++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      uarray[i] = chr1;			
      if (enc3 != 64) uarray[i+1] = chr2;
      if (enc4 != 64) uarray[i+2] = chr3;
    }

    return uarray;	
  }
};
