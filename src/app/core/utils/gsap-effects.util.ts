import { gsap } from 'gsap';

/**
 * One-shot radial light burst — call on challenge or boss completion.
 * @param gold  true → larger gold bloom (boss battle); false → lavender bloom (regular)
 */
export function playBloom(gold = false): void {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const [r, g, b] = gold ? [232, 207, 169] : [184, 169, 232];
  const size = gold ? '150vmax' : '120vmax';

  const el = document.createElement('div');
  Object.assign(el.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    width: size,
    height: size,
    borderRadius: '50%',
    background: `radial-gradient(circle, rgba(${r},${g},${b},0.5) 0%, transparent 62%)`,
    pointerEvents: 'none',
    zIndex: '200',
  });
  document.body.appendChild(el);

  gsap.fromTo(
    el,
    { xPercent: -50, yPercent: -50, scale: 0, opacity: 1 },
    {
      scale: 1,
      opacity: 0,
      duration: gold ? 1.4 : 1.1,
      ease: 'power2.out',
      onComplete: () => el.remove(),
    }
  );
}
