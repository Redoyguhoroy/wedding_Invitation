import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import IntroPortal from './components/IntroPortal';
import { WeddingCard } from './components/WeddingCard';
import { AudioPlayer } from './components/AudioPlayer';
import { FallingPetals } from './components/FallingPetals';

export default function App() {
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [audioTriggered, setAudioTriggered] = useState(false);

  const handleEnterInvitation = () => {
    setIsPortalOpen(true);
    setAudioTriggered(true);
  };

  return (
    <div className="min-h-screen w-full bg-[#0b0102] bg-[radial-gradient(circle_at_center,rgba(56,7,13,0.95)_0%,rgba(10,1,2,1)_100%)] flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden relative">
      
      {/* Elegantly overlay active falling petals as the ambient main backdrop */}
      {isPortalOpen && <FallingPetals />}

      {/* Luxury Responsive Frame layout - full screen on mobile, beautiful large album-style on desktop/tablet */}
      <div className="w-full max-w-5xl md:mx-auto min-h-screen md:min-h-[85vh] md:my-6 md:rounded-[36px] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] md:border-[4px] md:border-wedding-gold/25 bg-wedding-maroon relative overflow-y-auto overflow-x-hidden flex flex-col justify-start scrollbar-none text-wedding-rose selection:bg-wedding-gold selection:text-wedding-maroon font-sans">
        <AnimatePresence mode="wait">
          {!isPortalOpen ? (
            <motion.div
              key="portal-screen"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="w-full h-full min-h-screen sm:min-h-0 flex-1 flex flex-col"
            >
              <IntroPortal onEnter={handleEnterInvitation} />
            </motion.div>
          ) : (
            <motion.div
              key="invitation-screen"
              initial={{ opacity: 0, y: 70 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex-1 flex flex-col"
            >
              <WeddingCard />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Persistent, smart floating audio controller inside the mobile container */}
        <AudioPlayer 
          shouldPlay={audioTriggered} 
          onStateChange={(playing) => {
            if (playing && !audioTriggered) {
              setAudioTriggered(true);
            }
          }} 
        />
      </div>
    </div>
  );
}

