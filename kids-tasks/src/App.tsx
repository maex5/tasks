import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { AppState, Child, Task } from './types';
import ChildPage from './components/ChildPage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const STORAGE_KEY = 'kids-tasks-state';

const defaultState: AppState = {
  tasks: {
    make_bed: { id: 'make_bed', name: 'Make Bed', emoji: '🛏️' },
    take_dog_out: { id: 'take_dog_out', name: 'Take Dog Out', emoji: '🐶' },
    brush_teeth: { id: 'brush_teeth', name: 'Brush Teeth', emoji: '🦷' },
    do_homework: { id: 'do_homework', name: 'Do Homework', emoji: '📚' },
  },
  children: {
    alex: { id: 'alex', name: 'Alex', completedTasks: [] },
    cecci: { id: 'cecci', name: 'Cecci', completedTasks: [] },
    vicka: { id: 'vicka', name: 'Vicka', completedTasks: [] },
  },
};

function App() {
  const [state, setState] = useState<AppState>(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : defaultState;
  });

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Reset tasks at midnight
  useEffect(() => {
    const checkAndResetTasks = () => {
      const now = new Date();
      const lastReset = localStorage.getItem('last-reset');
      
      if (!lastReset || new Date(lastReset).getDate() !== now.getDate()) {
        setState(prevState => ({
          ...prevState,
          children: Object.fromEntries(
            Object.entries(prevState.children).map(([id, child]) => [
              id,
              { ...child, completedTasks: [] }
            ])
          )
        }));
        localStorage.setItem('last-reset', now.toISOString());
      }
    };

    checkAndResetTasks();
    const interval = setInterval(checkAndResetTasks, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const handleTaskToggle = (childId: string, taskId: string) => {
    setState(prevState => {
      const child = prevState.children[childId];
      const completedTasks = child.completedTasks.includes(taskId)
        ? child.completedTasks.filter(id => id !== taskId)
        : [...child.completedTasks, taskId];

      return {
        ...prevState,
        children: {
          ...prevState.children,
          [childId]: {
            ...child,
            completedTasks,
          },
        },
      };
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        {Object.values(state.children).map((child: Child) => (
          <ChildPage
            key={child.id}
            child={child}
            tasks={Object.values(state.tasks)}
            onTaskToggle={handleTaskToggle}
          />
        ))}
      </Box>
    </ThemeProvider>
  );
}

export default App;
