import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initParticles } from './particles.js';
import { startCountdown } from './countdown.js';

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════
   PARTICLES
   ══════════════════════════════════════════ */
initParticles();

/* ══════════════════════════════════════════
   SCROLL LOCK  — freeze until envelope opens
   ══════════════════════════════════════════ */
document.body.classList.add('scroll-locked');

function blockTouch(e) { e.preventDefault(); }
document.addEventListener('touchmove', blockTouch, { passive: false });

function unlockScroll() {
  document.body.classList.remove('scroll-locked');
  document.removeEventListener('touchmove', blockTouch);
}

/* ══════════════════════════════════════════
   ENVELOPE OPEN
   ══════════════════════════════════════════ */
const scene      = document.getElementById('envelope-scene');
const invitation = document.getElementById('invitation');
let opened = false;

gsap.from(scene, { opacity: 0, scale: 0.97, duration: 1.2, ease: 'power3.out' });

function openEnvelope() {
  if (opened) return;
  opened = true;

  const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' }, onComplete: showInvitation });

  // Physical "tenting" lift, then sweep upward
  tl.to('#env-flap-unit', { y: '-4vh', duration: 0.25, ease: 'power2.out' });
  tl.to('#env-flap-unit', { y: '-105vh', duration: 1.0 });
  tl.to(scene,            { opacity: 0, duration: 1.0, ease: 'power2.inOut' }, '-=0.6');
}

document.getElementById('env-stamp').addEventListener('click', openEnvelope);

/* ══════════════════════════════════════════
   SHOW INVITATION + HERO ANIMATION
   ══════════════════════════════════════════ */
function showInvitation() {
  scene.style.display = 'none';
  unlockScroll();
  invitation.classList.remove('hidden');

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Hero elements cascade in
  tl.from(invitation,       { y: 40, opacity: 0, duration: 0.8 });
  tl.from('.inv-save-date', { y: 24, opacity: 0, duration: 0.7 }, '-=0.35');
  tl.from('.inv-name-1',    { x: -60, opacity: 0, duration: 0.9 }, '-=0.4');
  tl.from('.inv-amp',       { scale: 0, opacity: 0, duration: 0.5, ease: 'back.out(2)' }, '-=0.4');
  tl.from('.inv-name-2',    { x: 60,  opacity: 0, duration: 0.9 }, '-=0.5');
  tl.from('.inv-date-plain',{ y: 20,  opacity: 0, duration: 0.6 }, '-=0.3');
  tl.from('.scroll-indicator', { opacity: 0, y: -10, duration: 0.5 }, '-=0.2');

  tl.call(() => {
    initScrollAnimations();
    startCinematicScroll();
    showMusicToggle();
  });

  startCountdown();
}

/* ══════════════════════════════════════════
   CINEMATIC AUTO-SCROLL
   Any interaction pauses scroll and resumes
   automatically 7 s after the user goes idle.
   Only permanently stops when the page end is reached.
   ══════════════════════════════════════════ */
function startCinematicScroll() {
  const DELAY_MS = 800;
  const SPEED_PX = 1.0;

  // Disable CSS smooth-scroll — each scrollBy() queues its own animation,
  // causing stutter at 60 calls/s.
  document.documentElement.style.scrollBehavior = 'auto';

  let active = true, paused = false, rafId = null, resumeTimer = null;

  function scheduleResume() {
    if (resumeTimer) clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      resumeTimer = null;
      if (!active) return;
      paused = false;
      rafId = requestAnimationFrame(tick);
    }, 5000);
  }

  function pause() {
    paused = true;
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    if (resumeTimer) { clearTimeout(resumeTimer); resumeTimer = null; }
  }

  function stop() {
    if (!active) return;
    active = false;
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    if (resumeTimer) { clearTimeout(resumeTimer); resumeTimer = null; }
    document.documentElement.style.scrollBehavior = '';
    window.removeEventListener('wheel',      onWheel);
    window.removeEventListener('keydown',    onKey);
    window.removeEventListener('touchstart', onPressStart);
    window.removeEventListener('touchend',   onPressEnd);
    window.removeEventListener('touchcancel',onPressEnd);
    window.removeEventListener('mousedown',  onPressStart);
    window.removeEventListener('mouseup',    onPressEnd);
  }

  // Touch / mouse click: pause while held, start 7s timer on release
  function onPressStart() { pause(); }
  function onPressEnd()   { if (active) scheduleResume(); }

  // Wheel & keyboard: pause immediately, auto-resume after 7 s of inactivity
  function onWheel()  { pause(); scheduleResume(); }
  function onKey(e)   {
    if (['ArrowUp','ArrowDown','PageUp','PageDown',' '].includes(e.key)) {
      pause(); scheduleResume();
    }
  }

  window.addEventListener('wheel',       onWheel,      { passive: true });
  window.addEventListener('keydown',     onKey);
  window.addEventListener('touchstart',  onPressStart, { passive: true });
  window.addEventListener('touchend',    onPressEnd);
  window.addEventListener('touchcancel', onPressEnd);
  window.addEventListener('mousedown',   onPressStart);
  window.addEventListener('mouseup',     onPressEnd);

  function tick() {
    if (!active || paused) return;
    if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 4) { stop(); return; }
    window.scrollBy(0, SPEED_PX);
    rafId = requestAnimationFrame(tick);
  }

  setTimeout(() => { if (active && !paused) rafId = requestAnimationFrame(tick); }, DELAY_MS);
}

/* ══════════════════════════════════════════
   SCROLL-TRIGGERED ANIMATIONS
   Every section has a reveal animation.
   ══════════════════════════════════════════ */
function initScrollAnimations() {

  // ── Helper: reveal any .animate-on-scroll element ──────────
  // Staggered entry for children of a container
  function revealGroup(trigger, targets, stagger = 0.12, opts = {}) {
    gsap.to(targets, {
      scrollTrigger: { trigger, start: 'top 82%', toggleActions: 'play none none none' },
      y: 0, opacity: 1, duration: 0.75, stagger, ease: 'power3.out', ...opts,
    });
  }

  // ── Details section ────────────────────────────────────────
  revealGroup('.inv-details', ['.details-quote', '.details-couple', '.details-invite'], 0.15);
  revealGroup('.details-info', '.detail-item', 0.14);
  revealGroup('.inv-details', ['#save-to-cal'], 0, { delay: 0.6 });

  // ── Program section ────────────────────────────────────────
  gsap.utils.toArray('.section-title').forEach(el => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none none' },
      y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
    });
  });
  revealGroup('.program-list', ['.program-block', '.program-divider'], 0.18);

  // ── Gallery: hero image fades in ────────────────────────────
  gsap.set('.gallery-hero-img', { opacity: 0 });
  gsap.to('.gallery-hero-img', {
    scrollTrigger: { trigger: '.inv-gallery', start: 'top 85%' },
    opacity: 1, duration: 1.0, ease: 'power2.out',
  });

  // ── Gallery: film strip slides in from the left ─────────────
  gsap.set('.film-strip', { x: -80 }); // establish start state before trigger fires
  gsap.to('.film-strip', {
    scrollTrigger: { trigger: '.inv-gallery', start: 'top 90%' },
    x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
  });

  // ── Gallery: film track elegantly scrolls to last frame ─────
  const filmTrack = document.querySelector('.film-track');
  if (filmTrack) {
    ScrollTrigger.create({
      trigger: '.inv-gallery',
      start: 'top 80%',
      once: true,
      onEnter: () => {
        // Wait for the strip slide-in to finish, then drift very slowly to the end
        gsap.to(filmTrack, {
          scrollLeft: filmTrack.scrollWidth,
          duration: 9,
          ease: 'power1.in',
          delay: 1.2,
        });
      },
    });
  }

  // ── Gallery: polaroids slide in from sides into their rotated positions ──
  gsap.utils.toArray('.polaroid').forEach((el, i) => {
    const targetRot = parseFloat(getComputedStyle(el).getPropertyValue('--rot')) || 0;
    // Alternate: odd polaroids from right, even from left
    const fromX = i % 2 === 0 ? 90 : -90;
    gsap.fromTo(el,
      { x: fromX, rotation: targetRot, opacity: 0, scale: 0.92 },
      {
        scrollTrigger: { trigger: '.polaroid-collage', start: 'top 85%' },
        x: 0, rotation: targetRot, opacity: 1, scale: 1,
        duration: 1.0, delay: i * 0.18, ease: 'power3.out',
      }
    );
  });

  // ── Gallery: text labels drift up and fade in elegantly ──────
  gsap.utils.toArray('.polaro-label').forEach((el, i) => {
    gsap.fromTo(el,
      { y: 18, opacity: 0 },
      {
        scrollTrigger: { trigger: '.polaroid-collage', start: 'top 85%' },
        y: 0, opacity: 1, duration: 1.1, delay: 0.5 + i * 0.25, ease: 'power2.out',
      }
    );
  });

  // ── Countdown section ───────────────────────────────────────
  revealGroup('.inv-countdown-section', ['.countdown-eyebrow', '.countdown', '.countdown-bottom-date'], 0.14);

  // ── Footer ──────────────────────────────────────────────────
  revealGroup('.inv-footer',
    ['.thankyou-label', '.thankyou-names', '.thankyou-text', '.thankyou-date'],
    0.16
  );
}

/* ══════════════════════════════════════════
   MUSIC TOGGLE  (shown only when src is set)
   ══════════════════════════════════════════ */
function showMusicToggle() {
  const btn   = document.getElementById('music-toggle');
  const audio = document.getElementById('bg-music');
  if (!btn || !audio) return;
  if (!audio.querySelector('source')) return; // audio.src always returns page URL when unset

  btn.classList.remove('hidden');
  gsap.from(btn, { opacity: 0, scale: 0.5, duration: 0.5, ease: 'back.out(2)' });

  let playing = false;
  btn.addEventListener('click', () => {
    if (playing) {
      audio.pause();
      btn.classList.remove('playing');
      btn.classList.add('muted');
    } else {
      audio.volume = 0.35;
      audio.play().catch(() => {});
      btn.classList.add('playing');
      btn.classList.remove('muted');
    }
    playing = !playing;
  });
}

/* ══════════════════════════════════════════
   SAVE TO CALENDAR
   Generates an .ics file the user downloads —
   works with Google Calendar, Apple Calendar,
   Outlook, and any other calendar app.
   ══════════════════════════════════════════ */
document.getElementById('save-to-cal')?.addEventListener('click', () => {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Tran & Adam Wedding//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'DTSTART:20260709T110000',
    'DTEND:20260709T130000',
    'SUMMARY:Tran & Adam Wedding',
    'LOCATION:Nha Hang Golden Phoenix\\, 280 Trung Nu Vuong\\, Danang\\, Vietnam',
    'DESCRIPTION:Join us to celebrate our wedding! We cannot wait to share this day with you.',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: 'tran-adam-wedding.ics' });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});
