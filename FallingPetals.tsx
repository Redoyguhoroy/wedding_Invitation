import React, { useEffect, useRef } from 'react';

interface PremiumLeaf {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  sway: number;
  swaySpeed: number;
  flutter: number;
  flutterSpeed: number;
  angle: number;
  angularSpeed: number;
  color: string;
  opacity: number;
  type: number; // 0: Eucalyptus/Willow, 1: Classic Birch, 2: Maidenhair/Ginkgo
  glistenOffset: number;
}

export const FallingPetals: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const maxLeaves = 48; // Increased density with a mix of beautiful small and medium elements
    const leaves: PremiumLeaf[] = [];

    for (let i = 0; i < maxLeaves; i++) {
      leaves.push(createLeaf(true));
    }

    function createLeaf(isInitial = false): PremiumLeaf {
      const type = Math.floor(Math.random() * 5); // 0 to 4 (Added Rose Petal and Rose Leaf)
      
      // Dynamic size for beautiful depth layering (foreground large, background tiny)
      const sizeRand = Math.random();
      let size = 0;
      if (sizeRand < 0.4) {
        size = Math.random() * 3 + 4; // Small/Tiny leaf: 4-7px
      } else if (sizeRand < 0.8) {
        size = Math.random() * 4 + 7; // Medium: 7-11px
      } else {
        size = Math.random() * 5 + 11; // Large: 11-16px
      }

      // Assign realistic colors based on item type
      let color = '';
      if (type === 3) {
        // Elegant Rose Petal Colors
        const roseColors = [
          'rgba(219, 48, 86, 0.88)',  // Vivid Rose Red
          'rgba(163, 16, 43, 0.88)',   // Royal Maroon
          'rgba(240, 118, 138, 0.82)', // Soft Rose Pink
          'rgba(224, 86, 109, 0.85)',  // Deep Pink Rose
        ];
        color = roseColors[Math.floor(Math.random() * roseColors.length)];
      } else if (type === 4) {
        // Detailed Rose Leaf Colors
        const greenColors = [
          'rgba(46, 117, 72, 0.75)',  // Deep Emerald Rose Leaf
          'rgba(74, 112, 87, 0.70)',   // Mid Sage Green
          'rgba(102, 128, 98, 0.70)',  // Soft Olive Green
        ];
        color = greenColors[Math.floor(Math.random() * greenColors.length)];
      } else if (type === 2) {
        // Ginkgo: Pure gold
        const goldColors = [
          'rgba(212, 175, 55, 0.85)',  // Bright Imperial Gold
          'rgba(184, 134, 11, 0.85)',  // Deep Antique Gold
          'rgba(243, 224, 190, 0.80)', // Champagne
        ];
        color = goldColors[Math.floor(Math.random() * goldColors.length)];
      } else {
        // Willow & Birch: Mix of gold and sage green
        const mixedColors = [
          'rgba(212, 175, 55, 0.85)',  // Imperial Gold
          'rgba(110, 133, 103, 0.65)', // Delicate Sage Green
          'rgba(184, 134, 11, 0.85)',  // Deep Antique Gold
          'rgba(243, 224, 190, 0.78)', // Golden Champagne
        ];
        color = mixedColors[Math.floor(Math.random() * mixedColors.length)];
      }

      // Physics: small elements flutter and fall slower, simulating realistic drag
      const speedY = (size < 7) 
        ? Math.random() * 0.35 + 0.25 
        : Math.random() * 0.5 + 0.45;
      
      return {
        x: Math.random() * width,
        y: isInitial ? Math.random() * height : -30 - Math.random() * 120,
        size,
        speedY,
        speedX: (Math.random() - 0.5) * 0.2,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.01 + 0.004,
        flutter: Math.random() * Math.PI * 2,
        flutterSpeed: Math.random() * 0.08 + 0.04,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.018,
        color,
        opacity: (size < 7) ? Math.random() * 0.25 + 0.45 : Math.random() * 0.3 + 0.60,
        type,
        glistenOffset: Math.random() * 100,
      };
    }

    const drawLeaf = (leaf: PremiumLeaf, tick: number) => {
      if (!ctx) return;
      
      ctx.save();
      
      // Calculate realistic aerodynamic translation
      // Leaves naturally drift sideways depending on their current sway and angle
      const drift = Math.sin(leaf.sway) * 1.3;
      const currentX = leaf.x + drift;
      ctx.translate(currentX, leaf.y);
      
      // Compute 3D rotation using double-axis mathematical projections
      // Flutter creates the delicate vibration of real leaves catching air
      const scaleX = Math.cos(leaf.angle) * Math.cos(leaf.flutter);
      const scaleY = Math.sin(leaf.angle + Math.PI / 4);
      ctx.scale(scaleX, scaleY);
      
      // Rotate around leaf center
      ctx.rotate(leaf.angle + Math.sin(leaf.flutter) * 0.15);

      // Add a subtle outer glisten to match the premium theme
      const glisten = Math.sin(tick * 2 + leaf.glistenOffset) * 0.12 + 0.88;
      ctx.globalAlpha = leaf.opacity * glisten;

      // Soft drop shadow for authentic depth layering (proportional to size)
      ctx.shadowBlur = leaf.size < 7 ? 2 : 4;
      ctx.shadowColor = 'rgba(29, 1, 3, 0.16)';
      ctx.shadowOffsetY = leaf.size < 7 ? 1.5 : 3;

      // Create rich organic gradient for metallic/rose leaves
      const grad = ctx.createLinearGradient(-leaf.size, -leaf.size, leaf.size, leaf.size);
      grad.addColorStop(0, leaf.color);
      grad.addColorStop(0.5, leaf.color.replace(/[\d.]+\)$/g, '0.94)'));
      grad.addColorStop(1, leaf.color.replace(/[\d.]+\)$/g, '0.40)'));
      ctx.fillStyle = grad;

      ctx.beginPath();
      const r = leaf.size;

      if (leaf.type === 0) {
        // TYPE 0: Elongated, curving Willow/Eucalyptus leaf
        ctx.moveTo(0, -r * 1.8);
        ctx.bezierCurveTo(-r * 0.7, -r * 0.8, -r * 0.4, r * 0.8, 0, r * 1.8);
        ctx.bezierCurveTo(r * 0.4, r * 0.8, r * 0.7, -r * 0.8, 0, -r * 1.8);
        ctx.fill();

        // Elegant curved center spine
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
        ctx.lineWidth = 0.75;
        ctx.beginPath();
        ctx.moveTo(0, -r * 1.6);
        ctx.quadraticCurveTo(-r * 0.1, 0, 0, r * 1.6);
        ctx.stroke();

      } else if (leaf.type === 1) {
        // TYPE 1: Symmetrical, stylized Birch/Heart Leaf
        ctx.moveTo(0, -r * 1.3);
        ctx.bezierCurveTo(-r * 1.1, -r * 0.6, -r * 1.2, r * 0.4, 0, r * 1.4);
        ctx.bezierCurveTo(r * 1.2, r * 0.4, r * 1.1, -r * 0.6, 0, -r * 1.3);
        ctx.fill();

        // Center spine and tiny detailed veins
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(0, -r * 1.1);
        ctx.lineTo(0, r * 1.2);
        ctx.stroke();

        // 3 pairs of dainty diagonal veins
        ctx.lineWidth = 0.5;
        for (let j = -1; j <= 1; j += 1) {
          if (j === 0) continue;
          const veinY = j * r * 0.4;
          ctx.beginPath();
          ctx.moveTo(0, veinY);
          ctx.lineTo(-r * 0.45, veinY + r * 0.2);
          ctx.moveTo(0, veinY);
          ctx.lineTo(r * 0.45, veinY + r * 0.2);
          ctx.stroke();
        }

      } else if (leaf.type === 2) {
        // TYPE 2: Royal Ginkgo / Maidenhair gold fan leaf
        ctx.moveTo(0, r * 1.1); // Stem origin at bottom
        ctx.quadraticCurveTo(-r * 0.2, 0, -r * 1.2, -r * 0.6); // Left wing
        ctx.bezierCurveTo(-r * 0.6, -r * 1.3, r * 0.6, -r * 1.3, r * 1.2, -r * 0.6); // Fan top crown
        ctx.quadraticCurveTo(r * 0.2, 0, 0, r * 1.1); // Right wing
        ctx.fill();

        // Fan-out delicate veins
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
        ctx.lineWidth = 0.55;
        ctx.beginPath();
        for (let angleOffset = -45; angleOffset <= 45; angleOffset += 18) {
          const radVal = (angleOffset * Math.PI) / 180;
          ctx.moveTo(0, r * 0.8);
          ctx.lineTo(Math.sin(radVal) * r * 1.1, -Math.cos(radVal) * r * 0.6);
        }
        ctx.stroke();

      } else if (leaf.type === 3) {
        // TYPE 3: Heart-shaped, velvet Rose Petal (romantic, realistic rose petal curve)
        ctx.moveTo(0, -r * 0.9);
        ctx.bezierCurveTo(-r * 1.4, -r * 1.1, -r * 1.5, r * 0.4, 0, r * 1.4);
        ctx.bezierCurveTo(r * 1.5, r * 0.4, r * 1.4, -r * 1.1, 0, -r * 0.9);
        ctx.fill();

        // Elegant inner petal folding contour lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 0.65;
        ctx.beginPath();
        ctx.arc(0, -r * 0.1, r * 0.55, 0.15 * Math.PI, 0.85 * Math.PI);
        ctx.stroke();

      } else {
        // TYPE 4: Pointed, beautiful Rose Leaf
        ctx.moveTo(0, -r * 1.4);
        ctx.bezierCurveTo(-r * 1.1, -r * 0.7, -r * 1.2, r * 0.5, 0, r * 1.5);
        ctx.bezierCurveTo(r * 1.2, r * 0.5, r * 1.1, -r * 0.7, 0, -r * 1.4);
        ctx.fill();

        // Detailed veins matching natural serrated leaf patterns
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.24)';
        ctx.lineWidth = 0.75;
        ctx.beginPath();
        ctx.moveTo(0, -r * 1.2);
        ctx.lineTo(0, r * 1.3);
        ctx.stroke();

        ctx.lineWidth = 0.5;
        for (let j = -1; j <= 1; j += 1) {
          if (j === 0) continue;
          const veinY = j * r * 0.4;
          ctx.beginPath();
          ctx.moveTo(0, veinY);
          ctx.lineTo(-r * 0.5, veinY + r * 0.25);
          ctx.moveTo(0, veinY);
          ctx.lineTo(r * 0.5, veinY + r * 0.25);
          ctx.stroke();
        }
      }
      
      ctx.restore();
    };

    let tick = 0;

    const update = () => {
      ctx.clearRect(0, 0, width, height);
      tick += 0.005;

      // Gentle, changing background wind
      const windForce = Math.sin(tick) * 0.22;

      for (let i = 0; i < maxLeaves; i++) {
        const leaf = leaves[i];

        // Apply physical updates
        leaf.y += leaf.speedY;
        leaf.x += leaf.speedX + windForce;
        
        // Advance independent wave oscillations
        leaf.sway += leaf.swaySpeed;
        leaf.flutter += leaf.flutterSpeed;
        
        // Elegant continuous tumble
        leaf.angle += leaf.angularSpeed;

        // Reset if they pass the viewport boundary
        if (leaf.y > height + 40 || leaf.x > width + 40 || leaf.x < -40) {
          leaves[i] = createLeaf(false);
        }

        drawLeaf(leaf, tick);
      }

      animationFrameId = requestAnimationFrame(update);
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-30"
      id="falling-leaves-canvas"
    />
  );
};
