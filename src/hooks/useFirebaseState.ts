import { useState, useEffect, useCallback, useRef } from 'react';
import { firebaseService } from '../services/firebase';
import { AppState, Child, ChildId, TaskSetId } from '../types/state';
import { DEFAULT_STATE } from '../config/tasks';

interface UseFirebaseStateResult {
  state: AppState | null;
  isOnline: boolean;
  isLoading: boolean;
  error: Error | null;
  updateState: (newState: AppState) => Promise<void>;
  updateChild: (childId: ChildId, updates: Partial<Child>) => Promise<void>;
}

/**
 * Validates and filters completed tasks to ensure they only include valid task IDs
 * from the child's task set
 */
function validateCompletedTasks(
  completedTasks: string[],
  taskSetId: TaskSetId,
  taskSets: AppState['taskSets']
): string[] {
  const taskSet = taskSets[taskSetId];
  if (!taskSet) {
    console.warn(`Task set ${taskSetId} not found, resetting completed tasks`);
    return [];
  }

  const validTaskIds = new Set(Object.keys(taskSet.tasks));
  const validatedTasks = completedTasks.filter(taskId => {
    const isValid = validTaskIds.has(taskId);
    if (!isValid) {
      console.warn(`Removing invalid task ID ${taskId} from completed tasks`);
    }
    return isValid;
  });

  return validatedTasks;
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
            console.log('Firebase connection status:', connected ? 'online' : 'offline');
            setIsOnline(connected);
          }
        });

        // Get initial state
        const initialState = await firebaseService.getState();
        console.log('Initial Firebase state:', initialState);
        
        if (isMounted) {
          if (!initialState) {
            console.log('No state found, initializing with default state:', DEFAULT_STATE);
            await firebaseService.setState(DEFAULT_STATE);
            setState(DEFAULT_STATE);
          } else {
            setState(initialState);
          }

          // Subscribe to state changes
          unsubscribeState = firebaseService.subscribeToState((newState) => {
            if (isMounted && newState) {
              console.log('State update received:', newState);
              setState(newState);
            }
          });

          hasInitialized.current = true;
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
      console.log('Updating entire state:', newState);
      await firebaseService.setState(newState);
    } catch (err) {
      console.error('Failed to update state:', err);
      setError(err instanceof Error ? err : new Error('Failed to update state'));
      throw err;
    }
  }, []);

  // Update a specific child with type safety
  const updateChild = useCallback(async (
    childId: ChildId,
    updates: Partial<Child>
  ) => {
    if (!state) throw new Error('State not initialized');

    try {
      const child = state.children[childId];
      if (!child) throw new Error(`Child ${childId} not found`);

      console.log('Updating child:', {
        childId,
        currentState: child,
        updates,
      });

      // Ensure completedTasks is always an array
      const updatedChild = {
        ...child,
        ...updates,
        completedTasks: Array.isArray(updates.completedTasks) ? updates.completedTasks : child.completedTasks
      };

      const newState: AppState = {
        ...state,
        children: {
          ...state.children,
          [childId]: updatedChild
        }
      };

      console.log('New state after child update:', newState);
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
      alex_tasks: {
        id: 'alex_tasks',
        name: 'Alex\'s Tasks',
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
        taskSetId: 'alex_tasks',
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