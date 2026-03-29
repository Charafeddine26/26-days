import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, Input } from '@angular/core';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: readonly [number, number, number];
  phase: number;
  phaseSpeed: number;
}

const COLORS: ReadonlyArray<readonly [number, number, number]> = [
  [184, 169, 232], // lavender
  [169, 232, 192], // sage
  [169, 216, 232], // ice
  [232, 169, 192], // rose
  [232, 207, 169], // gold
];

@Component({
  selector: 'app-particle-field',
  standalone: true,
  template: `<canvas
    #canvas
    class="particle-field-canvas"
    style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none;"
  ></canvas>`,
})
export class ParticleFieldComponent implements AfterViewInit, OnDestroy {
  @Input() mouseX: number | null = null;
  @Input() mouseY: number | null = null;
  @Input() idle: boolean = false;

  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private rafId = 0;
  private particles: Particle[] = [];
  private resizeHandler = () => this.resize();

  ngAfterViewInit(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Defer so CSS layout is complete
    setTimeout(() => this.init(), 0);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.resizeHandler);
  }

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;

  private resize(): void {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    // Re-seed particles within new bounds
    for (const p of this.particles) {
      if (p.x > this.canvas.width) p.x = Math.random() * this.canvas.width;
      if (p.y > this.canvas.height) p.y = Math.random() * this.canvas.height;
    }
  }

  private init(): void {
    this.canvas = this.canvasRef.nativeElement;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;
    this.ctx = ctx;

    this.resize();
    window.addEventListener('resize', this.resizeHandler);

    // Increase particle count slightly to fill the deeper volume
    this.particles = Array.from({ length: 65 }, () => ({
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      // Radius ranges from 1.0 to 5.0 for depth, with occasional 6-8px "spores"
      r: Math.random() > 0.95 
        ? Math.random() * 2.0 + 6.0 
        : Math.random() * 4.0 + 1.0,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      phase: Math.random() * Math.PI * 2,
      // Spores move phase much slower
      phaseSpeed: Math.random() > 0.95 
        ? 0.001 + Math.random() * 0.002 
        : 0.004 + Math.random() * 0.008,
    }));

    this.tick();
  }

  private tick = (): void => {
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.ctx.clearRect(0, 0, w, h);

    for (const p of this.particles) {
      const speedMult = this.idle ? 0.2 : 1.0;
      p.x += p.vx * speedMult;
      p.y += p.vy * speedMult;
      p.phase += p.phaseSpeed * speedMult;

      if (this.mouseX !== null && this.mouseY !== null && !this.idle) {
        const dx = this.mouseX - p.x;
        const dy = this.mouseY - p.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 22500 && distSq > 100) {
          const force = 100 / distSq;
          p.x += dx * force * 0.05;
          p.y += dy * force * 0.05;
        }
      }

      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      // Base opacity scales with size (larger = more opaque base, but spores are faint)
      const isSpore = p.r > 5.5;
      const baseOpacity = isSpore ? 0.02 : 0.05 + (p.r / 5.0) * 0.15;
      const pulseAmp = isSpore ? 0.08 : 0.20;
      const opacity = baseOpacity + pulseAmp * (0.5 + 0.5 * Math.sin(p.phase));
      const [r, g, b] = p.color;
      const glowR = p.r * 5;

      const grd = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
      grd.addColorStop(0, `rgba(${r},${g},${b},${opacity})`);
      grd.addColorStop(1, `rgba(${r},${g},${b},0)`);

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
      this.ctx.fillStyle = grd;
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      // Particle core is slightly more opaque, but capped lower for spores
      const coreMax = p.r > 5.5 ? 0.25 : 0.75;
      this.ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(opacity * 2.5, coreMax)})`;
      this.ctx.fill();
    }

    this.rafId = requestAnimationFrame(this.tick);
  };
}
