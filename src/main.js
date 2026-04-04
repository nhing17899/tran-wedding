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
   ENVELOPE OPEN ANIMATION
   ══════════════════════════════════════════ */
const scene = document.getElementById('envelope-scene');
const invitation = document.getElementById('invitation');

let opened = false;

// Page load: envelope materialises
gsap.from(scene, { opacity: 0, scale: 0.97, duration: 1.2, ease: 'power3.out' });

function openEnvelope() {
  if (opened) return;
  opened = true;

  const tl = gsap.timeline({
    defaults: { ease: 'power3.inOut' },
    onComplete: showInvitation,
  });

  // 1. Flap + stamp lift slightly together (physical feel)
  tl.to('#env-flap-unit', { y: '-4vh', duration: 0.25, ease: 'power2.out' });

  // 2. Flap + stamp slide off the top — only these go up
  tl.to('#env-flap-unit', { y: '-105vh', duration: 1.0, ease: 'power3.inOut' });

  // 3. Background stays in place and fades out naturally
  tl.to(scene, { opacity: 0, duration: 1.0, ease: 'power2.inOut' }, '-=0.6');
}

function showInvitation() {
  // Remove envelope scene from DOM flow
  scene.style.display = 'none';

  // Show invitation
  invitation.classList.remove('hidden');

  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Ensure hero content is visible before animating
  gsap.set('.inv-hero-content', { opacity: 1 });

  // Whole invitation slides up from below + fades in
  heroTl.from(invitation, { y: 40, opacity: 0, duration: 0.8 });

  heroTl.from('.inv-subtitle', { y: 24, opacity: 0, duration: 0.7 }, '-=0.4');

  heroTl.from('.name-1', { x: -50, opacity: 0, duration: 0.8 }, '-=0.4');

  heroTl.from('.ampersand', {
    scale: 0,
    opacity: 0,
    duration: 0.5,
    ease: 'back.out(2)',
  }, '-=0.4');

  heroTl.from('.name-2', { x: 50, opacity: 0, duration: 0.8 }, '-=0.4');

  heroTl.from('.inv-tagline', { y: 18, opacity: 0, duration: 0.6 }, '-=0.3');

  heroTl.from('.inv-date-badge', {
    scale: 0.8,
    opacity: 0,
    duration: 0.6,
    ease: 'back.out(1.5)',
  }, '-=0.3');

  heroTl.from('.scroll-indicator', { opacity: 0, y: -10, duration: 0.5 }, '-=0.2');

  heroTl.call(initScrollAnimations);

  startCountdown();
}

document.getElementById('env-stamp').addEventListener('click', openEnvelope);

/* ══════════════════════════════════════════
   SCROLL-TRIGGERED ANIMATIONS
   ══════════════════════════════════════════ */
function initScrollAnimations() {
  // Section titles
  gsap.utils.toArray('.section-title').forEach((title) => {
    gsap.from(title, {
      scrollTrigger: {
        trigger: title,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
  });

  // Detail cards — stagger in
  gsap.from('.detail-card', {
    scrollTrigger: {
      trigger: '.details-grid',
      start: 'top 80%',
    },
    y: 50,
    opacity: 0,
    duration: 0.7,
    stagger: 0.15,
    ease: 'power3.out',
  });

  // Timeline items
  gsap.utils.toArray('.timeline-item').forEach((item, i) => {
    gsap.to(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      x: 0,
      opacity: 1,
      duration: 0.7,
      delay: i * 0.1,
      ease: 'power3.out',
    });
  });

  // Gallery items
  gsap.from('.gallery-item', {
    scrollTrigger: {
      trigger: '.gallery-grid',
      start: 'top 80%',
    },
    scale: 0.8,
    opacity: 0,
    duration: 0.6,
    stagger: { each: 0.1, from: 'random' },
    ease: 'back.out(1.4)',
  });

  // RSVP form
  gsap.from('.rsvp-form', {
    scrollTrigger: {
      trigger: '.rsvp-form',
      start: 'top 85%',
    },
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
  });

  // Countdown
  gsap.from('.countdown', {
    scrollTrigger: {
      trigger: '.countdown',
      start: 'top 85%',
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
  });
}
