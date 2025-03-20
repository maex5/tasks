import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Container, IconButton } from '@mui/material';
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
  const [state, setState] = useState<AppState>(defaultState);
  const [currentChildIndex, setCurrentChildIndex] = useState(() => {
    const savedChildId = localStorage.getItem(CURRENT_CHILD_KEY);
    if (savedChildId) {
      const index = Object.values(defaultState.children).findIndex(child => child.id === savedChildId);
      return index >= 0 ? index : 0;
    }
    return 0;
  });
  const children = Object.values(state.children);

  // Save current child to localStorage when it changes
  useEffect(() => {
    const currentChild = children[currentChildIndex];
    if (currentChild) {
      localStorage.setItem(CURRENT_CHILD_KEY, currentChild.id);
    }
  }, [currentChildIndex, children]);

  // Initialize Firebase connection
  useEffect(() => {
    const stateRef = ref(database, 'state');
    let isInitialDataLoaded = false;
    
    // Listen for changes
    const unsubscribe = onValue(stateRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setState(data);
        isInitialDataLoaded = true;
      } else if (!isInitialDataLoaded) {
        // Only set default state if there's no data and we haven't loaded data before
        set(stateRef, defaultState);
        isInitialDataLoaded = true;
      }
    });

    return () => unsubscribe();
  }, []);

  // Reset tasks at midnight
  useEffect(() => {
    const checkAndResetTasks = () => {
      const now = new Date();
      const lastReset = localStorage.getItem('last-reset');
      
      if (!lastReset || new Date(lastReset).getDate() !== now.getDate()) {
        const stateRef = ref(database, 'state');
        get(stateRef).then((snapshot) => {
          const currentState = (snapshot.val() || state) as AppState;
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