import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useDeviceOrientation } from '../hooks/useDeviceOrientation';
import { useEffect } from 'react';
import './EmojiProgress.css';

interface EmojiProgressProps {
  progress: number;
}

const SPRING_ANIMATION = {
  type: 'spring',
  stiffness: 500,
  damping: 30,
  duration: 0.5
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

  const { beta, gamma } = useDeviceOrientation();

  // Create motion values for the tilts
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  // Transform the tilt values to rotation angles
  const rotateX = useTransform(tiltY, [-1, 1], [-30, 30]);
  const rotateY = useTransform(tiltX, [-1, 1], [-30, 30]);

  // Update motion values when orientation changes
  useEffect(() => {
    if (beta !== null && gamma !== null) {
      tiltX.set(gamma / 90); // gamma ranges from -90 to 90
      tiltY.set(beta / 180); // beta ranges from -180 to 180
    }
  }, [beta, gamma, tiltX, tiltY]);

  return (
    <div className="emoji-progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
      <motion.div
        key={emoji}
        className="emoji"
        initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
        animate={{ 
          scale: 1, 
          opacity: 1, 
          rotate: 0
        }}
        exit={{ scale: 0.5, opacity: 0, rotate: 180 }}
        transition={SPRING_ANIMATION}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          perspective: 1000
        }}
        aria-label={`${label} - ${progress}% complete`}
      >
        {emoji}
      </motion.div>
    </div>
  );
}

export default EmojiProgress; 