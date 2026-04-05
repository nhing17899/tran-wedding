/** Live countdown to the wedding date: 09.07.2026 (July 9, 2026) */
const WEDDING_DATE = new Date('2026-07-09T11:00:00');

export function startCountdown() {
  const container = document.getElementById('countdown');
  if (!container) return;

  function pad(n) { return String(n).padStart(2, '0'); }

  let intervalId;

  function render() {
    const diff = WEDDING_DATE - Date.now();

    if (diff <= 0) {
      container.innerHTML = `<p class="countdown-label" style="font-size:1.2rem">
        Today is the day! ♥
      </p>`;
      clearInterval(intervalId); // stop ticking once the date has passed
      return;
    }

    const days    = Math.floor(diff / 864e5);
    const hours   = Math.floor((diff / 36e5) % 24);
    const minutes = Math.floor((diff / 6e4) % 60);
    const seconds = Math.floor((diff / 1e3) % 60);

    container.innerHTML = `
      <div class="countdown-unit">
        <span class="countdown-number">${days}</span>
        <span class="countdown-label">Days</span>
      </div>
      <div class="countdown-unit">
        <span class="countdown-number">${pad(hours)}</span>
        <span class="countdown-label">Hours</span>
      </div>
      <div class="countdown-unit">
        <span class="countdown-number">${pad(minutes)}</span>
        <span class="countdown-label">Minutes</span>
      </div>
      <div class="countdown-unit">
        <span class="countdown-number">${pad(seconds)}</span>
        <span class="countdown-label">Seconds</span>
      </div>
    `;
  }

  render();
  intervalId = setInterval(render, 1000);
}
