import { useState, useEffect, useCallback, useRef } from 'react';
import { firebaseService } from '../services/firebase';
import { AppState } from '../types';

interface UseFirebaseStateResult {
  state: AppState | null;
  isOnline: boolean;
  isLoading: boolean;
  error: Error | null;
  updateState: (newState: AppState) => Promise<void>;
  updateChild: (childId: string, updates: Partial<AppState['children'][string]>) => Promise<void>;
}

export function useFirebaseState(): UseFirebaseStateResult {
  const [state, setState] = useState<AppState | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const hasInitialized = useRef(false);

  // Initialize state
  useEffect(() => {
    let isMounted = true;
    let unsubscribeState: (() => void) | null = null;
    let unsubscribeConnection: (() => void) | null = null;

    const initialize = async () => {
      try {
        // Subscribe to connection status
        unsubscribeConnection = firebaseService.subscribeToConnection((connected) => {
          if (isMounted) {
            setIsOnline(connected);
          }
        });

        // Get initial state
        const initialState = await firebaseService.getState();
        
        if (isMounted) {
          if (!initialState) {
            // Initialize with default state if none exists
            const defaultState = getDefaultState();
            await firebaseService.setState(defaultState);
            setState(defaultState);
          } else {
            setState(initialState);
          }
          
          // Subscribe to state changes
          unsubscribeState = firebaseService.subscribeToState((newState) => {
            if (isMounted && newState) {
              setState(newState);
            }
          });

          hasInitialized.current = true;
          // Only set loading to false after we have both state and connection status
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Firebase initialization error:', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to initialize Firebase state'));
          setIsLoading(false);
        }
      }
    };

    initialize();

    return () => {
      isMounted = false;
      if (unsubscribeState) unsubscribeState();
      if (unsubscribeConnection) unsubscribeConnection();
    };
  }, []);

  // Update entire state
  const updateState = useCallback(async (newState: AppState) => {
    try {
      await firebaseService.setState(newState);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update state'));
      throw err;
    }
  }, []);

  // Update a specific child
  const updateChild = useCallback(async (
    childId: string, 
    updates: Partial<AppState['children'][string]>
  ) => {
    if (!state) throw new Error('State not initialized');

    try {
      const child = state.children[childId];
      if (!child) throw new Error(`Child ${childId} not found`);

      // Ensure completedTasks is always an array
      const updatedChild = {
        ...child,
        ...updates,
        completedTasks: Array.isArray(updates.completedTasks) ? updates.completedTasks : child.completedTasks || []
      };

      const newState = {
        ...state,
        children: {
          ...state.children,
          [childId]: updatedChild
        }
      };

      await firebaseService.setState(newState);
    } catch (err) {
      console.error('Error updating child:', err);
      setError(err instanceof Error ? err : new Error('Failed to update child'));
      throw err;
    }
  }, [state]);

  return {
    state,
    isOnline,
    isLoading,
    error,
    updateState,
    updateChild
  };
}

// Default state helper
function getDefaultState(): AppState {
  return {
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
      vicka_tasks: {
        id: 'vicka_tasks',
        name: 'Vicka\'s Tasks',
        tasks: {
          clean_room: { id: 'clean_room', name: '🧹', emoji: '🧹', order: 1 },
          practice_piano: { id: 'practice_piano', name: '🎹', emoji: '🎹', order: 2 },
          read_book: { id: 'read_book', name: '📖', emoji: '📖', order: 3 },
          water_plants: { id: 'water_plants', name: '🪴', emoji: '🪴', order: 4 },
          feed_fish: { id: 'feed_fish', name: '🐠', emoji: '🐠', order: 5 }
        }
      },
      cecci_tasks: {
        id: 'cecci_tasks',
        name: 'Cecci\'s Tasks',
        tasks: {
          draw_picture: { id: 'draw_picture', name: '🎨', emoji: '🎨', order: 1 },
          dance_practice: { id: 'dance_practice', name: '💃', emoji: '💃', order: 2 },
          help_cooking: { id: 'help_cooking', name: '👩‍🍳', emoji: '👩‍🍳', order: 3 },
          tidy_toys: { id: 'tidy_toys', name: '🧸', emoji: '🧸', order: 4 },
          feed_cat: { id: 'feed_cat', name: '🐱', emoji: '🐱', order: 5 }
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
        taskSetId: 'cecci_tasks',
        completedTasks: [],
        backgroundColor: '#E5FFF0'
      },
      vicka: {
        id: 'vicka',
        name: 'Vicka',
        taskSetId: 'vicka_tasks',
        completedTasks: [],
        backgroundColor: '#E5E5FF'
      }
    },
    lastReset: null
  };
} 