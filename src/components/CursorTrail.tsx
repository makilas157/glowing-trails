import { useEffect, useRef } from "react";

type Particle = {
  id: number;
  x: number;
  y: number;
  born: number;
  life: number;
  size: number;
  el: HTMLDivElement;
};

const ACCENT = "oklch(0.68 0.19 40)";
const SPAWN_INTERVAL = 22; // ms
const MIN_LIFE = 400;
const MAX_LIFE = 600;

export default function CursorTrail() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const container = containerRef.current;
    if (!container) return;

    const particles: Particle[] = [];
    let frame = 0;
    let running = false;
    let lastSpawn = 0;
    let nextId = 0;

    const tick = () => {
      const now = performance.now();

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (!p) continue;
        const t = (now - p.born) / p.life;
        if (t >= 1) {
          p.el.remove();
          particles.splice(i, 1);
          continue;
        }
        const eased = 1 - t;
        p.el.style.opacity = String(eased * 0.85);
        p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) scale(${0.35 + eased * 0.65})`;
      }

      if (particles.length > 0) {
        frame = requestAnimationFrame(tick);
      } else {
        running = false;
        frame = 0;
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };

    const spawn = (x: number, y: number) => {
      const size = 10 + Math.random() * 8;
      const el = document.createElement("div");
      el.style.position = "fixed";
      el.style.left = "0";
      el.style.top = "0";
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.borderRadius = "9999px";
      el.style.pointerEvents = "none";
      el.style.willChange = "transform, opacity";
      el.style.background = `radial-gradient(circle, ${ACCENT} 0%, transparent 70%)`;
      el.style.boxShadow = `0 0 12px ${ACCENT}, 0 0 24px ${ACCENT}`;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(1)`;
      el.style.opacity = "0.85";
      container.appendChild(el);

      particles.push({
        id: nextId++,
        x,
        y,
        born: performance.now(),
        life: MIN_LIFE + Math.random() * (MAX_LIFE - MIN_LIFE),
        size,
        el,
      });

      start();
    };

    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastSpawn < SPAWN_INTERVAL) return;
      lastSpawn = now;
      spawn(e.clientX, e.clientY);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (frame) cancelAnimationFrame(frame);
      running = false;
      for (const p of particles) p.el.remove();
      particles.length = 0;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9998,
      }}
    />
  );
}
