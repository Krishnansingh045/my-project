import { useEffect, useRef } from "react";

/**
 * Full-screen canvas that renders a smooth cursor trail with blurred particles.
 * Self-contained; no dependencies other than React.
 */
export default function CursorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;

    const resize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const { innerWidth: w, innerHeight: h } = window;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const points: { x: number; y: number; life: number; vx: number; vy: number }[] = [];

    const addPoint = (x: number, y: number) => {
      for (let i = 0; i < 6; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 1.25;
        points.push({ x, y, life: 1, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed });
      }
    };

    const onMove = (e: PointerEvent) => {
      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;
      addPoint(e.clientX, e.clientY);
      initializedRef.current = true;
    };

    window.addEventListener("pointermove", onMove);

    const render = () => {
      // Subtle fade
      ctx.fillStyle = "rgba(0,0,0,0.06)";
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";

      // Draw particles
      for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        if (p.life <= 0) {
          points.splice(i, 1);
          continue;
        }
        const r = 16 * p.life + 4;
        const g1 = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        g1.addColorStop(0, "rgba(140, 82, 255, 0.6)");
        g1.addColorStop(1, "rgba(140, 82, 255, 0)");
        ctx.fillStyle = g1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Soft focus glow at pointer
      if (initializedRef.current) {
        const { x, y } = pointerRef.current;
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 120);
        glow.addColorStop(0, "rgba(98, 0, 238, 0.13)");
        glow.addColorStop(1, "rgba(98, 0, 238, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, 120, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="cursor-canvas" aria-hidden="true" />;
}
