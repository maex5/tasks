import { useEffect } from 'react';
import { AppState } from '../types';

const LAST_RESET_KEY = 'last-reset';

export function useTaskReset(
  state: AppState | null,
  updateState: (newState: AppState) => Promise<void>
) {
  useEffect(() => {
    if (!state?.children) return;

    const checkAndResetTasks = async () => {
      const now = new Date();
      const lastReset = localStorage.getItem(LAST_RESET_KEY);
      const lastResetDate = lastReset ? new Date(lastReset) : null;
      
      // Reset if:
      // 1. No last reset
      // 2. Last reset was on a different day
      // 3. Last reset was more than 24 hours ago
      if (!lastReset || 
          !lastResetDate || 
          lastResetDate.getDate() !== now.getDate() ||
          now.getTime() - lastResetDate.getTime() > 24 * 60 * 60 * 1000) {
        try {
          const resetState: AppState = {
            ...state,
            children: Object.fromEntries(
              Object.entries(state.children).map(([id, child]) => [
                id,
                { ...child, completedTasks: [] }
              ])
            ) as Record<string, AppState['children'][string]>
          };
          
          await updateState(resetState);
          localStorage.setItem(LAST_RESET_KEY, now.toISOString());
        } catch (error) {
          console.error('Error resetting tasks:', error);
        }
      }
    };

    // Check immediately
    checkAndResetTasks();

    // Then check every minute
    const interval = setInterval(checkAndResetTasks, 60000);
    
    return () => clearInterval(interval);
  }, [state, updateState]);
} 