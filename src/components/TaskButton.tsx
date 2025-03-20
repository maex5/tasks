import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { TaskButtonProps } from '../types';

const SwitchContainer = styled(motion.div)<{ isCompleted: boolean }>(({ theme, isCompleted }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  background: isCompleted 
    ? `linear-gradient(45deg, #4CAF50, #45a049)`
    : `linear-gradient(45deg, #FF4444, #ff3333)`,
  borderRadius: 20,
  boxShadow: isCompleted 
    ? '0 6px 16px rgba(76, 175, 80, 0.3)'
    : '0 6px 16px rgba(255, 68, 68, 0.3)',
  cursor: 'pointer',
  transition: 'all 0.3s',
  transform: isCompleted ? 'scale(1.02)' : 'scale(1)',
  '&:hover': {
    transform: isCompleted ? 'scale(1.04)' : 'scale(1.02)',
    boxShadow: isCompleted 
      ? '0 8px 20px rgba(76, 175, 80, 0.4)'
      : '0 8px 20px rgba(255, 68, 68, 0.4)',
  },
}));

const TaskEmoji = styled(motion.div)<{ isCompleted: boolean }>(({ isCompleted }) => ({
  fontSize: '2.5rem',
  lineHeight: 1,
  filter: isCompleted 
    ? 'drop-shadow(0 4px 8px rgba(76, 175, 80, 0.3))'
    : 'drop-shadow(0 4px 8px rgba(255, 68, 68, 0.3))',
  transform: isCompleted ? 'scale(1.1)' : 'scale(1)',
}));

const TaskButton = ({ task, isCompleted, onToggle }: TaskButtonProps) => {
  const handleClick = () => {
    // Play sound effect
    const audio = new Audio('/switch-sound.mp3');
    audio.play().catch(() => {}); // Ignore errors if sound is blocked
    onToggle(task.id);
  };

  return (
    <SwitchContainer
      onClick={handleClick}
      whileHover={{ scale: isCompleted ? 1.04 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      isCompleted={isCompleted}
    >
      <TaskEmoji
        animate={{ 
          scale: isCompleted ? 1.1 : 1,
          rotate: isCompleted ? 360 : 0
        }}
        transition={{ 
          type: 'spring', 
          stiffness: 500, 
          damping: 30,
          duration: 0.3
        }}
        isCompleted={isCompleted}
      >
        {task.emoji}
      </TaskEmoji>
    </SwitchContainer>
  );
};

export default TaskButton; 