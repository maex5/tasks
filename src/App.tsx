import { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Container, IconButton, CircularProgress, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ChildPage from './components/ChildPage';
import { useFirebaseState } from './hooks/useFirebaseState';
import { useTaskReset } from './hooks/useTaskReset';
import { theme } from './theme';
import { CHILD_TASK_SET_MAP } from './config/tasks';
import { ChildId, isValidChildId, Child, Task } from './types';

const CURRENT_CHILD_KEY = 'current-child';
const CHILD_IDS = ['alex', 'cecci', 'vicka'] as const;

function App() {
  const { 
    state, 
    isOnline, 
    isLoading, 
    error, 
    updateChild,
    updateState
  } = useFirebaseState();

  const [currentChildIndex, setCurrentChildIndex] = useState(() => {
    const savedChildId = localStorage.getItem(CURRENT_CHILD_KEY);
    if (!savedChildId || !isValidChildId(savedChildId)) return 0;
    
    const index = CHILD_IDS.indexOf(savedChildId as ChildId);
    return index >= 0 ? index : 0;
  });

  useTaskReset(state, updateState);

  useEffect(() => {
    const currentChildId = CHILD_IDS[currentChildIndex];
    if (currentChildId) {
      localStorage.setItem(CURRENT_CHILD_KEY, currentChildId);
    }
  }, [currentChildIndex]);

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
              Connecting to database...
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

  const children = Object.values(state.children) as Child[];
  const currentChild = children[currentChildIndex] || children[0];
  const taskSetId = CHILD_TASK_SET_MAP[currentChild.id];
  const currentTaskSet = state.taskSets[taskSetId];
  
  console.log('Current child and tasks:', {
    childName: currentChild.name,
    taskSetId: taskSetId,
    availableTasks: currentTaskSet?.tasks || {},
    taskSetName: currentTaskSet?.name || 'Unknown'
  });
  
  const handleTaskToggle = async (childId: ChildId, taskId: string) => {
    if (!state || !isOnline || !isValidChildId(childId)) return;

    const child = state.children[childId];
    if (!child) {
      console.error('Child not found:', childId);
      return;
    }

    const currentCompletedTasks = Array.isArray(child.completedTasks) ? child.completedTasks : [];
    const completedTasks = currentCompletedTasks.includes(taskId)
      ? currentCompletedTasks.filter((id: string) => id !== taskId)
      : [...currentCompletedTasks, taskId];

    try {
      await updateChild(childId, { completedTasks });
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  if (!currentTaskSet?.tasks) {
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
          <Alert severity="error" sx={{ maxWidth: 400 }}>
            No task set found for {currentChild.name}. Please check your configuration.
          </Alert>
        </Box>
      </ThemeProvider>
    );
  }

  const sortedTasks = Object.values(currentTaskSet.tasks)
    .sort((a: Task, b: Task) => a.order - b.order);

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
            <Box sx={{ flex: 1 }} />
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