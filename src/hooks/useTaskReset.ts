import { useEffect } from 'react';
import { AppState } from '../types';
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
        
        const now = new Date();
        // Check if lastReset exists in the state
        const lastReset = currentState.lastReset;
        const lastResetDate = lastReset ? new Date(lastReset) : null;
        
        // Reset if:
        // 1. No last reset
        // 2. Last reset was on a different day
        // 3. Last reset was more than 24 hours ago
        if (!lastReset || 
            !lastResetDate || 
            lastResetDate.getDate() !== now.getDate() ||
            now.getTime() - lastResetDate.getTime() > 24 * 60 * 60 * 1000) {
          
          const resetState: AppState = {
            ...currentState,
            lastReset: now.toISOString(),
            children: Object.fromEntries(
              Object.entries(currentState.children).map(([id, child]) => [
                id,
                { ...child, completedTasks: [] }
              ])
            ) as Record<string, AppState['children'][string]>
          };
          
          await updateState(resetState);
        }
      } catch (error) {
        console.error('Error resetting tasks:', error);
      }
    };

    // Check every 5 minutes, not immediately on every device load
    // This prevents race conditions when multiple devices are opened at the same time
    const interval = setInterval(checkAndResetTasks, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [state, updateState]);
} 