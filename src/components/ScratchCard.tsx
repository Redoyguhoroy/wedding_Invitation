import React, { useRef, useEffect, useState } from 'react';

interface ScratchCardProps {
  id: string;
  width?: number;
  height?: number;
  title: string;
  revealText: string;
  subText?: string;
  onComplete?: () => void;
}

export const ScratchCard: React.FC<ScratchCardProps> = ({
  id,
  width = 120,
  height = 160,
  title,
  revealText,
  subText,
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScratched, setIsScratched] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get actual dimensions of the parent box container dynamically to prevent overflow
    const rect = canvas.parentElement?.getBoundingClientRect() || { width, height };
    const actualWidth = rect.width || (width - 16);
    const actualHeight = rect.height || (height - 30);

    // Set high-dpi canvas dimensions
    const dpr = window.devicePixelRatio || 1;
    canvas.width = actualWidth * dpr;
    canvas.height = actualHeight * dpr;
    ctx.scale(dpr, dpr);

    // Initial golden texture drawing
    const gradient = ctx.createLinearGradient(0, 0, actualWidth, actualHeight);
    gradient.addColorStop(0, '#bf953f');
    gradient.addColorStop(0.25, '#fcf6ba');
    gradient.addColorStop(0.5, '#b38728');
    gradient.addColorStop(0.75, '#fbf5b7');
    gradient.addColorStop(1, '#aa771c');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, actualWidth, actualHeight);

    // Add some glitter speckles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    for (let i = 0; i < 80; i++) {
      const rx = Math.random() * actualWidth;
      const ry = Math.random() * actualHeight;
      const size = Math.random() * 1.5 + 1;
      ctx.fillRect(rx, ry, size, size);
    }

    // Border
    ctx.strokeStyle = '#8b6508';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0, 0, actualWidth, actualHeight);

    // Hint Text on scratch layer
    const isSmall = actualWidth < 100;
    ctx.fillStyle = '#4a0e17';
    ctx.font = isSmall 
      ? 'bold 11px "Hind Siliguri", sans-serif'
      : 'bold 13px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ঘষুন', actualWidth / 2, actualHeight / 2 - 8);
    ctx.font = isSmall ? '8px sans-serif' : '10px sans-serif';
    ctx.fillText('SCRATCH ME', actualWidth / 2, actualHeight / 2 + 10);
  }, [width, height]);

  // Handle scratch movement
  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Source Over - Destination Out to transparent
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 14, 0, Math.PI * 2); // Perfectly sized scratch radius
    ctx.fill();

    // Check clear percentage periodically
    checkScratchedPercentage();
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent | TouchEvent | MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    // Calculate coordinates directly relative to bounding rect without scaling distortion
    if ('touches' in e && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else if ('clientX' in e) {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
    return { x: 0, y: 0 };
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent default event behavior to avoid page scrolling while scratching
    e.preventDefault();
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    scratch(x, y);
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    scratch(x, y);
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  const checkScratchedPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let transparentCount = 0;

    // Sample pixels for performance
    for (let i = 3; i < pixels.length; i += 16) {
      if (pixels[i] === 0) {
        transparentCount++;
      }
    }

    const totalSampled = pixels.length / 16;
    const percentage = (transparentCount / totalSampled) * 100;

    if (percentage > 35) { // Lower threshold slightly for easier scratching
      setIsScratched(true);
      if (onComplete) {
        onComplete();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center bg-wedding-crimson p-2 sm:p-3 rounded-lg border border-wedding-gold/30 shadow-lg text-center touch-none select-none"
      style={{ width, height: height + 30 }}
      id={`scratch-card-${id}`}
    >
      <span className="text-wedding-gold font-serif text-[10px] sm:text-xs uppercase tracking-wider mb-1 sm:mb-2 select-none">
        {title}
      </span>
      
      <div className="relative overflow-hidden rounded border border-wedding-gold/20 flex-1 w-full flex flex-col justify-center items-center bg-wedding-maroon p-1 sm:p-2">
        {/* Underlay revealed text */}
        <div className="flex flex-col items-center justify-center h-full animate-fade-in select-none w-full px-1">
          <span className={`text-wedding-gold font-serif font-bold tracking-tight whitespace-nowrap ${
            revealText.length > 3 ? 'text-sm sm:text-xl' : 'text-xl sm:text-3xl'
          }`}>
            {revealText}
          </span>
          {subText && (
            <span className="text-white/80 text-[9px] sm:text-xs font-sans mt-0.5 sm:mt-1 whitespace-nowrap overflow-hidden text-ellipsis">
              {subText}
            </span>
          )}
        </div>

        {/* Scratchable Canvas Overlay */}
        <canvas
          ref={canvasRef}
          className={`absolute top-0 left-0 w-full h-full scratch-overlay transition-opacity duration-500 touch-none select-none ${
            isScratched ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        />
      </div>
    </div>
  );
};
