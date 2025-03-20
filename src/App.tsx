import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Container, IconButton } from '@mui/material';
import { AppState } from './types';
import ChildPage from './components/ChildPage';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { database } from './firebase';
import { ref, onValue, set, get } from 'firebase/database';

console.log('App component is being rendered');

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
    fontFamily: '"Comic Sans MS", cursive, sans-serif',
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

const STORAGE_KEY = 'kids-tasks-state';

// Temporary function to clear state - remove after use
const clearState = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('last-reset');
  window.location.reload();
};

const defaultState: AppState = {
  tasks: {
    make_bed: { id: 'make_bed', name: '🛏️', emoji: '🛏️' },
    brush_teeth_morning: { id: 'brush_teeth_morning', name: '🪥☀️', emoji: '🪥☀️' },
    do_homework: { id: 'do_homework', name: '📚✏️', emoji: '📚✏️' },
    take_dog_out: { id: 'take_dog_out', name: '🐶', emoji: '🐶' },
    brush_teeth_evening: { id: 'brush_teeth_evening', name: '🪥🌙', emoji: '🪥🌙' },
  },
  children: {
    alex: { id: 'alex', name: 'Alex', completedTasks: [], backgroundColor: '#FFE5E5' },
    cecci: { id: 'cecci', name: 'Cecci', completedTasks: [], backgroundColor: '#E5FFE5' },
    vicka: { id: 'vicka', name: 'Vicka', completedTasks: [], backgroundColor: '#E5E5FF' },
  },
};

function App() {
  console.log('App function is being called');
  const [state, setState] = useState<AppState>(defaultState);
  const [currentChildIndex, setCurrentChildIndex] = useState(0);
  const children = Object.values(state.children);

  // Initialize Firebase connection
  useEffect(() => {
    console.log('Setting up Firebase connection');
    const stateRef = ref(database, 'state');
    
    // Listen for changes
    const unsubscribe = onValue(stateRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setState(data);
      }
    });

    // Initial load
    get(stateRef).then((snapshot) => {
      const data = snapshot.val();
      if (data) {
        setState(data);
      } else {
        // Set initial state if no data exists
        set(stateRef, defaultState);
      }
    });

    return () => unsubscribe();
  }, []);

  // Reset tasks at midnight
  useEffect(() => {
    console.log('Setting up midnight reset');
    const checkAndResetTasks = () => {
      const now = new Date();
      const lastReset = localStorage.getItem('last-reset');
      
      if (!lastReset || new Date(lastReset).getDate() !== now.getDate()) {
        const stateRef = ref(database, 'state');
        set(stateRef, {
          ...state,
          children: Object.fromEntries(
            Object.entries(state.children).map(([id, child]) => [
              id,
              { ...child, completedTasks: [] }
            ])
          )
        });
        localStorage.setItem('last-reset', now.toISOString());
      }
    };

    checkAndResetTasks();
    const interval = setInterval(checkAndResetTasks, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [state]);

  const handleTaskToggle = (childId: string, taskId: string) => {
    console.log('Toggling task:', { childId, taskId });
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
  const sortedTasks = Object.values(state.tasks).sort((a, b) => {
    const order = {
      'make_bed': 1,
      'brush_teeth_morning': 2,
      'do_homework': 3,
      'take_dog_out': 4,
      'brush_teeth_evening': 5,
    };
    return order[a.id as keyof typeof order] - order[b.id as keyof typeof order];
  });

  const handleNextChild = () => {
    setCurrentChildIndex((prev) => (prev + 1) % children.length);
  };

  const handlePrevChild = () => {
    setCurrentChildIndex((prev) => (prev - 1 + children.length) % children.length);
  };

  console.log('Rendering App with state:', state);

  const currentChild = children[currentChildIndex];

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
            <Box sx={{ flex: 1 }} />
            {/* Temporary reset button - remove after use */}
            <IconButton 
              onClick={clearState} 
              size="large" 
              sx={{ 
                color: 'error.main',
                mr: 1,
                '&:hover': { backgroundColor: 'error.light' }
              }}
            >
              🔄
            </IconButton>
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