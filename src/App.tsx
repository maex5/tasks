import { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Container, IconButton, CircularProgress, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { AppState } from './types';
import ChildPage from './components/ChildPage';
import { useFirebaseState } from './hooks/useFirebaseState';
import { useTaskReset } from './hooks/useTaskReset';
import { theme } from './theme';

const CURRENT_CHILD_KEY = 'current-child';

const defaultState: AppState = {
  taskSets: {
    all_tasks: {
      id: 'all_tasks',
      name: 'All Tasks',
      tasks: {
        make_bed: { id: 'make_bed', name: '🛏️', emoji: '🛏️', order: 1 },
        brush_teeth_morning: { id: 'brush_teeth_morning', name: '🪥☀️', emoji: '🪥☀️', order: 2 },
        do_homework: { id: 'do_homework', name: '📚✏️', emoji: '📚✏️', order: 3 },
        take_dog_out: { id: 'take_dog_out', name: '🐶', emoji: '🐶', order: 4 },
        brush_teeth_evening: { id: 'brush_teeth_evening', name: '🪥🌙', emoji: '🪥🌙', order: 5 },
      }
    },
    basic_tasks: {
      id: 'basic_tasks',
      name: 'Basic Tasks',
      tasks: {
        brush_teeth_morning: { id: 'brush_teeth_morning', name: '🪥☀️', emoji: '🪥☀️', order: 1 },
        do_homework: { id: 'do_homework', name: '📚✏️', emoji: '📚✏️', order: 2 },
      }
    }
  },
  children: {
    alex: { 
      id: 'alex', 
      name: 'Alex', 
      taskSetId: 'all_tasks',
      completedTasks: [], 
      backgroundColor: '#FFE5F5' 
    },
    cecci: { 
      id: 'cecci', 
      name: 'Cecci',
      taskSetId: 'basic_tasks', 
      completedTasks: [], 
      backgroundColor: '#E5FFF0' 
    },
    vicka: { 
      id: 'vicka', 
      name: 'Vicka',
      taskSetId: 'all_tasks', 
      completedTasks: [], 
      backgroundColor: '#E5E5FF' 
    },
  },
};

function App() {
  const { 
    state, 
    isOnline, 
    isLoading, 
    error, 
    updateChild 
  } = useFirebaseState();

  const [currentChildIndex, setCurrentChildIndex] = useState(() => {
    const savedChildId = localStorage.getItem(CURRENT_CHILD_KEY);
    if (!savedChildId || !state?.children) return 0;
    
    const index = Object.values(state.children).findIndex(child => child.id === savedChildId);
    return index >= 0 ? index : 0;
  });

  useTaskReset(state, async (newState) => {
    if (!state?.children) return;
    const firstChildId = Object.keys(state.children)[0];
    await updateChild(firstChildId, { completedTasks: [] });
  });

  useEffect(() => {
    if (!state?.children) return;
    const children = Object.values(state.children);
    const currentChild = children[currentChildIndex];
    if (currentChild) {
      localStorage.setItem(CURRENT_CHILD_KEY, currentChild.id);
    }
  }, [currentChildIndex, state]);

  if (isLoading || !state?.children || !state?.taskSets) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          bgcolor: 'background.default'
        }}>
          <CircularProgress />
          {!isOnline && (
            <Alert severity="warning" sx={{ maxWidth: 400 }}>
              Connecting to server...
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ maxWidth: 400 }}>
              {error.message}
            </Alert>
          )}
        </Box>
      </ThemeProvider>
    );
  }

  const children = Object.values(state.children);
  const currentChild = children[currentChildIndex] || children[0];
  const currentTaskSet = state.taskSets[currentChild.taskSetId];
  
  if (!currentTaskSet?.tasks) {
    console.error('Task set not found:', currentChild.taskSetId);
    return null;
  }

  const handleTaskToggle = async (childId: string, taskId: string) => {
    if (!state || !isOnline) return;

    const child = state.children[childId];
    if (!child) {
      console.error('Child not found:', childId);
      return;
    }

    const currentCompletedTasks = Array.isArray(child.completedTasks) ? child.completedTasks : [];
    const completedTasks = currentCompletedTasks.includes(taskId)
      ? currentCompletedTasks.filter(id => id !== taskId)
      : [...currentCompletedTasks, taskId];

    try {
      await updateChild(childId, { completedTasks });
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const sortedTasks = Object.values(currentTaskSet.tasks)
    .sort((a, b) => a.order - b.order);

  const handleNextChild = () => setCurrentChildIndex((prev) => (prev + 1) % children.length);
  const handlePrevChild = () => setCurrentChildIndex((prev) => (prev - 1 + children.length) % children.length);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        position: 'fixed',
        inset: 0,
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: currentChild.backgroundColor,
        overflow: 'hidden',
        transition: 'background-color 0.3s ease',
      }}>
        <Container maxWidth="sm" sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          py: 1,
          overflow: 'hidden',
          position: 'relative',
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 1,
            position: 'sticky',
            top: 0,
            zIndex: 1,
            bgcolor: 'transparent',
          }}>
            <IconButton 
              onClick={handlePrevChild} 
              size="large" 
              sx={{ color: 'primary.main' }}
              aria-label="Previous child"
            >
              <ArrowBackIcon />
            </IconButton>
            <Box sx={{ 
              flex: 1,
              textAlign: 'center',
              typography: 'h6',
              color: 'primary.main'
            }}>
              {currentTaskSet.name}
            </Box>
            <IconButton 
              onClick={handleNextChild} 
              size="large" 
              sx={{ color: 'primary.main' }}
              aria-label="Next child"
            >
              <ArrowForwardIcon />
            </IconButton>
          </Box>
          <ChildPage
            child={currentChild}
            tasks={sortedTasks}
            onTaskToggle={handleTaskToggle}
          />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App; 