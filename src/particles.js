import { tsParticles } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';

export async function initParticles() {
  await loadSlim(tsParticles);

  await tsParticles.load('particles', {
    fullScreen: false,
    fpsLimit: 60,
    particles: {
      number: {
        value: 30,
        density: { enable: true, area: 900 },
      },
      color: { value: ['#c9a96e', '#e4cfa0', '#f2d9d5', '#c97e7e'] },
      shape: {
        type: 'circle',
      },
      opacity: {
        value: { min: 0.2, max: 0.6 },
        animation: {
          enable: true,
          speed: 0.8,
          minimumValue: 0.1,
          sync: false,
        },
      },
      size: {
        value: { min: 2, max: 6 },
        animation: {
          enable: true,
          speed: 2,
          minimumValue: 1,
          sync: false,
        },
      },
      move: {
        enable: true,
        speed: 0.6,
        direction: 'bottom',
        outModes: { default: 'out' },
        drift: 1,
        random: true,
        straight: false,
      },
      wobble: {
        enable: true,
        distance: 10,
        speed: 5,
      },
    },
    interactivity: {
      events: {
        onHover: { enable: false },
        onClick: { enable: false },
      },
    },
    detectRetina: true,
  });
}
