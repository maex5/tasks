import { motion } from 'framer-motion';
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
  { threshold: 50, emoji: '🙂', label: 'Good' },
  { threshold: 25, emoji: '😐', label: 'Okay' },
  { threshold: 1, emoji: '😢', label: 'Just starting' },
  { threshold: 0, emoji: '😭', label: 'Not started' },
] as const;

function EmojiProgress({ progress }: EmojiProgressProps) {
  const { emoji, label } = EMOJI_THRESHOLDS.find(
    ({ threshold }) => progress >= threshold
  ) || EMOJI_THRESHOLDS[EMOJI_THRESHOLDS.length - 1];

  return (
    <div className="emoji-progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
      <motion.div
        key={emoji}
        className="emoji"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          rotate: [0, 5, 0, -5, 0],
          y: [0, -5, 0, -5, 0]
        }}
        transition={{
          ...SPRING_ANIMATION,
          rotate: {
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          },
          y: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        style={{
          fontSize: '8rem',
          transformOrigin: 'center center',
        }}
        aria-label={`${label} - ${progress}% complete`}
      >
        {emoji}
      </motion.div>
    </div>
  );
}

export default EmojiProgress; 