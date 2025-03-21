import { Typography, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import confetti from 'canvas-confetti';
import { useEffect, useRef, useCallback, memo } from 'react';
import { Child, Task, ChildId } from '../types';
import TaskList from './TaskList';
import EmojiProgress from './EmojiProgress';

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

interface ChildPageProps {
  child: Child;
  tasks: Task[];
  onTaskToggle: (childId: ChildId, taskId: string) => void;
}

/**
 * ChildPage component displays a child's tasks and progress.
 * It shows the child's name, an emoji progress indicator, and a list of task buttons.
 * When all tasks are completed, it triggers a confetti animation.
 */
const ChildPage = memo(({ child, tasks, onTaskToggle }: ChildPageProps) => {
  const completedTasks = Array.isArray(child.completedTasks) ? child.completedTasks : [];
  const totalTasks = tasks.length;
  const completedCount = completedTasks.length;
  const progress = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  const prevCompletedCountRef = useRef(completedCount);

  const triggerConfetti = useCallback(() => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 1500
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, []);

  useEffect(() => {
    if (completedCount === totalTasks && completedCount > prevCompletedCountRef.current) {
      console.log('All tasks completed! 🎉', {
        childName: child.name,
        completedTasks
      });
      triggerConfetti();
    }
    prevCompletedCountRef.current = completedCount;
  }, [completedCount, totalTasks, triggerConfetti, child.name, completedTasks]);

  const handleTaskToggle = useCallback((taskId: string) => {
    console.log('Task toggled:', {
      childName: child.name,
      taskId,
      wasCompleted: completedTasks.includes(taskId),
      completedCount: completedCount,
      totalTasks: totalTasks
    });
    onTaskToggle(child.id, taskId);
  }, [child.id, child.name, completedTasks, totalTasks, onTaskToggle]);

  return (
    <PageContainer maxWidth="sm">
      <ChildName variant="h4">
        {child.name}
      </ChildName>
      
      <EmojiProgress progress={progress} />

      <TaskList
        tasks={tasks}
        completedTasks={completedTasks}
        onTaskToggle={handleTaskToggle}
      />
    </PageContainer>
  );
});

ChildPage.displayName = 'ChildPage';

export default ChildPage; 