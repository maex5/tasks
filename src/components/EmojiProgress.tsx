import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { EmojiProgressProps, EmojiState } from '../types';
import { memo } from 'react';

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

const EmojiContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  marginBottom: theme.spacing(4),
}));

const EmojiText = styled(motion.div)({
  fontSize: '6rem',
  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
  userSelect: 'none',
});

/**
 * Determines the emoji state based on the completion percentage
 * @param completedTasks - Array of completed task IDs
 * @param totalTasks - Total number of tasks
 * @returns Object containing the emoji and its label
 */
const getEmojiState = (completedTasks: string[], totalTasks: number) => {
  if (totalTasks === 0) return { emoji: '😐' as EmojiState, label: 'No tasks' };
  
  const percentage = (completedTasks.length / totalTasks) * 100;
  const { emoji, label } = EMOJI_THRESHOLDS.find(
    ({ threshold }) => percentage >= threshold
  ) || EMOJI_THRESHOLDS[EMOJI_THRESHOLDS.length - 1];

  return { emoji: emoji as EmojiState, label };
};

/**
 * EmojiProgress component displays an animated emoji that reflects task completion progress.
 * The emoji changes based on the percentage of completed tasks.
 */
const EmojiProgress = memo(({ completedTasks, totalTasks }: EmojiProgressProps) => {
  const { emoji, label } = getEmojiState(completedTasks, totalTasks);
  const percentage = Math.round((completedTasks.length / totalTasks) * 100);

  return (
    <EmojiContainer role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
      <EmojiText
        key={emoji}
        initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.5, opacity: 0, rotate: 180 }}
        transition={SPRING_ANIMATION}
        aria-label={`${label} - ${percentage}% complete`}
      >
        {emoji}
      </EmojiText>
    </EmojiContainer>
  );
});

EmojiProgress.displayName = 'EmojiProgress';

export default EmojiProgress; 