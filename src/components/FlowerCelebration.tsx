import React, { useEffect, useRef } from 'react';

interface CelebrationParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  type: 'marigold' | 'rose' | 'jasmine' | 'sparkle';
  opacity: number;
  gravity: number;
  swaySpeed: number;
  swayOffset: number;
  decay: number;
  life: number;
}

interface FlowerCelebrationProps {
  trigger: boolean;
}

export const FlowerCelebration: React.FC<FlowerCelebrationProps> = ({ trigger }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!trigger) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: CelebrationParticle[] = [];
    const maxParticles = 90;

    // Premium festive colors
    const marigoldColors = ['#f97316', '#ea580c', '#facc15', '#eab308'];
    const roseColors = ['#f43f5e', '#e11d48', '#fda4af', '#fda4af'];
    const jasmineColors = ['#ffffff', '#f1f5f9', '#f8fafc'];

    // Spawn point: center of the viewport (near the save the date card)
    const spawnX = width / 2;
    const spawnY = height * 0.45;

    // Create a particle with explosive initial velocity
    function createParticle(): CelebrationParticle {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 4; // Explosive velocity
      
      const typeRand = Math.random();
      let type: 'marigold' | 'rose' | 'jasmine' | 'sparkle' = 'marigold';
      let color = marigoldColors[Math.floor(Math.random() * marigoldColors.length)];

      if (typeRand > 0.75) {
        type = 'sparkle';
        color = '#fef08a'; // Golden sparkle
      } else if (typeRand > 0.5) {
        type = 'rose';
        color = roseColors[Math.floor(Math.random() * roseColors.length)];
      } else if (typeRand > 0.25) {
        type = 'jasmine';
        color = jasmineColors[Math.floor(Math.random() * jasmineColors.length)];
      }

      const size = type === 'sparkle' ? Math.random() * 4 + 4 : Math.random() * 10 + 10;

      return {
        x: spawnX,
        y: spawnY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5, // Extra upward thrust
        size,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.12,
        color,
        type,
        opacity: 1,
        gravity: Math.random() * 0.12 + 0.1,
        swaySpeed: Math.random() * 0.04 + 0.02,
        swayOffset: Math.random() * Math.PI * 2,
        decay: Math.random() * 0.005 + 0.004,
        life: 1.0,
      };
    }

    // Initialize all particles at once for the burst
    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle());
    }

    // Draw helper functions
    const drawMarigold = (ctx: CanvasRenderingContext2D, size: number, color: string) => {
      ctx.fillStyle = color;
      const petals = 12;
      for (let i = 0; i < petals; i++) {
        ctx.rotate((Math.PI * 2) / petals);
        ctx.beginPath();
        ctx.ellipse(0, -size * 0.7, size * 0.35, size * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      // Inner contrast circle
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawRosePetal = (ctx: CanvasRenderingContext2D, size: number, color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.bezierCurveTo(-size * 1.2, -size * 1.2, -size * 1.4, size * 0.4, 0, size * 1.2);
      ctx.bezierCurveTo(size * 1.4, size * 0.4, size * 1.2, -size * 1.2, 0, -size);
      ctx.fill();

      // Deep shadow vein
      ctx.strokeStyle = 'rgba(190, 24, 74, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.7);
      ctx.quadraticCurveTo(-size * 0.1, 0, 0, size * 0.9);
      ctx.stroke();
    };

    const drawJasmine = (ctx: CanvasRenderingContext2D, size: number, color: string) => {
      ctx.fillStyle = color;
      // 5 soft symmetric petals (Shiuli style)
      const petals = 5;
      for (let i = 0; i < petals; i++) {
        ctx.rotate((Math.PI * 2) / petals);
        ctx.beginPath();
        ctx.ellipse(0, -size * 0.6, size * 0.28, size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      // Traditional vibrant orange stem eye of the Shiuli flower
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawSparkle = (ctx: CanvasRenderingContext2D, size: number, color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, -size * 1.5);
      ctx.quadraticCurveTo(0, 0, -size * 1.5, 0);
      ctx.quadraticCurveTo(0, 0, 0, size * 1.5);
      ctx.quadraticCurveTo(0, 0, size * 1.5, 0);
      ctx.quadraticCurveTo(0, 0, 0, -size * 1.5);
      ctx.fill();
    };

    let tick = 0;

    const update = () => {
      ctx.clearRect(0, 0, width, height);
      tick += 0.02;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Apply physics
        p.vy += p.gravity;
        p.vx *= 0.98; // Air resistance
        p.vy *= 0.98;

        p.x += p.vx + Math.sin(tick + p.swayOffset) * 0.4;
        p.y += p.vy;

        p.rotation += p.rotationSpeed;
        p.life -= p.decay;

        if (p.life <= 0 || p.y > height + 20) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.life * p.opacity;

        // Draw shadow for deep layered realistic look
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(29, 1, 3, 0.15)';
        ctx.shadowOffsetY = 2;

        if (p.type === 'marigold') {
          drawMarigold(ctx, p.size, p.color);
        } else if (p.type === 'rose') {
          drawRosePetal(ctx, p.size, p.color);
        } else if (p.type === 'jasmine') {
          drawJasmine(ctx, p.size, p.color);
        } else {
          drawSparkle(ctx, p.size, p.color);
        }

        ctx.restore();
      }

      if (particles.length > 0) {
        animationFrameId = requestAnimationFrame(update);
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    update();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [trigger]);

  if (!trigger) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-50"
      id="flower-celebration-canvas"
    />
  );
};
