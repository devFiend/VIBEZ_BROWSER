/**
 * Interactive controller for Vibez Browser New Tab Dashboard.
 */

document.addEventListener('DOMContentLoaded', () => {
  const clockDisplay = document.getElementById('clock-display');
  const dateDisplay = document.getElementById('date-display');
  const greetingDisplay = document.getElementById('greeting-display');
  const homeSearchInput = document.getElementById('home-search-input');

  // Real-time Clock & Greeting
  function updateTimeAndGreeting() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    clockDisplay.textContent = `${hours}:${minutes}`;

    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    dateDisplay.textContent = now.toLocaleDateString(undefined, options);

    let greeting = 'Good evening';
    if (hours >= 5 && hours < 12) {
      greeting = 'Good morning';
    } else if (hours >= 12 && hours < 18) {
      greeting = 'Good afternoon';
    }
    greetingDisplay.textContent = `${greeting}, devFiend`;
  }

  updateTimeAndGreeting();
  setInterval(updateTimeAndGreeting, 1000);

  // Search Bar Handler
  homeSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = homeSearchInput.value.trim();
      if (!val) return;

      let targetUrl = val;
      if (!/^https?:\/\//i.test(val)) {
        if (val.includes('.') && !val.includes(' ')) {
          targetUrl = 'https://' + val;
        } else {
          targetUrl = `https://www.google.com/search?q=${encodeURIComponent(val)}`;
        }
      }

      window.location.href = targetUrl;
    }
  });

  // Hotkey: pressing '/' focuses search immediately
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== homeSearchInput) {
      e.preventDefault();
      homeSearchInput.focus();
    }
  });
});
