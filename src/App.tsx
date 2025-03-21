import { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Container, IconButton, CircularProgress, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ChildPage from './components/ChildPage';
import { useFirebaseState } from './hooks/useFirebaseState';
import { useTaskReset } from './hooks/useTaskReset';
import { theme } from './theme';

const CURRENT_CHILD_KEY = 'current-child';

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
    if (!savedChildId || !state?.children) return 0;
    
    const index = Object.values(state.children).findIndex(child => child.id === savedChildId);
    return index >= 0 ? index : 0;
  });

  useTaskReset(state, updateState);

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

  const children = Object.values(state.children);
  const currentChild = children[currentChildIndex] || children[0];
  const taskSetId = currentChild.taskSetId || 'all_tasks';
  const currentTaskSet = state.taskSets[taskSetId];
  
  console.log('Current child and tasks:', {
    childName: currentChild.name,
    taskSetId: taskSetId,
    availableTasks: currentTaskSet?.tasks || {},
    taskSetName: currentTaskSet?.name || 'Unknown'
  });
  
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

  if (!currentTaskSet?.tasks) {
    console.error('Task set not found:', taskSetId);
    // Fallback to default task set
    const defaultTaskSet = state.taskSets['all_tasks'];
    if (!defaultTaskSet?.tasks) {
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
              No task sets available. Please check your configuration.
            </Alert>
          </Box>
        </ThemeProvider>
      );
    }
    // Use default task set as fallback
    return <ChildPage
      child={currentChild}
      tasks={Object.values(defaultTaskSet.tasks).sort((a, b) => a.order - b.order)}
      onTaskToggle={handleTaskToggle}
    />;
  }

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