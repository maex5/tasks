import { styled } from '@mui/material/styles';
import { Box, Typography, Container } from '@mui/material';
import { ChildPageProps } from '../types';
import TaskButton from './TaskButton';
import EmojiProgress from './EmojiProgress';
import confetti from 'canvas-confetti';
import { useEffect, useRef } from 'react';

const PageContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(0.5),
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  height: '100%',
  maxHeight: '100%',
  overflow: 'hidden',
}));

const TaskList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  flex: 1,
  overflow: 'auto',
  padding: theme.spacing(1),
  justifyContent: 'center',
  alignContent: 'flex-start',
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.primary.main,
    borderRadius: '2px',
  },
}));

const ChildName = styled(Typography)(({ theme }) => ({
  fontSize: '1.75rem',
  fontWeight: 700,
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
  marginBottom: theme.spacing(0.5),
  lineHeight: 1.2,
}));

const ChildPage = ({ child, tasks, onTaskToggle }: ChildPageProps) => {
  const completedTasks = child.completedTasks || [];
  const prevCompletedCountRef = useRef(completedTasks.length);
  
  useEffect(() => {
    // Only trigger confetti if all tasks are completed and the count just changed
    if (completedTasks.length === tasks.length && completedTasks.length > prevCompletedCountRef.current) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FF4444', '#4CAF50', '#FFD700']
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#FF4444', '#4CAF50', '#FFD700']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
    prevCompletedCountRef.current = completedTasks.length;
  }, [completedTasks.length, tasks.length]);

  return (
    <PageContainer maxWidth="sm">
      <ChildName variant="h4">
        {child.name}
      </ChildName>
      
      <EmojiProgress
        completedTasks={completedTasks}
        totalTasks={tasks.length}
      />

      <TaskList>
        {tasks.map((task) => (
          <TaskButton
            key={task.id}
            task={task}
            isCompleted={completedTasks.includes(task.id)}
            onToggle={(taskId) => onTaskToggle(child.id, taskId)}
          />
        ))}
      </TaskList>
    </PageContainer>
  );
};

export default ChildPage; 