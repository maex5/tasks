import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { TaskButtonProps } from '../types';

const SwitchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  cursor: 'pointer',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const LightBulb = styled(motion.div)(({ theme }) => ({
  width: 24,
  height: 24,
  borderRadius: '50%',
  backgroundColor: theme.palette.warning.main,
  boxShadow: '0 0 10px rgba(255, 193, 7, 0.5)',
}));

const TaskButton = ({ task, isCompleted, onToggle }: TaskButtonProps) => {
  const handleClick = () => {
    // Play sound effect
    const audio = new Audio('/switch-sound.mp3');
    audio.play().catch(() => {}); // Ignore errors if sound is blocked
    onToggle(task.id);
  };

  return (
    <SwitchContainer onClick={handleClick}>
      <Typography variant="h6" component="span">
        {task.emoji}
      </Typography>
      <Typography variant="body1" component="span">
        {task.name}
      </Typography>
      {isCompleted && (
        <LightBulb
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </SwitchContainer>
  );
};

export default TaskButton; 