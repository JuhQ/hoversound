var log = [];
var lastTime = 0;

window.onload = function() {
  var body = document.body;
  document.onmousemove = function(event) {
    var hertz = event.clientX + event.clientY
    createBeep(hertz);

    var color = "#" + intToARGB(hertz * hertz);
    console.log("color", color)
    body.style.background = color;

  }
};

var intToARGB = function(i) {
  var h;
  h =
    (i >> 24 & 0xFF).toString(16) +
    (i >> 16 & 0xFF).toString(16) +
    (i >> 8 & 0xFF).toString(16) +
    (i & 0xFF).toString(16);

  return h.substring(0, 6);
};

var saveLog = function(hertz) {
  if(!log.length) {
    lastTime = new Date().getTime();
  }

  data = {
    hertz: hertz,
    delay: new Date().getTime() - lastTime
  }

  log.push(data);

  lastTime = new Date().getTime();
};


var createBeep = function(hertz, skipLog) {

  if(!skipLog) {
    saveLog(hertz);
  }

  if(webkitAudioContext || AudioContext) {
    if(AudioContext) {
      var audioContextFunction = AudioContext;
    } else {
      var audioContextFunction = webkitAudioContext;
    }

    window.audioContext = window.audioContext || new audioContextFunction();
    var oscillator = window.audioContext.createOscillator();
    oscillator.connect(window.audioContext.destination);

    oscillator.type = 'square';
    oscillator.frequency.value = hertz; // value in hertz
    oscillator.start();

    setTimeout(function() {
      oscillator.stop();
    }, 400)
  }
};

var timeout = null;

var runLog = function(currentItem) {
  var currentItem = currentItem || 0;

  console.log("log[currentItem].hertz", log[currentItem].hertz)

  createBeep(log[currentItem].hertz, true);

  if(timeout) {
    clearTimeout(timeout);
  }

  timeout = setTimeout(function() {
    if(currentItem + 1 >= log.length) {
      if(timeout) {
        clearTimeout(timeout);
      }
      return false;
    }

    runLog(currentItem + 1);

  }, log[currentItem].delay);
};