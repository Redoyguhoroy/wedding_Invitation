import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: string; // e.g., '2026-08-07T00:00:00'
}

const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

const toBnNum = (num: number): string => {
  return num
    .toString()
    .split('')
    .map((d) => {
      const parsed = parseInt(d, 10);
      return isNaN(parsed) ? d : bnDigits[parsed];
    })
    .join('');
};

export const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const timeBlocks = [
    { label: 'দিন', labelEn: 'Days', val: timeLeft.days },
    { label: 'ঘণ্টা', labelEn: 'Hours', val: timeLeft.hours },
    { label: 'মিনিট', labelEn: 'Mins', val: timeLeft.minutes },
    { label: 'সেকেন্ড', labelEn: 'Secs', val: timeLeft.seconds },
  ];

  if (timeLeft.isExpired) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-wedding-crimson/30 rounded-xl border border-wedding-gold/20 backdrop-blur-sm shadow-xl">
        <span className="text-wedding-gold font-serif text-2xl font-bold animate-pulse text-center">
          🎉 আজ শুভ বিবাহ উৎসব! 🎉
        </span>
        <span className="text-white/80 text-sm mt-1 text-center">
          আমাদের যাত্রা আজ পূর্ণতা পেতে চলেছে।
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center space-x-3 md:space-x-6 justify-center">
        {timeBlocks.map((block, i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center">
              {/* Outer Golden Border Circular Frame */}
              <div className="relative w-16 h-16 md:w-24 md:h-24 flex flex-col items-center justify-center rounded-full bg-gradient-to-b from-[#4a0e17] to-[#1a0407] border-2 border-wedding-gold/40 shadow-inner group hover:border-wedding-gold transition-colors duration-300">
                {/* Bengali Numeral */}
                <span className="text-wedding-gold font-mono text-xl md:text-3xl font-bold leading-none tracking-tight">
                  {toBnNum(block.val)}
                </span>
                {/* English Numeral overlay */}
                <span className="text-white/40 text-[9px] md:text-xs font-mono absolute bottom-2 md:bottom-3">
                  {block.val.toString().padStart(2, '0')}
                </span>
              </div>
              {/* Labels */}
              <span className="text-wedding-gold-light font-medium text-[11px] md:text-sm mt-2">
                {block.label}
              </span>
              <span className="text-white/50 text-[9px] uppercase tracking-widest mt-0.5">
                {block.labelEn}
              </span>
            </div>
            {i < timeBlocks.length - 1 && (
              <span className="text-wedding-gold/50 text-xl md:text-3xl font-light self-center mb-6">
                :
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
