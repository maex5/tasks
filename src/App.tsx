import { useState, useEffect, useRef } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Container, IconButton, CircularProgress, Alert } from '@mui/material';
import { AppState } from './types';
import ChildPage from './components/ChildPage';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { database } from './firebase';
import { ref, onValue, set, get, runTransaction, onDisconnect, serverTimestamp, connectDatabaseEmulator } from 'firebase/database';

interface AppStateWithMetadata extends AppState {
  _metadata?: {
    lastUpdate: number | null;
    version: number;
  };
}

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
  const [isOnline, setIsOnline] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const initAttempted = useRef(false);
  const [currentChildIndex, setCurrentChildIndex] = useState(() => {
    const savedChildId = localStorage.getItem(CURRENT_CHILD_KEY);
    if (savedChildId) {
      const index = Object.values(defaultState.children).findIndex(child => child.id === savedChildId);
      return index >= 0 ? index : 0;
    }
    return 0;
  });

  // Initialize Firebase connection and handle offline/online status
  useEffect(() => {
    const stateRef = ref(database, 'state');
    const connectedRef = ref(database, '.info/connected');
    let isMounted = true;

    // Handle connection state
    const unsubscribeConnection = onValue(connectedRef, (snap) => {
      if (isMounted) {
        setIsOnline(!!snap.val());
      }
    });

    // Set up offline cleanup
    onDisconnect(stateRef).cancel();

    const initializeState = async () => {
      if (initAttempted.current) return;
      initAttempted.current = true;

      try {
        // Use transaction to ensure atomic read/write
        await runTransaction(stateRef, (currentData: AppStateWithMetadata | null) => {
          if (!currentData) {
            return {
              ...defaultState,
              _metadata: {
                lastUpdate: serverTimestamp(),
                version: 1
              }
            };
          }
          return currentData;
        });

        // Get the result after transaction
        const snapshot = await get(stateRef);
        if (snapshot.exists() && isMounted) {
          const data = snapshot.val();
          setState(data);
          setRetryCount(0); // Reset retry count on success
        }
      } catch (error) {
        console.error('Error in transaction:', error);
        if (isMounted && retryCount < 3) {
          // Exponential backoff retry
          const timeout = Math.pow(2, retryCount) * 1000;
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            initAttempted.current = false; // Allow retry
          }, timeout);
        }
      }
    };

    // Initialize state
    initializeState();

    // Set up listener for future changes with version check
    const unsubscribeState = onValue(stateRef, (snapshot) => {
      if (!isMounted) return;
      
      const data = snapshot.val();
      if (data?._metadata?.version === 1) {
        setState(data);
      }
    });

    return () => {
      isMounted = false;
      unsubscribeConnection();
      unsubscribeState();
    };
  }, [retryCount]);

  // Save current child to localStorage when it changes
  useEffect(() => {
    if (!state?.children) return;
    const children = Object.values(state.children);
    const currentChild = children[currentChildIndex];
    if (currentChild) {
      localStorage.setItem(CURRENT_CHILD_KEY, currentChild.id);
    }
  }, [currentChildIndex, state]);

  // Reset tasks at midnight using transaction
  useEffect(() => {
    if (!state?.children) return;

    const checkAndResetTasks = async () => {
      const now = new Date();
      const lastReset = localStorage.getItem('last-reset');
      
      if (!lastReset || new Date(lastReset).getDate() !== now.getDate()) {
        const stateRef = ref(database, 'state');
        try {
          await runTransaction(stateRef, (currentData: AppStateWithMetadata | null) => {
            if (!currentData) return currentData;

            return {
              ...currentData,
              children: Object.fromEntries(
                Object.entries(currentData.children).map(([id, child]: [string, any]) => [
                  id,
                  { ...child, completedTasks: [] }
                ])
              ),
              _metadata: {
                lastUpdate: serverTimestamp(),
                version: 1
              }
            };
          });
          localStorage.setItem('last-reset', now.toISOString());
        } catch (error) {
          console.error('Error resetting tasks:', error);
        }
      }
    };

    checkAndResetTasks();
    const interval = setInterval(checkAndResetTasks, 60000);
    return () => clearInterval(interval);
  }, [state]);

  // Show loading or error states
  if (!state?.children || !state?.taskSets) {
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
          bgcolor: '#F7F7F7'
        }}>
          <CircularProgress />
          {!isOnline && (
            <Alert severity="warning" sx={{ maxWidth: 400 }}>
              You're offline. Changes will sync when you're back online.
            </Alert>
          )}
          {retryCount > 0 && (
            <Alert severity="info" sx={{ maxWidth: 400 }}>
              Connecting... Attempt {retryCount}/3
            </Alert>
          )}
        </Box>
      </ThemeProvider>
    );
  }

  const children = Object.values(state.children);
  const currentChild = children[currentChildIndex] || children[0];
  const currentTaskSet = state.taskSets[currentChild.taskSetId];
  
  // Safety check for currentTaskSet
  if (!currentTaskSet?.tasks) {
    console.error('Task set not found:', currentChild.taskSetId);
    return null;
  }

  const handleTaskToggle = async (childId: string, taskId: string) => {
    if (!state) return;
    
    const stateRef = ref(database, 'state');
    try {
      await runTransaction(stateRef, (currentData: AppStateWithMetadata | null) => {
        if (!currentData) return currentData;

        const child = currentData.children[childId];
        if (!child) return currentData;

        const completedTasks = (child.completedTasks || []).includes(taskId)
          ? (child.completedTasks || []).filter(id => id !== taskId)
          : [...(child.completedTasks || []), taskId];

        return {
          ...currentData,
          children: {
            ...currentData.children,
            [childId]: {
              ...child,
              completedTasks,
            },
          },
          _metadata: {
            lastUpdate: serverTimestamp(),
            version: 1
          }
        };
      });
    } catch (error) {
      console.error('Error toggling task:', error);
    }
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