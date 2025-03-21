import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import './EmojiProgress.css';

interface EmojiProgressProps {
  progress: number;
}

const SPRING_ANIMATION = {
  type: 'spring',
  stiffness: 300,
  damping: 20,
} as const;

const EMOJI_THRESHOLDS = [
  { threshold: 100, emoji: '🤩', label: 'Fantastic' },
  { threshold: 75, emoji: '😃', label: 'Very good' },
  { threshold: 50, emoji: '😊', label: 'Good' },
  { threshold: 25, emoji: '😐', label: 'Okay' },
  { threshold: 1, emoji: '😢', label: 'Just starting' },
  { threshold: 0, emoji: '😭', label: 'Not started' },
] as const;

const ANGRY_EMOJI = '😡';

function EmojiProgress({ progress }: EmojiProgressProps) {
  const [isAngry, setIsAngry] = useState(false);
  const { emoji: baseEmoji, label } = EMOJI_THRESHOLDS.find(
    ({ threshold }) => progress >= threshold
  ) || EMOJI_THRESHOLDS[EMOJI_THRESHOLDS.length - 1];

  const playScream = useCallback(() => {
    const audio = new Audio('/tasks/scream.mp3');
    audio.volume = 1.0;
    audio.play().catch(error => {
      // Silently handle any autoplay restrictions
    });
  }, []);

  const handleClick = useCallback(() => {
    if (!isAngry) {
      setIsAngry(true);
      playScream();
      setTimeout(() => setIsAngry(false), 1000);
    }
  }, [isAngry, playScream]);

  const currentEmoji = isAngry ? ANGRY_EMOJI : baseEmoji;

  return (
    <div 
      className="emoji-progress" 
      role="progressbar" 
      aria-valuenow={progress} 
      aria-valuemin={0} 
      aria-valuemax={100}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <motion.div
        key={currentEmoji}
        className="emoji"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ 
          scale: isAngry ? [1, 1.2, 1] : 1, 
          opacity: 1,
          rotate: isAngry ? [0, -15, 15, -15, 0] : [0, 5, 0, -5, 0],
          y: isAngry ? [0, -10, 0] : [0, -5, 0, -5, 0]
        }}
        transition={{
          ...SPRING_ANIMATION,
          scale: {
            duration: isAngry ? 0.3 : 0.5,
          },
          rotate: {
            duration: isAngry ? 0.3 : 4,
            repeat: isAngry ? 0 : Infinity,
            ease: "linear"
          },
          y: {
            duration: isAngry ? 0.3 : 2,
            repeat: isAngry ? 0 : Infinity,
            ease: "easeInOut"
          }
        }}
        style={{
          fontSize: '8rem',
          transformOrigin: 'center center',
        }}
        aria-label={`${label} - ${progress}% complete`}
      >
        {currentEmoji}
      </motion.div>
    </div>
  );
}

export default EmojiProgress; 