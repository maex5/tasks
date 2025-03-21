import { motion } from 'framer-motion';
import { useDeviceOrientation } from '../hooks/useDeviceOrientation';
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

  const { orientation, requestPermission, permissionState } = useDeviceOrientation();

  // Calculate rotation values with increased range
  const rotateX = orientation.beta ? Math.max(-45, Math.min(45, orientation.beta / 2)) : 0;
  const rotateY = orientation.gamma ? Math.max(-45, Math.min(45, orientation.gamma / 2)) : 0;

  return (
    <div className="emoji-progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
      {permissionState === 'prompt' && (
        <button 
          onClick={requestPermission}
          className="permission-button"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '12px 24px',
            fontSize: '1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          Enable 3D Motion
        </button>
      )}
      <motion.div
        key={emoji}
        className="emoji"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          rotateX: rotateX,
          rotateY: rotateY,
        }}
        transition={SPRING_ANIMATION}
        style={{
          fontSize: '8rem',
          transformStyle: 'preserve-3d',
          perspective: 1000,
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