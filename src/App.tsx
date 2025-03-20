import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Container, IconButton, CircularProgress } from '@mui/material';
import { AppState } from './types';
import ChildPage from './components/ChildPage';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { database } from './firebase';
import { ref, onValue, set, get } from 'firebase/database';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF4444', // Bright red
    },
    secondary: {
      main: '#4CAF50', // Bright green
    },
    background: {
      default: '#F7F7F7',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Nunito", sans-serif',
    h4: {
      fontWeight: 700,
      color: '#FF4444',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: 'none',
        },
      },
    },
  },
});

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
  const [state, setState] = useState<AppState | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentChildIndex, setCurrentChildIndex] = useState(() => {
    const savedChildId = localStorage.getItem(CURRENT_CHILD_KEY);
    if (savedChildId) {
      const index = Object.values(defaultState.children).findIndex(child => child.id === savedChildId);
      return index >= 0 ? index : 0;
    }
    return 0;
  });

  // Initialize Firebase connection
  useEffect(() => {
    const stateRef = ref(database, 'state');
    let isMounted = true;

    // First, try to get existing data
    get(stateRef).then((snapshot) => {
      if (!isMounted) return;

      if (snapshot.exists()) {
        const data = snapshot.val();
        setState(data);
      } else {
        // Only set default state if there's no data
        set(stateRef, defaultState).then(() => {
          if (isMounted) {
            setState(defaultState);
          }
        });
      }
      setIsInitialized(true);
    });
    
    // Then set up the listener for future updates
    const unsubscribe = onValue(stateRef, (snapshot) => {
      if (!isMounted || !isInitialized) return;
      
      const data = snapshot.val();
      if (data) {
        setState(data);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [isInitialized]);

  // Save current child to localStorage when it changes
  useEffect(() => {
    if (!state) return;
    const children = Object.values(state.children);
    const currentChild = children[currentChildIndex];
    if (currentChild) {
      localStorage.setItem(CURRENT_CHILD_KEY, currentChild.id);
    }
  }, [currentChildIndex, state]);

  // Reset tasks at midnight
  useEffect(() => {
    if (!state) return;

    const checkAndResetTasks = () => {
      const now = new Date();
      const lastReset = localStorage.getItem('last-reset');
      
      if (!lastReset || new Date(lastReset).getDate() !== now.getDate()) {
        const stateRef = ref(database, 'state');
        get(stateRef).then((snapshot) => {
          const currentState = snapshot.val() as AppState;
          if (!currentState) return;
          
          set(stateRef, {
            ...currentState,
            children: Object.fromEntries(
              Object.entries(currentState.children).map(([id, child]) => [
                id,
                { ...child, completedTasks: [] }
              ])
            )
          });
          localStorage.setItem('last-reset', now.toISOString());
        });
      }
    };

    checkAndResetTasks();
    const interval = setInterval(checkAndResetTasks, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [state]);

  // Don't render the app until we have the initial state
  if (!state || !isInitialized) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          bgcolor: '#F7F7F7'
        }}>
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  const children = Object.values(state.children);
  const currentChild = children[currentChildIndex];
  const currentTaskSet = state.taskSets[currentChild.taskSetId];

  const handleTaskToggle = (childId: string, taskId: string) => {
    const stateRef = ref(database, 'state');
    const child = state.children[childId];
    const completedTasks = (child.completedTasks || []).includes(taskId)
      ? (child.completedTasks || []).filter(id => id !== taskId)
      : [...(child.completedTasks || []), taskId];

    set(stateRef, {
      ...state,
      children: {
        ...state.children,
        [childId]: {
          ...child,
          completedTasks,
        },
      },
    });
  };

  // Sort tasks in chronological order
  const sortedTasks = Object.values(currentTaskSet.tasks).sort((a, b) => a.order - b.order);

  const handleNextChild = () => {
    setCurrentChildIndex((prev) => (prev + 1) % children.length);
  };

  const handlePrevChild = () => {
    setCurrentChildIndex((prev) => (prev - 1 + children.length) % children.length);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
            <IconButton onClick={handlePrevChild} size="large" sx={{ color: 'primary.main' }}>
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
            <IconButton onClick={handleNextChild} size="large" sx={{ color: 'primary.main' }}>
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