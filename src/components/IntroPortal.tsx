import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const generateSpiralPath = (turns: number, startRadius: number, endRadius: number, startAngleOffset: number = 0) => {
  const points = [];
  const pointsCount = 75;
  for (let i = 0; i <= pointsCount; i++) {
    const ratio = i / pointsCount;
    const angle = ratio * turns * Math.PI * 2 + startAngleOffset;
    const radius = startRadius * Math.pow(1 - ratio, 1.2) + endRadius * ratio;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return points.join(' ');
};

interface VortexParticle {
  id: number;
  angle: number;
  radius: number;
  size: number;
  speed: number;
  color: string;
  pulseDelay: number;
  wiggle: number;
}

interface StarRay {
  id: number;
  angle: number;
  length: number;
  opacity: number;
}

function GoldenVortex({ active }: { active: boolean }) {
  const [particles] = useState<VortexParticle[]>(() => {
    const colors = ["#ffffff", "#fff3bc", "#ffbc47", "#ff6b35", "#ff233c"];
    return Array.from({ length: 110 }).map((_, i) => {
      const angle = Math.random() * 360;
      // Cluster the particles mainly in a thick circular band between 100 and 280px radius
      const radius = 95 + Math.pow(Math.random(), 1.2) * 195;
      const size = Math.random() * 2.6 + 1.2;
      const speed = 1.3 + Math.random() * 2.4; // Faster, dynamic orbiting speed
      const color = colors[Math.floor(Math.random() * colors.length)];
      const pulseDelay = Math.random() * 1.0;
      const wiggle = (Math.random() - 0.5) * 45; // Smooth waving movement
      return { id: i, angle, radius, size, speed, color, pulseDelay, wiggle };
    });
  });

  const [rays] = useState<StarRay[]>(() => {
    // 24 elegant alternating long, medium, and short needle rays to create the gorgeous sunburst
    return Array.from({ length: 24 }).map((_, i) => {
      const isLong = i % 4 === 0;
      const isMedium = i % 2 === 0 && !isLong;
      let length = 45 + Math.random() * 25;
      if (isLong) {
        length = 160 + Math.random() * 60;
      } else if (isMedium) {
        length = 95 + Math.random() * 35;
      }
      return {
        id: i,
        angle: (i * 360) / 24,
        length,
        opacity: isLong ? 0.9 : (isMedium ? 0.65 : 0.4),
      };
    });
  });

  if (!active) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.15 }}
      animate={{
        opacity: [0, 1, 1, 1],
        scale: [0.15, 0.7, 1.4, 4.8],
      }}
      transition={{
        duration: 1.4,
        times: [0, 0.22, 0.65, 1.0],
        ease: ["easeOut", "easeInOut", "easeIn"],
      }}
      className="absolute inset-0 z-35 overflow-hidden pointer-events-none flex items-center justify-center"
    >
      {/* Background ambient gold flash overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.55, 0.3] }}
        transition={{ duration: 1.4 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,180,80,0.35)_0%,rgba(0,0,0,0)_75%)]"
      />

      <div className="relative w-[600px] h-[600px] flex items-center justify-center scale-90 md:scale-100">
        {/* The rotating SVG lines */}
        <svg
          viewBox="-300 -300 600 600"
          className="absolute w-full h-full"
        >
          <defs>
            <filter id="vortex-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur1" />
              <feGaussianBlur stdDeviation="10" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="deep-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="16" result="blur" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <radialGradient id="sun-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#fff7c2" stopOpacity="1" />
              <stop offset="55%" stopColor="#ffb03a" stopOpacity="0.9" />
              <stop offset="85%" stopColor="#ff4c15" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1a0205" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="gold-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#ffcc4d" />
              <stop offset="80%" stopColor="#e8331e" />
              <stop offset="100%" stopColor="#630206" />
            </linearGradient>

            <linearGradient id="gold-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fff3c4" />
              <stop offset="50%" stopColor="#ff781e" />
              <stop offset="100%" stopColor="#b30e00" />
            </linearGradient>
          </defs>

          {/* Central Bright Glowing Core */}
          <motion.circle
            cx="0"
            cy="0"
            r="90"
            fill="url(#sun-core)"
            filter="url(#deep-glow)"
            animate={{
              scale: [0.88, 1.12, 0.88],
              opacity: [0.85, 1, 0.85],
            }}
            transition={{
              duration: 1.8, // Shimmering rapid pulse
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <circle cx="0" cy="0" r="30" fill="#ffffff" filter="url(#vortex-glow)" className="opacity-95" />

          {/* Elegant Gold Concentric Rings */}
          <motion.circle
            cx="0"
            cy="0"
            r="95"
            fill="none"
            stroke="#ffd67c"
            strokeWidth="1.5"
            strokeDasharray="40 10 20 10"
            opacity="0.6"
            filter="url(#vortex-glow)"
            animate={{ rotate: 360 }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.circle
            cx="0"
            cy="0"
            r="155"
            fill="none"
            stroke="#ffa751"
            strokeWidth="1"
            strokeDasharray="15 30 5 15"
            opacity="0.45"
            filter="url(#vortex-glow)"
            animate={{ rotate: -360 }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.circle
            cx="0"
            cy="0"
            r="220"
            fill="none"
            stroke="#ff6e40"
            strokeWidth="1.2"
            strokeDasharray="200 15 50 15"
            opacity="0.3"
            filter="url(#deep-glow)"
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />

          {/* Starburst Rays */}
          <g>
            {rays.map((ray) => (
              <motion.line
                key={ray.id}
                x1="0"
                y1="0"
                x2="0"
                y2={-ray.length}
                stroke="#ffffff"
                strokeWidth={ray.length > 130 ? "1.8" : "1.2"}
                strokeLinecap="round"
                transform={`rotate(${ray.angle})`}
                opacity={ray.opacity}
                filter="url(#vortex-glow)"
                animate={{
                  y2: [-ray.length, -ray.length * 1.15, -ray.length],
                  opacity: [ray.opacity * 0.7, ray.opacity, ray.opacity * 0.7],
                }}
                transition={{
                  duration: 0.8 + Math.random() * 0.6, // Shimmering
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </g>

          {/* Golden/Crimson Swirling Spiral Arms */}
          <g>
            {/* Main Golden Spiral Arm 1 */}
            <motion.path
              d={generateSpiralPath(2.2, 290, 0)}
              fill="none"
              stroke="url(#gold-grad-1)"
              strokeWidth="4.5"
              strokeLinecap="round"
              filter="url(#vortex-glow)"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }} // Extremely fast spin
            />

            {/* Orange-Crimson Spiral Arm 2 */}
            <motion.path
              d={generateSpiralPath(1.9, 260, 0, Math.PI * 0.5)}
              fill="none"
              stroke="url(#gold-grad-2)"
              strokeWidth="3.2"
              strokeLinecap="round"
              filter="url(#vortex-glow)"
              animate={{ rotate: [60, 420] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }} // Quick outer stream
            />

            {/* Inner Tight Golden Spiral Arm 3 */}
            <motion.path
              d={generateSpiralPath(2.5, 230, 0, Math.PI)}
              fill="none"
              stroke="#ffeeb0"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeDasharray="15, 8"
              filter="url(#vortex-glow)"
              animate={{ rotate: [120, 480], strokeDashoffset: [0, -100] }}
              transition={{
                rotate: { duration: 1.6, repeat: Infinity, ease: "linear" }, 
                strokeDashoffset: { duration: 0.7, repeat: Infinity, ease: "linear" } 
              }}
            />

            {/* Outer Soft Ambient Swirl 4 */}
            <motion.path
              d={generateSpiralPath(1.5, 310, 0, Math.PI * 1.5)}
              fill="none"
              stroke="#ff4a25"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.35"
              filter="url(#deep-glow)"
              animate={{ rotate: [-40, 320] }}
              transition={{ duration: 2.0, repeat: Infinity, ease: "linear" }} 
            />
          </g>
        </svg>

        {/* Orbiting Stardust Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              animate={{ rotate: [p.angle, p.angle + 360] }}
              transition={{
                duration: p.speed,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute left-1/2 top-1/2"
              style={{
                width: 0,
                height: 0,
                transformOrigin: "0 0",
              }}
            >
              <motion.div
                className="rounded-full shadow-lg"
                style={{
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                  x: p.radius,
                  boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                }}
                animate={{
                  opacity: [0.45, 1, 0.45],
                  scale: [0.85, 1.45, 0.85],
                  x: [p.radius, p.radius + p.wiggle, p.radius],
                }}
                transition={{
                  duration: 1.2 + Math.random() * 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: p.pulseDelay,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

interface IntroPortalProps {
  onEnter: () => void;
}

type AnimationState = "sealed" | "opening" | "revealed" | "transition";

export default function IntroPortal({ onEnter }: IntroPortalProps) {
  const [state, setState] = useState<AnimationState>("sealed");
  const [stars, setStars] = useState<Array<{ id: number; top: number; left: number; size: number; delay: number }>>([]);

  useEffect(() => {
    const arr = Array.from({ length: 65 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2.8 + 1.2,
      delay: Math.random() * 5,
    }));
    setStars(arr);
  }, []);

  const revealInvitation = () => {
    if (state !== "sealed") return;
    setState("opening");

    setTimeout(() => setState("transition"), 1100);
    setTimeout(onEnter, 1500);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#1a0205] flex items-center justify-center">
      {/* Deep Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(180,40,60,0.45),transparent_65%)]" />

      {/* Elegant Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-[#f8e8b0]"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.45, 1] }}
          transition={{ duration: 4, repeat: Infinity, delay: star.delay }}
        />
      ))}

      <motion.div 
        className="relative" 
        style={{ perspective: "2200px" }}
        animate={{
          scale: state === "sealed" ? 1 : [1, 1.02, 0.88],
          y: state === "sealed" ? 0 : [0, -15, 680],
          opacity: state === "sealed" ? 1 : [1, 1, 0],
        }}
        transition={{
          duration: 1.3,
          times: [0, 0.18, 1.0],
          ease: [0.25, 1, 0.5, 1]
        }}
      >
        <div
          onClick={revealInvitation}
          className="relative w-[285px] h-[428px] min-[370px]:w-[325px] min-[370px]:h-[488px] min-[410px]:w-[360px] min-[410px]:h-[540px] md:w-[420px] md:h-[600px] cursor-pointer"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Luxurious Shadow */}
          <div className="absolute -inset-6 bg-black/70 blur-3xl rounded-[3rem] scale-[1.08]" />

          {/* 1. Back Plate (Envelope Back) with beautiful inside textures and shadow */}
          <div 
            className="absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-br from-[#2c0509] via-[#4a0c15] to-[#1f0206] border border-[#a57b4d]/40 shadow-2xl"
            style={{ transform: "translateZ(-10px)", zIndex: 10 }}
          >
            {/* Handmade paper texture inside the envelope pocket */}
            <div
              className="absolute inset-0 opacity-15 mix-blend-soft-light"
              style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/handmade-paper.png')" }}
            />
            {/* Inner Back Plate Embossed Pattern, visible when card slides up */}
            <svg 
              viewBox="0 0 400 600" 
              className="absolute inset-x-0 top-10 w-full h-[80%] opacity-20 pointer-events-none stroke-[#1d0306]" 
              fill="none" 
              strokeWidth="1.2"
              style={{ filter: "drop-shadow(1px 1px 0.5px rgba(255,255,255,0.05))" }}
            >
              <path d="M200,100 Q150,200 250,300 T200,500" />
              <path d="M100,150 Q130,220 90,290" />
              <path d="M300,150 Q270,220 310,290" />
            </svg>
          </div>

          {/* 2. Premium Top Flap (Lid) */}
          {/* Rotates backwards -170 degrees and flips behind contents when opened */}
          <motion.div
            animate={{ rotateX: state === "sealed" ? 0 : -170 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute top-0 left-0 right-0 h-[53%] origin-top"
            style={{ 
              transformStyle: "preserve-3d",
              backfaceVisibility: "visible",
              zIndex: state === "sealed" ? 40 : 15
            }}
          >
            <div
              className="absolute inset-0 bg-gradient-to-b from-[#6f2437] via-[#4f1322] to-[#2a050a] overflow-hidden"
              style={{ 
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                backfaceVisibility: "visible"
              }}
            >
              {/* Embossed Floral Pattern on Top Flap */}
              <svg 
                viewBox="0 0 400 200" 
                className="absolute inset-0 w-[80%] h-[70%] left-10 top-2 opacity-30 pointer-events-none stroke-[#2a0409]" 
                fill="none" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                style={{ 
                  filter: "drop-shadow(1px 1px 0.5px rgba(255,255,255,0.06)) drop-shadow(-1px -1px 0.5px rgba(0,0,0,0.55))"
                }}
              >
                <path d="M200,10 L200,140" />
                <path d="M200,40 Q170,30 160,50 Q180,60 200,40" />
                <path d="M200,75 Q165,65 155,85 Q175,95 200,75" />
                <path d="M200,110 Q170,105 165,120 Q185,128 200,110" />
                
                <path d="M200,40 Q230,30 240,50 Q220,60 200,40" />
                <path d="M200,75 Q235,65 245,85 Q225,95 200,75" />
                <path d="M200,110 Q230,105 235,120 Q215,128 200,110" />
 
                <path d="M170,80 Q130,50 110,90" />
                <path d="M140,65 Q115,55 105,75" />
                
                <path d="M230,80 Q270,50 290,90" />
                <path d="M260,65 Q285,55 295,75" />
              </svg>
            </div>
            {/* Gold trim */}
            <div
              className="absolute inset-0 border-t-4 border-[#e8c46a]/40"
              style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
            />
          </motion.div>



          {/* 4. Realistic Folds (Left, Right, Bottom Flaps) */}
          {/* Left Flap with Embossed Branch */}
          <div 
            className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-[#2a0408] to-[#3f0a13] overflow-hidden" 
            style={{ clipPath: "polygon(0 0, 100% 48%, 0 100%)", zIndex: 30 }}
          >
            <svg 
              viewBox="0 0 200 600" 
              className="absolute left-2 top-1/2 -translate-y-1/2 w-[70%] h-[80%] opacity-20 pointer-events-none stroke-[#1d0306]" 
              fill="none" 
              strokeWidth="1.5" 
              style={{ filter: "drop-shadow(1px 1px 0.5px rgba(255,255,255,0.05)) drop-shadow(-1px -1px 0.5px rgba(0,0,0,0.55))" }}
            >
              <path d="M10,150 Q70,300 20,450" />
              <path d="M35,210 Q65,190 75,210" />
              <path d="M48,280 Q18,260 8,280" />
              <path d="M52,350 Q82,330 92,350" />
              <path d="M38,420 Q8,400 -2,420" />
            </svg>
          </div>

          {/* Right Flap with Embossed Branch */}
          <div 
            className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#2a0408] to-[#3f0a13] overflow-hidden" 
            style={{ clipPath: "polygon(100% 0, 0 48%, 100% 100%)", zIndex: 30 }}
          >
            <svg 
              viewBox="0 0 200 600" 
              className="absolute right-2 top-1/2 -translate-y-1/2 w-[70%] h-[80%] opacity-20 pointer-events-none stroke-[#1d0306]" 
              fill="none" 
              strokeWidth="1.5" 
              style={{ filter: "drop-shadow(1px 1px 0.5px rgba(255,255,255,0.05)) drop-shadow(-1px -1px 0.5px rgba(0,0,0,0.55))" }}
            >
              <path d="M190,150 Q130,300 180,450" />
              <path d="M165,210 Q135,190 125,210" />
              <path d="M152,280 Q182,260 192,280" />
              <path d="M148,350 Q118,330 108,350" />
              <path d="M162,420 Q192,400 202,420" />
            </svg>
          </div>

          {/* Bottom Flap with Embossed Rose Buds */}
          <div 
            className="absolute bottom-0 w-full h-[57%] bg-gradient-to-t from-[#1c0205] via-[#3a0a12] to-[#4a0f18] overflow-hidden" 
            style={{ clipPath: "polygon(0 100%, 100% 100%, 50% 0)", zIndex: 30 }}
          >
            <svg 
              viewBox="0 0 400 300" 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-[90%] opacity-25 pointer-events-none stroke-[#1c0205]" 
              fill="none" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              style={{ 
                filter: "drop-shadow(1px 1px 0.5px rgba(255,255,255,0.06)) drop-shadow(-1px -1px 0.5px rgba(0,0,0,0.55))"
              }}
            >
              {/* Rose bud branch on bottom-left */}
              <path d="M100,280 Q120,200 160,170" />
              <path d="M130,240 Q105,225 95,245 Q115,255 130,240" />
              <path d="M145,210 Q170,200 180,220 Q160,230 145,210" />
              <path d="M160,170 C150,150 180,140 170,165" />
              
              {/* Rose bud branch on bottom-right */}
              <path d="M300,280 Q280,200 240,170" />
              <path d="M270,240 Q295,225 305,245 Q285,255 270,240" />
              <path d="M255,210 Q230,200 220,220 Q240,230 255,210" />
              <path d="M240,170 C250,150 220,140 230,165" />
            </svg>
          </div>

          {/* Elegant "Tap to Reveal" Cursive Script above the Wax Seal */}
          <AnimatePresence>
            {state === "sealed" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: [0, -4, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute left-1/2 top-[34%] -translate-x-1/2 z-50 text-center pointer-events-none select-none"
              >
                <p className="font-cursive text-[#fcfbf9]/95 text-4xl md:text-5xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)] whitespace-nowrap tracking-wide">
                  Tap to Reveal
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Luxe Realistic Ivory Wax Seal with intertwined P & S Monogram */}
          <motion.div
            animate={{
              scale: state === "sealed" ? [1, 1.05, 1] : 0.65,
              opacity: state === "sealed" ? 1 : 0,
            }}
            transition={{ scale: { duration: 2.5, repeat: Infinity } }}
            className="absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2 z-50 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.65)]"
          >
            <div className="relative w-32 h-32 md:w-36 md:h-36 transition-all duration-300">
              <div className="absolute inset-2 rounded-full bg-[#f6f4eb]/15 blur-xl pointer-events-none" />
              
              <svg viewBox="0 0 100 100" className="w-full h-full select-none">
                <defs>
                  <radialGradient id="waxGrad" cx="45%" cy="45%" r="55%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="25%" stopColor="#faf9f5" />
                    <stop offset="70%" stopColor="#e3ded2" />
                    <stop offset="90%" stopColor="#cfc8b8" />
                    <stop offset="100%" stopColor="#beb5a3" />
                  </radialGradient>

                  <linearGradient id="innerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ece9dd" />
                    <stop offset="50%" stopColor="#e2ded0" />
                    <stop offset="100%" stopColor="#c5bea8" />
                  </linearGradient>
                </defs>

                {/* Organic Outer Wax Pool */}
                <path
                  d="M 50,3 
                     C 68,2 84,8 92,24 
                     C 98,36 97,55 94,68 
                     C 90,82 78,94 62,96 
                     C 48,98 32,95 20,87 
                     C 6,78 2,62 4,46 
                     C 5,28 16,12 32,5 
                     C 38,3 44,4 50,3 Z"
                  fill="url(#waxGrad)"
                  className="drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)]"
                />

                {/* Inner Pressed Ring */}
                <circle cx="50" cy="50" r="32" fill="url(#innerGrad)" stroke="#beb6a0" strokeWidth="0.75" />
                <circle cx="50" cy="50" r="28" fill="none" stroke="#d5cebd" strokeWidth="1" strokeDasharray="2, 2" />
                <circle cx="50" cy="50" r="26.5" fill="none" stroke="#beb6a0" strokeWidth="0.5" />
                
                {/* Monogram P & S in 'Great Vibes' script font */}
                <text
                  x="50"
                  y="59"
                  fontFamily="Great Vibes, cursive"
                  fontSize="25"
                  fontWeight="normal"
                  fill="#ffffff"
                  textAnchor="middle"
                  opacity="0.85"
                >
                  P & S
                </text>
                <text
                  x="49.5"
                  y="58"
                  fontFamily="Great Vibes, cursive"
                  fontSize="25"
                  fontWeight="normal"
                  fill="#9c937c"
                  textAnchor="middle"
                >
                  P & S
                </text>
                <text
                  x="50"
                  y="58.5"
                  fontFamily="Great Vibes, cursive"
                  fontSize="25"
                  fontWeight="normal"
                  fill="#b0a790"
                  textAnchor="middle"
                >
                  P & S
                </text>
              </svg>
            </div>
          </motion.div>


        </div>
      </motion.div>

      {/* Golden Magic Vortex */}
      <AnimatePresence>
        {state !== "sealed" && (
          <GoldenVortex active={state !== "sealed"} />
        )}
      </AnimatePresence>

      {/* 5. Pure White Screen Flash Overlay for Cinematic Transition */}
      <AnimatePresence>
        {state === "transition" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0 bg-white z-[9999] pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
}