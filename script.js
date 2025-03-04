// Total time in seconds (20 hours)
const totalTime = 72000;

// Cookie helper functions
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
  }
  return null;
}
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

let remainingTime = totalTime;
const savedTime = getCookie("remainingTime");
if (savedTime !== null) {
  remainingTime = parseInt(savedTime, 10);
}

let paused = false;

// Global timer: update remainingTime every second.
let globalTimerInterval = setInterval(() => {
  if (!paused) {
    remainingTime--;
    if (remainingTime <= 0) {
      remainingTime = 0;
      clearInterval(globalTimerInterval);
    }
  }
}, 1000);

const holder = document.getElementById('holder');
let candle = document.getElementById('candle');
const pauseButton = document.getElementById('pause-button');
const resetButton = document.getElementById('reset-button');
const timerButton = document.getElementById('timer-button');
const saveButton = document.getElementById('save-button');

// Variables for local timer display (shown only when Timer button is clicked)
let localTimerInterval;
let localHideTimeout;

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs}h ${mins}m ${secs}s`;
}

// Timer button: on click, show the countdown for 10 seconds.
timerButton.addEventListener('click', () => {
  clearInterval(localTimerInterval);
  clearTimeout(localHideTimeout);
  
  timerButton.textContent = formatTime(remainingTime);
  localTimerInterval = setInterval(() => {
    timerButton.textContent = formatTime(remainingTime);
  }, 1000);
  
  localHideTimeout = setTimeout(() => {
    clearInterval(localTimerInterval);
    timerButton.textContent = "Timer";
  }, 10000);
});

// Save button: store the current remainingTime in a cookie (lasting 7 days).
saveButton.addEventListener('click', () => {
  setCookie("remainingTime", remainingTime, 7);
  saveButton.textContent = "Saved!";
  setTimeout(() => {
    saveButton.textContent = "Save";
  }, 2000);
});

// Create a new candle element (with the melt animation)
function createCandle() {
  const newCandle = document.createElement('div');
  newCandle.id = 'candle';
  newCandle.className = 'candle';
  newCandle.innerHTML = '<div class="thread"></div><div class="flame"></div>';
  return newCandle;
}

// Pause button: toggle pause/resume.
// When pausing, the candle's melt animation is paused and the flame is animated to blow away.
// When resuming, the candle continues melting and the flame is restored.
pauseButton.addEventListener('click', () => {
  const flame = candle.querySelector('.flame');
  if (!paused) {
    // Pause: freeze candle animation using animation-play-state.
    candle.style.animationPlayState = "paused";
    // Animate the flame to blow away.
    if (flame) {
      flame.style.animation = "blowAway 1s forwards";
    }
    paused = true;
    pauseButton.textContent = "Resume";
  } else {
    // Resume: set animationPlayState to running.
    candle.style.animationPlayState = "running";
    // Bring back the flame by clearing inline styles.
    if (flame) {
      flame.style.animation = "";
      flame.style.opacity = "1";
    }
    paused = false;
    pauseButton.textContent = "Pause";
  }
});

// Reset button: remove the current candle, create a new one, and reset the timer.
resetButton.addEventListener('click', () => {
  if (candle) {
    candle.remove();
  }
  candle = createCandle();
  holder.appendChild(candle);
  
  remainingTime = totalTime;
  paused = false;
  clearInterval(globalTimerInterval);
  globalTimerInterval = setInterval(() => {
    if (!paused) {
      remainingTime--;
      if (remainingTime <= 0) {
        remainingTime = 0;
        clearInterval(globalTimerInterval);
      }
    }
  }, 1000);
  timerButton.textContent = "Timer";
  pauseButton.textContent = "Pause";
});
