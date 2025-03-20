import { styled } from '@mui/material/styles';
import { Box, Typography, Container } from '@mui/material';
import { ChildPageProps } from '../types';
import TaskButton from './TaskButton';
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

const TaskList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  flex: 1,
  overflow: 'auto',
  padding: theme.spacing(0.5),
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
  return (
    <PageContainer maxWidth="sm">
      <ChildName variant="h4">
        {child.name}
      </ChildName>
      
      <EmojiProgress
        completedTasks={child.completedTasks}
        totalTasks={tasks.length}
      />

      <TaskList>
        {tasks.map((task) => (
          <TaskButton
            key={task.id}
            task={task}
            isCompleted={child.completedTasks.includes(task.id)}
            onToggle={(taskId) => onTaskToggle(child.id, taskId)}
          />
        ))}
      </TaskList>
    </PageContainer>
  );
};

export default ChildPage; 