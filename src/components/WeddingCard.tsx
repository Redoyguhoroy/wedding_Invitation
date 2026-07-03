import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Calendar, Clock, Music, Gift, Heart, Sparkles } from 'lucide-react';
import { ScratchCard } from './ScratchCard';
import { Countdown } from './Countdown';
import { FlowerCelebration } from './FlowerCelebration';

// @ts-ignore
import ganeshaGoldIcon from '../assets/images/ganesha_gold_icon_1783065892417.jpg';

export const WeddingCard: React.FC = () => {
  const [datesRevealed, setDatesRevealed] = useState({
    month: false,
    day: false,
    year: false,
  });

  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [flowerParticles, setFlowerParticles] = useState<any[]>([]);

  const cardWidth = isMobile ? 100 : 135;
  const cardHeight = isMobile ? 130 : 160;

  const handleReveal = (field: 'month' | 'day' | 'year') => {
    setDatesRevealed((prev) => ({ ...prev, [field]: true }));
  };

  const isFullyRevealed = datesRevealed.month && datesRevealed.day && datesRevealed.year;

  // Trigger glorious flower burst upon full reveal
  useEffect(() => {
    if (isFullyRevealed) {
      // Generate colorful flower burst particles radiating outwards
      const particles = Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 360 / 24) * (Math.PI / 180);
        const distance = Math.random() * 160 + 90;
        return {
          id: i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 20, // Gentle drift upwards
          scale: Math.random() * 0.8 + 0.6,
          rotate: Math.random() * 360,
          delay: Math.random() * 0.25,
          duration: Math.random() * 1.5 + 1.5,
          type: i % 3
        };
      });
      setFlowerParticles(particles);
    }
  }, [isFullyRevealed]);

  const events = [
    {
      title: '🌼 হলুদ সন্ধ্যা (Haldi Evening)',
      titleEn: 'Haldi Sandhya',
      date: '📅 ৬ আগস্ট ২০২৬ (বৃহস্পতিবার)',
      dateEn: '6 August 2026 (Thursday)',
      time: '🕒 সময়: সন্ধ্যা ৭.০০',
      timeEn: '7:30 PM',
      venue: '📍 স্থান: নিজের বাড়ি',
      venueEn: 'Groom’s Residence (nejer bari)',
      image: '/src/assets/images/haldi_ceremony_1783012869747.jpg',
    },
    {
      title: '💍 বিবাহ অনুষ্ঠান (Wedding Ceremony)',
      titleEn: 'The Auspicious Marriage',
      date: '📅 ৭ আগস্ট ২০২৬ (শুক্রবার)',
      dateEn: '7 August 2026 (Friday)',
      time: '🕒 সময়: To Be Added',
      timeEn: 'To Be Added',
      venue: '📍 স্থান: To Be Added',
      venueEn: 'To Be Added',
      image: '/src/assets/images/couple_profile_1783012856706.jpg',
    },
    {
      title: '🎉 সংবর্ধনা (Reception)',
      titleEn: 'Wedding Reception',
      date: '📅  ১০ আগস্ট ২০২৬ (সোমবার)',
      dateEn: '10 August 2026 (Monday)',
      time: '🕒 সময়: দুপুর ১:৩০ Pm',
      timeEn: ' ১:৩০ PM',
      venue: '📍 স্থান: বীরশ্রেষ্ঠ মুন্সী আব্দুর রউফ পৌর মিলনায়তন ও কমিউনিটি সেন্টার, ফরিদপুর',
      venueEn: 'Birshreshtho Munsi Abdur Rouf Municipal Auditorium Cum-Community Center, Faridpur',
      image: 'https://i.postimg.cc/rsgWcZV5/reception.jpg',
      mapLink: 'https://www.google.com/maps/place/Birshreshtho+Munsi+Abdur+Rouf+Municipal+Auditorium+Cum-Community+Center/@23.598097,89.8275651,17z/data=!3m1!4b1!4m6!3m5!1s0x39fe3aeb6787e889:0x70f9e7cd6cca7a85!8m2!3d23.598097!4d89.8275651!16s%2Fg%2F1hf97nxw4!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D',
    },
  ];

  return (
    <div className="min-h-screen w-full relative bg-wedding-maroon pb-24 overflow-x-hidden selection:bg-wedding-gold selection:text-wedding-maroon">
      {/* Full screen immersive Canvas flower burst celebration */}
      <FlowerCelebration trigger={isFullyRevealed} />

      {/* Dynamic Background Falling Petals / sparkles using CSS absolute layers */}
      <div className="absolute inset-0 card-pattern opacity-10 pointer-events-none" />

      {/* Frame border representing traditional wedding style card */}
      <div className="absolute inset-3 border-2 border-wedding-gold/25 pointer-events-none z-40 rounded-2xl">
        <div className="absolute top-2 left-2 w-12 h-12 border-t-2 border-l-2 border-wedding-gold/60 rounded-tl" />
        <div className="absolute top-2 right-2 w-12 h-12 border-t-2 border-r-2 border-wedding-gold/60 rounded-tr" />
        <div className="absolute bottom-2 left-2 w-12 h-12 border-b-2 border-l-2 border-wedding-gold/60 rounded-bl" />
        <div className="absolute bottom-2 right-2 w-12 h-12 border-b-2 border-r-2 border-wedding-gold/60 rounded-br" />
      </div>

      {/* Main Content Layout */}
      <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 pt-16 relative z-10 flex flex-col items-center">
        {/* Header Ganesha */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-10 flex flex-col items-center"
        >
          {/* Detailed Ganesha Vector Symbol design overlay */}
          <div className="w-28 h-28 sm:w-32 sm:h-32 relative mb-5 rounded-full border-[3px] border-wedding-gold/60 p-1 bg-gradient-to-br from-wedding-gold/30 via-transparent to-wedding-gold/10 shadow-[0_0_25px_rgba(212,175,55,0.45)] overflow-hidden flex items-center justify-center animate-[pulse_3.5s_ease-in-out_infinite]">
            <img 
              src={ganeshaGoldIcon} 
              alt="Lord Ganesha" 
              className="w-full h-full object-cover rounded-full scale-[1.12]" 
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Sanskrit Sloka in Bengali Script */}
          <span className="text-wedding-gold font-sans text-xs md:text-sm max-w-lg leading-relaxed px-4 block">
            ॥ শ্রী গণেশায় নমঃ ॥
            <br />
            বক্রতুণ্ড মহাকায় সূর্যকোটি সমপ্রভ।
            <br />
            নির্বিঘ্নং কুরু মে দেব সর্বকার্যেষু সর্বদা॥
          </span>
          <div className="w-16 h-px bg-wedding-gold/20 my-4" />
          <span className="text-wedding-gold-light font-serif text-xs tracking-widest uppercase">With the divine blessings</span>
        </motion.div>

        {/* Invitation Text Frame */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-16 max-w-xl flex flex-col items-center px-4"
        >
          <span className="text-wedding-gold font-serif text-3xl font-extrabold tracking-widest gold-shimmer block mb-4">
            "সস্নেহ আমন্ত্রণ"
          </span>
          
          <h1 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight font-serif mb-3 leading-tight">
            প্রশান্ত গুহ রায় <br className="md:hidden" />
            <span className="text-wedding-gold text-2xl md:text-4xl mx-2">❤️</span> 
            সর্না দাস
          </h1>
          
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-wedding-gold to-transparent my-4" />
          
          <p className="text-wedding-gold-light font-sans text-sm md:text-lg leading-relaxed font-medium">
            "আমাদের শুভ বিবাহ অনুষ্ঠানে আপনাকে ও আপনার পরিবারকে আন্তরিক আমন্ত্রণ"
          </p>
          
          <p className="text-white/60 text-xs italic mt-2">
            We cordially invite you and your family to grace the auspicious marriage ceremony of Prashant and Swarna.
          </p>
        </motion.div>

        {/* Save the Date Interactive Scratch Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="w-full bg-[#4e0c15]/90 border border-wedding-gold/35 rounded-3xl p-5 sm:p-8 shadow-2xl mb-16 text-center max-w-2xl relative overflow-visible"
        >
          {/* Side designs */}
          <div className="absolute top-4 left-4 text-wedding-gold/30 text-lg">✿</div>
          <div className="absolute top-4 right-4 text-wedding-gold/30 text-lg">✿</div>
          
          <h3 className="text-wedding-gold font-serif text-lg font-bold uppercase tracking-widest mb-1">
            Save The Date
          </h3>
          <span className="text-white/60 text-xs block mb-6">
            শুভ দিনটি জানতে কার্ড তিনটি ঘষুন (Scratch to Reveal)
          </span>

          {/* Grid of Scratch Cards - Always side-by-side in one line */}
          <div className="grid grid-cols-3 gap-2 sm:gap-6 justify-items-center mb-6 w-full max-w-lg mx-auto">
            <ScratchCard
              id="day"
              title={isMobile ? "তারিখ" : "তারিখ (Day)"}
              revealText="৭"
              subText="FRIDAY"
              width={cardWidth}
              height={cardHeight}
              onComplete={() => handleReveal('day')}
            />
            <ScratchCard
              id="month"
              title={isMobile ? "মাস" : "মাস (Month)"}
              revealText="আগস্ট"
              subText="AUGUST"
              width={cardWidth}
              height={cardHeight}
              onComplete={() => handleReveal('month')}
            />
            <ScratchCard
              id="year"
              title={isMobile ? "বছর" : "বছর (Year)"}
              revealText="২০২৬"
              subText="2026"
              width={cardWidth}
              height={cardHeight}
              onComplete={() => handleReveal('year')}
            />
          </div>

          {/* Elegant Flower Particle Animation Burst */}
          <AnimatePresence>
            {isFullyRevealed && (
              <div className="absolute inset-0 pointer-events-none overflow-visible z-50">
                {flowerParticles.map((fp) => (
                  <motion.div
                    key={fp.id}
                    initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
                    animate={{ 
                      x: fp.x, 
                      y: fp.y, 
                      scale: [0, fp.scale, fp.scale * 0.8, 0], 
                      opacity: [1, 1, 0.8, 0],
                      rotate: fp.rotate + 360 
                    }}
                    transition={{ duration: fp.duration, ease: 'easeOut', delay: fp.delay }}
                    className="absolute left-1/2 top-1/2"
                    style={{ marginLeft: '-16px', marginTop: '-16px' }}
                  >
                    <svg width="32" height="32" viewBox="-16 -16 32 32">
                      {fp.type === 0 && (
                        <g className="fill-wedding-gold">
                          {Array.from({ length: 8 }).map((_, idx) => (
                            <path
                              key={idx}
                              d="M0,0 C-4,-12 4,-12 0,0"
                              transform={`rotate(${idx * 45})`}
                            />
                          ))}
                          <circle cx="0" cy="0" r="3.5" fill="#ffffff" />
                        </g>
                      )}
                      {fp.type === 1 && (
                        <g fill="#f43f5e">
                          <path d="M0,0 C-8,-10 -2,-14 0,-3 C2,-14 8,-10 0,0" />
                          <path d="M0,0 C-7,7 -11,0 0,-1" transform="rotate(45)" />
                          <path d="M0,0 C7,7 11,0 0,-1" transform="rotate(-45)" />
                          <circle cx="0" cy="0" r="2" fill="#eab308" />
                        </g>
                      )}
                      {fp.type === 2 && (
                        <g fill="#ffffff">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <path
                              key={idx}
                              d="M0,0 C-5,-10 5,-10 0,0"
                              transform={`rotate(${idx * 72})`}
                            />
                          ))}
                          <circle cx="0" cy="0" r="3" fill="#eab308" />
                        </g>
                      )}
                    </svg>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Styled Date Reveal inside a luxurious single line card */}
          <AnimatePresence>
            {isFullyRevealed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', damping: 15 }}
                className="mt-6 bg-[#2a0408] border-2 border-wedding-gold/40 p-5 sm:p-6 rounded-2xl inline-flex flex-col items-center relative overflow-hidden shadow-[0_0_25px_rgba(212,175,55,0.25)] w-full max-w-md mx-auto"
              >
                {/* Gold filigree corner designs */}
                <div className="absolute top-1.5 left-1.5 text-wedding-gold/50 text-[10px]">✿</div>
                <div className="absolute top-1.5 right-1.5 text-wedding-gold/50 text-[10px]">✿</div>
                <div className="absolute bottom-1.5 left-1.5 text-wedding-gold/50 text-[10px]">✿</div>
                <div className="absolute bottom-1.5 right-1.5 text-wedding-gold/50 text-[10px]">✿</div>

                {/* Inner gold border accent */}
                <div className="absolute inset-1.5 border border-wedding-gold/15 rounded-xl pointer-events-none" />

                <motion.div 
                  initial={{ rotate: -4, scale: 0.95 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="flex items-center space-x-2 text-wedding-gold font-serif text-xl sm:text-2xl font-bold tracking-wider z-10"
                >
                  <span className="text-2xl animate-bounce">📅</span>
                  <span>৭ আগস্ট ২০২৬</span>
                </motion.div>
                
                <motion.span 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-wedding-gold-light/95 text-xs sm:text-sm mt-2 font-sans tracking-wide z-10 font-semibold"
                >
                  শুক্রবার (Friday) • আমাদের শুভ বিবাহবাসর
                </motion.span>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.15 }}
                  className="absolute inset-0 bg-gradient-to-tr from-wedding-gold/20 via-transparent to-wedding-gold/20 pointer-events-none"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Live Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="w-full max-w-3xl mb-16"
        >
          <div className="text-center mb-6">
            <Clock className="w-6 h-6 text-wedding-gold mx-auto mb-1 animate-[spin_12s_linear_infinite]" />
            <span className="text-wedding-gold font-serif text-sm uppercase tracking-widest">
              শুভ শুভ পরিণয় ক্ষণগণনা
            </span>
            <span className="text-white/50 text-xs block">Countdown to Wedding Day</span>
          </div>
          <Countdown targetDate="2026-08-07T00:00:00" />
        </motion.div>

        {/* Wedding Events Bento Grid section */}
        <div className="w-full max-w-5xl mb-16 px-4">
          <div className="text-center mb-12">
            <Gift className="w-8 h-8 text-wedding-gold mx-auto mb-2" />
            <h2 className="text-wedding-gold font-serif text-3xl font-bold tracking-tight">
              মাঙ্গলিক অনুষ্ঠানসূচী
            </h2>
            <span className="text-white/60 font-serif text-xs tracking-widest uppercase">Wedding Festivities</span>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-wedding-gold to-transparent mx-auto mt-3" />
          </div>

          {/* Responsive 3-Column Grid for PC and Tablet, clean stacked list for Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full">
            {events.map((evt, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-[#480c14]/90 rounded-2xl border border-wedding-gold/20 overflow-hidden shadow-2xl flex flex-col hover:border-wedding-gold/45 transition-all duration-300 h-full justify-between hover:shadow-[0_15px_30px_-5px_rgba(212,175,55,0.15)]"
              >
                {/* Event Image */}
                <div className="w-full h-56 sm:h-64 overflow-hidden relative">
                  <img
                    src={(evt as any).image}
                    alt={evt.titleEn}
                    className="w-full h-full object-cover transform scale-[1.12] hover:scale-[1.22] transition-transform duration-700 origin-center"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#200306]/90 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Event Details */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <span className="text-wedding-gold font-serif text-xl font-bold block">
                      {evt.title}
                    </span>
                    <span className="text-wedding-gold-light/60 font-serif text-[10px] tracking-wider uppercase block leading-none -mt-2">
                      {evt.titleEn}
                    </span>

                    <div className="space-y-2.5 mt-4 text-white/90 text-sm">
                      <div className="flex items-center space-x-2.5">
                        <Calendar className="w-4 h-4 text-wedding-gold shrink-0" />
                        <span>{evt.date}</span>
                      </div>
                      <div className="flex items-center space-x-2.5">
                        <Clock className="w-4 h-4 text-wedding-gold shrink-0" />
                        <span>{evt.time}</span>
                      </div>
                      <div className="flex items-start space-x-2.5">
                        <MapPin className="w-4 h-4 text-wedding-gold mt-1 shrink-0" />
                        <span className="leading-relaxed">{evt.venue}</span>
                      </div>
                    </div>
                  </div>

                  {evt.mapLink && (
                    <div className="pt-2 flex flex-col space-y-2">
                      <span className="text-white/40 text-[10px] leading-relaxed">
                        * সংবর্ধনা স্থানটি সহজে ম্যাপে পেতে নিচের বাটনে ক্লিক করুন:
                      </span>
                      <a
                        href={evt.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-wedding-gold to-[#b8860b] text-wedding-maroon font-serif font-bold text-xs px-4 py-2.5 rounded-xl hover:from-[#fcf6ba] hover:to-wedding-gold shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95 text-center"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>গুগল ম্যাপে লোকেশন (Google Maps)</span>
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Sweet Greeting card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center py-10 mt-10 max-w-md px-4 border-t border-wedding-gold/10 flex flex-col items-center"
        >
          <span className="text-wedding-gold font-serif text-sm font-bold tracking-widest uppercase">
            Bless Our New Beginning
          </span>
          <p className="text-white/70 text-xs mt-3 leading-relaxed">
            "আপনার উপস্থিতি ও আন্তরিক আশীর্বাদ আমাদের নতুন জীবনের পথচলাকে অনেক বেশি আনন্দময় ও সুন্দর করে তুলবে।"
          </p>
          <div className="flex items-center space-x-1.5 text-wedding-gold font-serif text-sm mt-4 font-bold">
            <span>ইতি,</span>
            <span className="text-wedding-gold-light"> গুহ রায় পরিবার</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
