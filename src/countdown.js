/** Countdown to the wedding date */
const WEDDING_DATE = new Date('2026-10-10T16:00:00');

export function startCountdown() {
  const container = document.getElementById('countdown');
  if (!container) return;

  function render() {
    const now = new Date();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
      container.innerHTML = '<p class="countdown-label" style="font-size:1.2rem">Today is the day! 🎉</p>';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    container.innerHTML = `
      <div class="countdown-unit">
        <span class="countdown-number">${days}</span>
        <span class="countdown-label">Days</span>
      </div>
      <div class="countdown-unit">
        <span class="countdown-number">${hours}</span>
        <span class="countdown-label">Hours</span>
      </div>
      <div class="countdown-unit">
        <span class="countdown-number">${minutes}</span>
        <span class="countdown-label">Minutes</span>
      </div>
      <div class="countdown-unit">
        <span class="countdown-number">${seconds}</span>
        <span class="countdown-label">Seconds</span>
      </div>
    `;
  }

  render();
  setInterval(render, 1000);
}
