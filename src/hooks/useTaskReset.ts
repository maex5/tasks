import { useEffect } from 'react';
import { AppState, Child, ChildId, isValidChildId } from '../types';
import { firebaseService } from '../services/firebase';

// Update this key to be part of the firebase state
export function useTaskReset(
  state: AppState | null,
  updateState: (newState: AppState) => Promise<void>
) {
  useEffect(() => {
    if (!state?.children) return;

    const checkAndResetTasks = async () => {
      try {
        // Get the freshest state directly from Firebase
        const currentState = await firebaseService.getState();
        if (!currentState) return;
        
        // Use Finnish timezone (UTC+2/+3)
        const now = new Date();
        const finnishTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Helsinki' }));
        const lastResetDate = currentState.lastReset ? 
          new Date(new Date(currentState.lastReset).toLocaleString('en-US', { timeZone: 'Europe/Helsinki' })) : 
          null;
        
        // Reset if:
        // 1. No last reset
        // 2. Last reset was on a different day in Finnish time
        // 3. Last reset was more than 24 hours ago
        if (!currentState.lastReset || 
            !lastResetDate || 
            lastResetDate.getDate() !== finnishTime.getDate() ||
            finnishTime.getTime() - lastResetDate.getTime() > 24 * 60 * 60 * 1000) {
          
          // Create a new children object with reset tasks
          const resetChildren = Object.entries(currentState.children).reduce((acc, [id, child]) => {
            if (isValidChildId(id)) {
              // Ensure child has the correct type
              const typedChild: Child = {
                ...child,
                id: id as ChildId,
                taskSetId: child.taskSetId as `${ChildId}_tasks`,
                completedTasks: []
              };
              acc[id] = typedChild;
            }
            return acc;
          }, {} as Record<ChildId, Child>);

          const resetState: AppState = {
            ...currentState,
            lastReset: now.toISOString(),
            children: resetChildren
          };
          
          await updateState(resetState);
        }
      } catch (error) {
        console.error('Error resetting tasks:', error);
      }
    };

    // Check every 5 minutes
    const interval = setInterval(checkAndResetTasks, 5 * 60 * 1000);
    
    // Also check immediately when component mounts
    checkAndResetTasks();
    
    return () => clearInterval(interval);
  }, [state, updateState]);
} 