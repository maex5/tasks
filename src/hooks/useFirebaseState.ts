import { useState, useEffect, useCallback, useRef } from 'react';
import { firebaseService } from '../services/firebase';
import { AppState, Child, ChildId } from '../types';
import { DEFAULT_STATE } from '../config/tasks';

interface UseFirebaseStateResult {
  state: AppState | null;
  isOnline: boolean;
  isLoading: boolean;
  error: Error | null;
  updateState: (newState: AppState) => Promise<void>;
  updateChild: (childId: ChildId, updates: Partial<Child>) => Promise<void>;
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