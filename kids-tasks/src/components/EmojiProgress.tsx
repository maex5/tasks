import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { EmojiProgressProps, EmojiState } from '../types';

const EmojiContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
}));

const EmojiText = styled(motion.div)({
  fontSize: '4rem',
});

const ProgressText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

const getEmojiState = (completedTasks: string[], totalTasks: number): EmojiState => {
  const percentage = (completedTasks.length / totalTasks) * 100;
  if (percentage === 0) return '😭';
  if (percentage < 25) return '😢';
  if (percentage < 50) return '😐';
  if (percentage < 75) return '🙂';
  return '😃';
};

const EmojiProgress = ({ completedTasks, totalTasks }: EmojiProgressProps) => {
  const emojiState = getEmojiState(completedTasks, totalTasks);
  const percentage = Math.round((completedTasks.length / totalTasks) * 100);

  return (
    <EmojiContainer>
      <EmojiText
        key={emojiState}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {emojiState}
      </EmojiText>
      <ProgressText variant="body1">
        {percentage}% Complete
      </ProgressText>
    </EmojiContainer>
  );
};

export default EmojiProgress; 