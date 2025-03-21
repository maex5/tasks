import { Box, IconButton } from '@mui/material';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  completedTasks: string[];
  onTaskToggle: (taskId: string) => void;
}

export default function TaskList({ tasks, completedTasks, onTaskToggle }: TaskListProps) {
  return (
    <Box 
      role="list"
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
        gap: 2,
        p: 2,
        overflowY: 'auto',
      }}
    >
      {tasks.map((task) => (
        <IconButton
          key={task.id}
          onClick={() => onTaskToggle(task.id)}
          aria-label={task.name}
          aria-pressed={completedTasks.includes(task.id)}
          sx={{
            width: 80,
            height: 80,
            fontSize: '2rem',
            borderRadius: 2,
            backgroundColor: completedTasks.includes(task.id) ? 'primary.main' : 'background.paper',
            color: completedTasks.includes(task.id) ? 'primary.contrastText' : 'text.primary',
            boxShadow: 1,
            '&:hover': {
              backgroundColor: completedTasks.includes(task.id) ? 'primary.dark' : 'action.hover',
            },
          }}
        >
          {task.emoji}
        </IconButton>
      ))}
    </Box>
  );
} 