import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { EmojiProgressProps, EmojiState } from '../types';

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
});

const getEmojiState = (completedTasks: string[], totalTasks: number): EmojiState => {
  const percentage = (completedTasks.length / totalTasks) * 100;
  if (percentage >= 80) return '🤩';
  if (percentage >= 60) return '😃';
  if (percentage >= 40) return '😄';
  if (percentage >= 20) return '😊';
  return '😴';
};

const EmojiProgress = ({ completedTasks, totalTasks }: EmojiProgressProps) => {
  const emojiState = getEmojiState(completedTasks, totalTasks);

  return (
    <EmojiContainer>
      <EmojiText
        key={emojiState}
        initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.5, opacity: 0, rotate: 180 }}
        transition={{ 
          type: 'spring', 
          stiffness: 500, 
          damping: 30,
          duration: 0.5
        }}
      >
        {emojiState}
      </EmojiText>
    </EmojiContainer>
  );
};

export default EmojiProgress; 