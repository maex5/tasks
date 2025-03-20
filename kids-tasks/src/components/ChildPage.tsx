import { styled } from '@mui/material/styles';
import { Box, Typography, Container } from '@mui/material';
import { ChildPageProps } from '../types';
import TaskButton from './TaskButton';
import EmojiProgress from './EmojiProgress';

const PageContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
}));

const TaskList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  marginTop: theme.spacing(4),
}));

const ChildPage = ({ child, tasks, onTaskToggle }: ChildPageProps) => {
  return (
    <PageContainer maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        {child.name}'s Tasks
      </Typography>
      
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