var nillDisplay = '- -';
var errorDisplay = '! !';
var winnerDisplay = '* *';
var plays = []; // order that should be clicked


/**
 * @return {Boolean} - whether or not the game is switched on
 */
function isOn() {
  return $('#on-switch').hasClass('switch-on');
}
/**
 * @return {Boolean} - whether or not strict mode is on
 */
function isStrict() {
  return $('.strict-indicator').hasClass('strict-indicator-on');
}
function toggleButtons(enable) {
  $('.green-quarter')[enable ? 'addClass' : 'removeClass']('green-quarter-on');
  $('.red-quarter')[enable ? 'addClass' : 'removeClass']('red-quarter-on');
  $('.yellow-quarter')[enable ? 'addClass' : 'removeClass']('yellow-quarter-on');
  $('.blue-quarter')[enable ? 'addClass' : 'removeClass']('blue-quarter-on');
}
function isButtonsEnabled() {
  return $('.green-quarter').hasClass('green-quarter-on') &&
    $('.red-quarter').hasClass('red-quarter-on') &&
    $('.yellow-quarter').hasClass('yellow-quarter-on') &&
    $('.blue-quarter').hasClass('blue-quarter-on');
}
/**
 * Toggle the on switch and the display text
 */
function toggleOnSwitch(obj, event) {
  if (isComputerPlaying) {
    return;
  }
  var entries = $('.switch').toArray();
  $(entries[0]).toggleClass('switch-on');
  $(entries[1]).toggleClass('switch-on');
  $('.counter-display').toggleClass('counter-display-off');
  if (!isOn()) {

    $('.counter-display').text(nillDisplay);
    toggleButtons(false);
    plays = [];

  }
}
/**
 * Toggle the error display color to indicate an something to the user.
 */
function flashErrorDisplay() {
  $('.counter-display').toggleClass('counter-display-off');
}

/**
 * Change the message displayed to the user
 */
function changeDisplay(msg) {
  $('.counter-display').text(msg);
}

var isComputerPlaying = false;
function pressStart() {
  if (!isOn() || isComputerPlaying) {
    return;
  }
  plays = [];
  isComputerPlaying = true;
  var intervalCount = 0;
  var displayFlash = setInterval(function() {
    $('.counter-display').toggleClass('counter-display-off');
    if (intervalCount++ == 3) {
      clearInterval(displayFlash);
      generateNewMove();
      indicatePattern();
    }
  }, 250);

}
var audio = new (window.AudioContext || window.webkitAudioContext)();
var gain = audio.createGain();
var frequencies = {
  0: 350,
  1: 275,
  2: 200,
  3: 130
};
var oscillators = []

function generateOscillator(freq) {
  var osc = audio.createOscillator();
  osc.type = 'square';
  osc.connect(audio.destination);
  osc.connect(gain);
  try {
    osc.frequency.value = freq;
  } catch (e) {
    console.log(freq);
    console.log(e);
  }
  return osc;
}
/**
 * Create a new move for the and add it to the moves array
 */
function generateNewMove() {
  plays[plays.length] = Math.round(Math.random() * 3);
  changeDisplay(plays.length < 10 ? '0' + String(plays.length) : plays.length);
}

var patternRepeatInterval;
function buildPatternRepeatInterval() {
  // if (patternRepeatInterval != undefined) {
  clearInterval(patternRepeatInterval);
  // }
  patternRepeatInterval = setInterval(function() {
    indicatePattern();
    clicks = 0;
    clearInterval(patternRepeatInterval);
  }, 5500);
}
/**
 * Show the pattern that should be played for the player
 */
function indicatePattern() {
  toggleButtons(false);
  isComputerPlaying = true;

  var counter = 0;
  var classes = {
    0: 'green-quarter-press',
    1: 'red-quarter-press',
    2: 'yellow-quarter-press',
    3: 'blue-quarter-press'
  };

  /*
    activate the button action
    triggers a visual and audible cue to indicate the
    pattern
   */
  function activate() {
    $('#q' + plays[counter]).addClass(classes[plays[counter]]);
    var osc = generateOscillator(frequencies[plays[counter]]);
    osc.start(0.0);
    oscillators[counter] = osc;
    setTimeout(function() {
      $('#q' + plays[counter]).removeClass(classes[plays[counter]]);
      oscillators[counter].stop();
      if (++counter < plays.length) {
        setTimeout(activate, 250);
      } else {
        toggleButtons(true);
        isComputerPlaying = false;
        oscillators = [];
        buildPatternRepeatInterval();
      }
    }, 750);
  }
  if (plays.length > 0) {
    activate();
  } else {
    isComputerPlaying = false;
  }
}
/**
 * Handle the strict switch press
 */
function handleStrict() {
  if (isOn()) {
    $('.strict-indicator').toggleClass('strict-indicator-on');
  }
}

var playerOscillator;
var errorInterval;
/**
 * Handle player click on colored button
 * @param  {[type]} num [description]
 * @return {[type]}     [description]
 */
function handleClick(num) {
  if (!isOn() || !isButtonsEnabled()) {
    return;
  }
  if (playerOscillator == undefined) {
    playerOscillator = generateOscillator(frequencies[num]);
    playerOscillator.start(0.0);
    if (!checkMove(num)) {
      changeDisplay(errorDisplay);
      errorInterval = setInterval(function() {
        flashErrorDisplay();
      }, 250);
      clicks = 0;
    }
  } else {
    buildPatternRepeatInterval();
    playerOscillator.stop();
    playerOscillator = undefined;
    if (errorInterval) {
      toggleButtons(false);
      if (!isStrict()) {
        setTimeout(function() {
          clearInterval(errorInterval);
          $('.counter-display').removeClass('counter-display-off');
          errorInterval = undefined;
          changeDisplay(plays.length < 10 ? '0' + String(plays.length) : plays.length);
          clearInterval(patternRepeatInterval);
          indicatePattern();
        }, 750);
      } else {
        setTimeout(function() {
          plays = [];
          clearInterval(errorInterval);
          $('.counter-display').removeClass('counter-display-off');
          errorInterval = undefined;
          changeDisplay(plays.length < 10 ? '0' + String(plays.length) : plays.length);
          generateNewMove();
          clearInterval(patternRepeatInterval);
          indicatePattern();
        }, 750);
      }
    } else if (clicks == 20) {

      clearInterval(patternRepeatInterval);
      toggleButtons(false);
      changeDisplay(winnerDisplay);
      var counter = 0;
      var freq1 = 400;
      var freq2 = 600;
      var freq = freq1;
      var osc = generateOscillator(freq);
      setTimeout(function() {
        osc.start();
        var interval = setInterval(function() {
          flashErrorDisplay();
          osc.stop();
          freq = freq == freq1 ? freq2 : freq1;
          osc = generateOscillator(freq);
          osc.start(0.0);
          if (counter++ == 5) {
            clearInterval(interval);
            osc.stop();
            pressStart();
          }
        }, 500);
      }, 500);

    } else if (clicks == plays.length) {
      // disable buttons and generate next move
      toggleButtons(false);
      setTimeout(function() {
        generateNewMove();
        clearInterval(patternRepeatInterval);
        indicatePattern();
      }, 750);
      clicks = 0;
    }
  }
}
var clicks = 0;
function checkMove(num) {
  return plays[clicks++] == num;
}
/*
pressing start flashes the nill indicator, then the note plays and 01 displays.
When the first light plays, the indicator increments;

after a pattern is indicated, if build an interval for which a user has to act.
This should run every 4 seconds and indicate the pattern. If a user acts, disable the interval

switching off should disable all oscillators
 */
