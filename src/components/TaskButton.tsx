import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { TaskButtonProps } from '../types';
import { memo, useCallback } from 'react';

const SPRING_ANIMATION = {
  type: 'spring',
  stiffness: 500,
  damping: 30,
  duration: 0.3
} as const;

const SwitchContainer = styled(motion.button)<{ $isCompleted: boolean }>(({ theme, $isCompleted }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  background: $isCompleted 
    ? `linear-gradient(45deg, #4CAF50, #45a049)`
    : `linear-gradient(45deg, #FF4444, #ff3333)`,
  borderRadius: 16,
  boxShadow: $isCompleted 
    ? '0 4px 12px rgba(76, 175, 80, 0.3)'
    : '0 4px 12px rgba(255, 68, 68, 0.3)',
  cursor: 'pointer',
  transition: 'all 0.3s',
  transform: $isCompleted ? 'scale(1.02)' : 'scale(1)',
  width: 'calc(50% - ${theme.spacing(1)})',
  border: 'none',
  '&:hover': {
    transform: $isCompleted ? 'scale(1.04)' : 'scale(1.02)',
    boxShadow: $isCompleted 
      ? '0 6px 16px rgba(76, 175, 80, 0.4)'
      : '0 6px 16px rgba(255, 68, 68, 0.4)',
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
}));

const TaskEmoji = styled(motion.span)<{ $isCompleted: boolean }>(({ $isCompleted }) => ({
  fontSize: '2rem',
  lineHeight: 1,
  filter: $isCompleted 
    ? 'drop-shadow(0 2px 4px rgba(76, 175, 80, 0.3))'
    : 'drop-shadow(0 2px 4px rgba(255, 68, 68, 0.3))',
  transform: $isCompleted ? 'scale(1.1)' : 'scale(1)',
}));

/**
 * TaskButton component displays a task as an interactive button with an emoji.
 * The button changes appearance based on completion status and includes animations.
 * 
 * @param task - The task to display
 * @param isCompleted - Whether the task is completed
 * @param onToggle - Callback when the task is toggled
 */
const TaskButton = memo(({ task, isCompleted, onToggle }: TaskButtonProps) => {
  const handleClick = useCallback(() => {
    // Play sound effect
    const audio = new Audio('/tasks/switch-sound.mp3');
    audio.play().catch(() => {
      // Silent catch - audio might be blocked by browser
    });
    onToggle(task.id);
  }, [task.id, onToggle]);

  return (
    <SwitchContainer
      onClick={handleClick}
      whileHover={{ scale: isCompleted ? 1.04 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      $isCompleted={isCompleted}
      aria-label={`${task.name} - ${isCompleted ? 'completed' : 'not completed'}`}
      aria-pressed={isCompleted}
      role="switch"
    >
      <TaskEmoji
        animate={{ 
          scale: isCompleted ? 1.1 : 1,
          rotate: isCompleted ? 360 : 0
        }}
        transition={SPRING_ANIMATION}
        $isCompleted={isCompleted}
      >
        {task.emoji}
      </TaskEmoji>
    </SwitchContainer>
  );
});

TaskButton.displayName = 'TaskButton';

export default TaskButton; 