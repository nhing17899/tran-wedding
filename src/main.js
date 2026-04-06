import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initParticles } from './particles.js';
import { startCountdown } from './countdown.js';

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════
   LOCATION DATA
   ══════════════════════════════════════════ */
const LOCATIONS = {
  vietnam: {
    envelopeNames:  'Tran & Adam',
    heroName1:      'Tran',
    heroName2:      'Adam',
    heroDate:       '09 · 07 · 2026',
    detailsCouple:  'Tran & Adam',
    venues: [
      {
        title:   'Venue',
        name:    'Nha Hang Golden Phoenix',
        mapLink: 'https://www.google.com/maps/search/Golden+Phoenix+Restaurant+Danang+Vietnam',
        mapText: '📍 Đường 2 Tháng 9, Đà Nẵng',
      },
    ],
    detailDate:     '09.07.2026',
    detailTime:     '11:00 – 14:00',
    ceremonyTitle:  'Ceremony',
    ceremonyItems:  [
      { time: '11:00', desc: 'Guest Arrival' },
      { time: '11:15', desc: 'Photoshoot' },
      { time: '11:30', desc: 'Wedding Ceremony' },
    ],
    receptionTitle: 'Reception Lunch',
    receptionItems: [
      { time: '12:00', desc: 'Lunch & Toast' },
      { time: '13:15', desc: 'Bouquet Toss' },
      { time: '13:30', desc: 'Farewell' },
    ],
    countdownDate:  new Date('2026-07-09T11:00:00'),
    countdownLabel: '09 · 07 · 2026',
    footerNames:    'Tran & Adam',
    footerDate:     '09 · 07 · 2026',
    calDtstart:     '20260709T110000',
    calDtend:       '20260709T140000',
    calSummary:     'Tran & Adam Wedding',
    calLocation:    'Nha Hang Golden Phoenix\\, Duong 2/9\\, Danang\\, Vietnam',
    calFilename:    'tran-adam-wedding-vietnam.ics',
    hasDinner:      false,
  },
  hungary: {
    envelopeNames:  'Adam & Tran',
    heroName1:      'Adam',
    heroName2:      'Tran',
    heroDate:       '18 · 07 · 2026',
    detailsCouple:  'Adam & Tran',
    venues: [
      {
        title:   'Ceremony',
        name:    'Festetics-kastely',
        mapLink: 'https://www.google.com/maps/search/Festetics+kastely+Keszthely+Hungary',
        mapText: '📍 Keszthely, Hungary',
      },
      {
        title:   'Dinner',
        name:    'Halaszcsarda',
        mapLink: 'https://www.google.com/maps/search/Halaszcsarda+Keszthely+Hungary',
        mapText: '📍 Keszthely, Hungary',
      },
    ],
    detailDate:     '18.07.2026',
    detailTime:     '1PM – 9PM',
    ceremonyTitle:  'Ceremony',
    ceremonyItems:  [
      { time: '12:30', desc: 'Guest Arrival' },
      { time: '13:00', desc: 'Wedding Ceremony' },
      { time: '14:00', desc: 'Photoshoot' },
    ],
    receptionTitle: 'Reception Dinner',
    receptionItems: [
      { time: '15:30', desc: 'Guest Arrival' },
      { time: '16:00', desc: 'Dinner & Toast' },
      { time: '18:00', desc: 'Party Time & Bouquet Toss' },
      { time: '21:00', desc: 'Farewell' },
    ],
    countdownDate:  new Date('2026-07-18T13:00:00'),
    countdownLabel: '18 · 07 · 2026',
    footerNames:    'Adam & Tran',
    footerDate:     '18 · 07 · 2026',
    calDtstart:     '20260718T130000',
    calDtend:       '20260718T210000',
    calSummary:     'Adam & Tran Wedding',
    calLocation:    'Festetics-kastely\\, Keszthely\\, Hungary',
    calFilename:    'adam-tran-wedding-hungary.ics',
    hasDinner:      true,
  },
};

/* ══════════════════════════════════════════
   STATE
   ══════════════════════════════════════════ */
let selectedLocation = null;
let opened           = false;
const rsvpState      = { ceremony: null, dinner: null };

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
   LOCATION OVERLAY
   Shown immediately on load — the flap/stamp
   are hidden behind it until a location is picked.
   ══════════════════════════════════════════ */
const locationOverlay = document.getElementById('location-overlay');

// Overlay fades in with the scene (parent); no extra delay needed.
// Flap unit is CSS opacity:0 and only reveals after selection.
gsap.from(locationOverlay, { opacity: 0, y: 16, duration: 0.6, ease: 'power2.out', delay: 0.5 });

document.querySelectorAll('.location-choice-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedLocation = btn.dataset.loc;
    applyLocation(selectedLocation);

    // Dismiss overlay, then reveal the envelope flap + stamp + text
    gsap.to(locationOverlay, {
      opacity: 0, y: -16, duration: 0.4, ease: 'power2.in',
      onComplete: () => {
        locationOverlay.classList.add('hidden');
        gsap.to('#env-flap-unit', { opacity: 1, duration: 0.7, ease: 'power3.out' });
      },
    });
  });
});

/* ══════════════════════════════════════════
   APPLY LOCATION
   Updates all dynamic content in the DOM.
   ══════════════════════════════════════════ */
function applyLocation(loc) {
  const d = LOCATIONS[loc];

  // Envelope text
  document.querySelector('.env-invite-names').textContent = d.envelopeNames;

  // Hero
  document.querySelector('.inv-name-1').textContent  = d.heroName1;
  document.querySelector('.inv-name-2').textContent  = d.heroName2;
  document.querySelector('.inv-date-plain').textContent = d.heroDate;

  // Details couple names
  document.querySelector('.details-couple').textContent = d.detailsCouple;

  // Venue — rendered dynamically to support 1 (Vietnam) or 2 (Hungary) venues
  document.getElementById('detail-venue-container').innerHTML = d.venues.map((v, i) => `
    <h3 class="detail-label"${i > 0 ? ' style="margin-top:1.4rem"' : ''}>${v.title}</h3>
    <p class="detail-value">${v.name}</p>
    <a class="detail-map-link" href="${v.mapLink}" target="_blank" rel="noopener noreferrer">${v.mapText}</a>
  `).join('');

  // Date / Time
  document.getElementById('detail-date-value').textContent = d.detailDate;
  document.getElementById('detail-time-value').textContent = d.detailTime;

  // Program
  const renderItems = items => items.map(({ time, desc }) => `
    <div class="program-item">
      <span class="program-time">${time}</span>
      <span class="program-desc">${desc}</span>
    </div>`).join('');

  document.getElementById('program-ceremony-title').textContent  = d.ceremonyTitle;
  document.getElementById('program-ceremony-items').innerHTML    = renderItems(d.ceremonyItems);
  document.getElementById('program-reception-title').textContent = d.receptionTitle;
  document.getElementById('program-reception-items').innerHTML   = renderItems(d.receptionItems);

  // Countdown label
  document.getElementById('countdown-date-display').textContent = d.countdownLabel;

  // Footer
  document.querySelector('.thankyou-names').textContent = d.footerNames;
  document.getElementById('footer-date').textContent    = d.footerDate;

  // RSVP — show dinner + extra guests only for Hungary
  document.getElementById('rsvp-dinner-field').classList.toggle('hidden', !d.hasDinner);
  document.getElementById('rsvp-extra-field').classList.toggle('hidden', !d.hasDinner);
}

/* ══════════════════════════════════════════
   ENVELOPE OPEN
   ══════════════════════════════════════════ */
const scene      = document.getElementById('envelope-scene');
const invitation = document.getElementById('invitation');

gsap.from(scene, { opacity: 0, scale: 0.97, duration: 1.2, ease: 'power3.out' });

function openEnvelope() {
  if (!selectedLocation || opened) return;
  opened = true;

  const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' }, onComplete: showInvitation });
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
  tl.from(invitation,          { y: 40, opacity: 0, duration: 0.8 });
  tl.from('.inv-save-date',    { y: 24, opacity: 0, duration: 0.7 }, '-=0.35');
  tl.from('.inv-name-1',       { x: -60, opacity: 0, duration: 0.9 }, '-=0.4');
  tl.from('.inv-amp',          { scale: 0, opacity: 0, duration: 0.5, ease: 'back.out(2)' }, '-=0.4');
  tl.from('.inv-name-2',       { x: 60,  opacity: 0, duration: 0.9 }, '-=0.5');
  tl.from('.inv-date-plain',   { y: 20,  opacity: 0, duration: 0.6 }, '-=0.3');
  tl.from('.scroll-indicator', { opacity: 0, y: -10, duration: 0.5 }, '-=0.2');

  tl.call(() => {
    initScrollAnimations();
    startCinematicScroll();
    showMusicToggle();
    loadWishes(selectedLocation);
  });

  startCountdown(LOCATIONS[selectedLocation].countdownDate);
}

/* ══════════════════════════════════════════
   CINEMATIC AUTO-SCROLL
   ══════════════════════════════════════════ */
function startCinematicScroll() {
  const DELAY_MS = 800;
  const SPEED_PX = 0.8;

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
    window.removeEventListener('wheel',       onWheel);
    window.removeEventListener('keydown',     onKey);
    window.removeEventListener('touchstart',  onPressStart);
    window.removeEventListener('touchend',    onPressEnd);
    window.removeEventListener('touchcancel', onPressEnd);
    window.removeEventListener('mousedown',   onPressStart);
    window.removeEventListener('mouseup',     onPressEnd);
  }

  function onPressStart() { pause(); }
  function onPressEnd()   { if (active) scheduleResume(); }
  function onWheel()      { pause(); scheduleResume(); }
  function onKey(e) {
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

  // Stop permanently once the RSVP section is well into the upper part of the screen.
  // rootMargin '-65% 0px 0px 0px' at bottom means the observer fires only when
  // the section's top edge has crossed 35% from the top of the viewport — clearly visible.
  const rsvpEl = document.querySelector('.inv-rsvp');
  if (rsvpEl) {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { stop(); obs.disconnect(); } },
      { threshold: 0, rootMargin: '0px 0px -65% 0px' }
    );
    obs.observe(rsvpEl);
  }

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
   ══════════════════════════════════════════ */
function initScrollAnimations() {

  function revealGroup(trigger, targets, stagger = 0.12, opts = {}) {
    gsap.to(targets, {
      scrollTrigger: { trigger, start: 'top 82%', toggleActions: 'play none none none' },
      y: 0, opacity: 1, duration: 0.75, stagger, ease: 'power3.out', ...opts,
    });
  }

  // Details
  revealGroup('.inv-details', ['.details-quote', '.details-couple', '.details-invite'], 0.15);
  revealGroup('.details-info', '.detail-item', 0.14);
  revealGroup('.inv-details', ['#save-to-cal'], 0, { delay: 0.6 });

  // Program
  gsap.utils.toArray('.section-title').forEach(el => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none none' },
      y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
    });
  });
  revealGroup('.program-list', ['.program-block', '.program-divider'], 0.18);

  // Gallery
  gsap.set('.gallery-hero-img', { opacity: 0 });
  gsap.to('.gallery-hero-img', {
    scrollTrigger: { trigger: '.inv-gallery', start: 'top 85%' },
    opacity: 1, duration: 1.0, ease: 'power2.out',
  });

  gsap.set('.film-strip', { x: -80 });
  gsap.to('.film-strip', {
    scrollTrigger: { trigger: '.inv-gallery', start: 'top 90%' },
    x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
  });

  const filmTrack = document.querySelector('.film-track');
  if (filmTrack) {
    ScrollTrigger.create({
      trigger: '.inv-gallery', start: 'top 80%', once: true,
      onEnter: () => {
        gsap.to(filmTrack, { scrollLeft: filmTrack.scrollWidth, duration: 9, ease: 'power1.in', delay: 1.2 });
      },
    });
  }

  gsap.utils.toArray('.polaroid').forEach((el, i) => {
    const targetRot = parseFloat(getComputedStyle(el).getPropertyValue('--rot')) || 0;
    gsap.fromTo(el,
      { x: i % 2 === 0 ? 90 : -90, rotation: targetRot, opacity: 0, scale: 0.92 },
      {
        scrollTrigger: { trigger: '.polaroid-collage', start: 'top 85%' },
        x: 0, rotation: targetRot, opacity: 1, scale: 1,
        duration: 1.0, delay: i * 0.18, ease: 'power3.out',
      }
    );
  });

  gsap.utils.toArray('.polaro-label').forEach((el, i) => {
    gsap.fromTo(el,
      { y: 18, opacity: 0 },
      {
        scrollTrigger: { trigger: '.polaroid-collage', start: 'top 85%' },
        y: 0, opacity: 1, duration: 1.1, delay: 0.5 + i * 0.25, ease: 'power2.out',
      }
    );
  });

  // Countdown
  revealGroup('.inv-countdown-section', ['.countdown-eyebrow', '.countdown', '.countdown-bottom-date'], 0.14);

  // RSVP
  revealGroup('.inv-rsvp', ['.rsvp-form'], 0, { delay: 0.1 });

  // Footer is always visible — no scroll reveal needed
}

/* ══════════════════════════════════════════
   WISHES & GREETINGS
   ══════════════════════════════════════════ */
function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function loadWishes(location) {
  const section = document.getElementById('wishes-section');
  const list    = document.getElementById('wishes-list');
  if (!section || !list) return;

  gsap.fromTo(
    ['#wishes-section .section-title', '#wishes-section .wishes-subtitle'],
    { y: 28, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.75, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: section, start: 'top 82%', toggleActions: 'play none none none' } }
  );

  try {
    console.log('[wishes] fetching /api/wishes...');
    const res = await fetch(`/api/wishes?location=${encodeURIComponent(location)}`);
    console.log('[wishes] response status:', res.status);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log('[wishes] data:', data);
    const { wishes } = data;

    if (!wishes || !wishes.length) {
      console.log('[wishes] empty list');
      list.innerHTML = '<p class="wishes-empty">Be the first to leave a wish above!</p>';
      return;
    }

    list.innerHTML = wishes.map(w =>
      `<p class="wish-note">
        <span class="wish-note-quote">“${escHtml(w.message)}”</span>
        <span class="wish-note-author">— ${escHtml(w.name)} —</span>
      </p>`
    ).join('');

    // Stagger each note in on scroll
    gsap.to('.wish-note', {
      y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: list, start: 'top 85%', toggleActions: 'play none none none' },
    });

    // Scroll hint arrow — hide when wrap doesn't overflow or user reaches bottom
    const hint = document.getElementById('wishes-scroll-hint');
    const wrap = list.closest('.wishes-list-wrap') || list;
    if (hint) {
      const checkHint = () => {
        const atBottom = wrap.scrollHeight - wrap.scrollTop <= wrap.clientHeight + 4;
        const hasOverflow = wrap.scrollHeight > wrap.clientHeight;
        hint.classList.toggle('hidden', !hasOverflow || atBottom);
      };
      checkHint();
      wrap.addEventListener('scroll', checkHint, { passive: true });
    }

  } catch (err) {
    console.error('[wishes] fetch failed:', err);
    list.innerHTML = '<p class="wishes-empty">Wishes will appear here soon.</p>';
  }
}

/* ══════════════════════════════════════════
   MUSIC TOGGLE
   ══════════════════════════════════════════ */
function showMusicToggle() {
  const btn   = document.getElementById('music-toggle');
  const audio = document.getElementById('bg-music');
  if (!btn || !audio) return;
  if (!audio.querySelector('source')) return;

  btn.classList.remove('hidden');
  gsap.from(btn, { opacity: 0, scale: 0.5, duration: 0.5, ease: 'back.out(2)' });

  audio.volume = 0.35;
  let playing = false;
  audio.play().then(() => {
    playing = true;
    btn.classList.add('playing');
    btn.classList.remove('muted');
  }).catch(() => {});

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
   SAVE TO CALENDAR  (location-aware)
   ══════════════════════════════════════════ */
function downloadCalendar() {
  const d = LOCATIONS[selectedLocation || 'vietnam'];
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Tran & Adam Wedding//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${d.calDtstart}`,
    `DTEND:${d.calDtend}`,
    `SUMMARY:${d.calSummary}`,
    `LOCATION:${d.calLocation}`,
    'DESCRIPTION:Join us to celebrate our wedding! We cannot wait to share this day with you.',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: d.calFilename });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

document.getElementById('save-to-cal')?.addEventListener('click', downloadCalendar);

/* ══════════════════════════════════════════
   RSVP FORM
   ══════════════════════════════════════════ */
document.querySelectorAll('.rsvp-toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const field = btn.dataset.field;          // 'ceremony' | 'dinner'
    rsvpState[field] = btn.dataset.val === 'yes';

    btn.closest('.rsvp-toggle').querySelectorAll('.rsvp-toggle-btn').forEach(b => {
      b.classList.toggle('active', b === btn);
    });
  });
});

document.getElementById('rsvp-form')?.addEventListener('submit', async e => {
  e.preventDefault();

  const name = document.getElementById('rsvp-name').value.trim();
  if (!name) {
    setRsvpFeedback('Please enter your name.', 'error');
    return;
  }

  const payload = {
    location:       selectedLocation,
    name,
    message:        document.getElementById('rsvp-message').value.trim(),
    attendCeremony: rsvpState.ceremony,
    attendDinner:   selectedLocation === 'hungary' ? rsvpState.dinner  : null,
    extraGuests:    selectedLocation === 'hungary'
      ? (parseInt(document.getElementById('rsvp-extra').value) || 0) : 0,
  };

  const submitBtn = document.querySelector('.rsvp-submit');
  submitBtn.disabled    = true;
  submitBtn.textContent = 'Sending…';

  console.log('[RSVP] Submitting:', payload);

  try {
    const res = await fetch('/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('server');

    console.log('[RSVP] Saved successfully:', payload);

    const isAttending = payload.attendCeremony === true || payload.attendDinner === true;

    document.getElementById('rsvp-form').classList.add('hidden');
    const fb = document.getElementById('rsvp-feedback');
    fb.className = 'rsvp-feedback success';

    if (isAttending) {
      fb.innerHTML = `
        <p class="rsvp-success-msg">Thank you! We look forward to celebrating with you. ♥</p>
        <button class="save-to-cal rsvp-cal-btn">Save the Date</button>
      `;
      fb.querySelector('.rsvp-cal-btn').addEventListener('click', downloadCalendar);
    } else {
      fb.innerHTML = `<p class="rsvp-success-msg">Thank you for your wishes. We'll miss you dearly. ♥</p>`;
    }
  } catch {
    submitBtn.disabled    = false;
    submitBtn.textContent = 'Send with Love';
    setRsvpFeedback('Something went wrong. Please try again.', 'error');
  }
});

function setRsvpFeedback(msg, type) {
  const el = document.getElementById('rsvp-feedback');
  el.textContent = msg;
  el.className   = `rsvp-feedback ${type}`;
}
