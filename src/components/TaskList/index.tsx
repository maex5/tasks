import { Box, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Task } from '../../types';

interface TaskListProps {
  tasks: Task[];
  completedTasks: string[];
  onTaskToggle: (taskId: string) => void;
}

const TaskGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  overflowY: 'auto',
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

const TaskButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'isCompleted',
})<{ isCompleted: boolean }>(({ theme, isCompleted }) => ({
  width: 80,
  height: 80,
  fontSize: '2rem',
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: isCompleted ? theme.palette.primary.main : theme.palette.background.paper,
  color: isCompleted ? theme.palette.primary.contrastText : theme.palette.text.primary,
  boxShadow: theme.shadows[1],
  transition: theme.transitions.create(['background-color', 'transform', 'box-shadow'], {
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    backgroundColor: isCompleted ? theme.palette.primary.dark : theme.palette.action.hover,
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[3],
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
}));

const TaskList = ({ tasks, completedTasks, onTaskToggle }: TaskListProps) => {
  return (
    <TaskGrid role="list">
      {tasks.map((task) => (
        <TaskButton
          key={task.id}
          onClick={() => onTaskToggle(task.id)}
          aria-label={task.name}
          aria-pressed={completedTasks.includes(task.id)}
          isCompleted={completedTasks.includes(task.id)}
        >
          {task.emoji}
        </TaskButton>
      ))}
    </TaskGrid>
  );
};

TaskList.displayName = 'TaskList';

export default TaskList; 