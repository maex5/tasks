import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, onDisconnect, get } from 'firebase/database';
import { AppState, TaskSet, isValidChildId, isValidTaskSetId, ChildId, TaskSetId } from '../types/state';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Log config in development (without sensitive values)
if (import.meta.env.DEV) {
  console.log('Firebase Config:', {
    ...firebaseConfig,
    apiKey: '[HIDDEN]'
  });
}

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const stateRef = ref(database, 'state');

class FirebaseService {
  private connectionRef = ref(database, '.info/connected');

  subscribeToConnection(callback: (connected: boolean) => void): () => void {
    const unsubscribe = onValue(this.connectionRef, (snapshot) => {
      callback(snapshot.val() === true);
    });
    return unsubscribe;
  }

  subscribeToState(callback: (state: AppState | null) => void): () => void {
    const unsubscribe = onValue(stateRef, (snapshot) => {
      const state = snapshot.val();
      if (state) {
        const validatedState = this.validateState(state);
        callback(validatedState);
      } else {
        callback(null);
      }
    });
    return unsubscribe;
  }

  async setState(state: AppState): Promise<void> {
    try {
      await set(stateRef, state);
    } catch (error) {
      console.error('Error setting state:', error);
      throw error;
    }
  }

  async getState(): Promise<AppState | null> {
    try {
      const snapshot = await get(stateRef);
      const state = snapshot.val();
      if (state) {
        return this.validateState(state);
      }
      return null;
    } catch (error) {
      console.error('Error getting state:', error);
      throw error;
    }
  }

  setupPresence() {
    onDisconnect(stateRef).cancel();
  }

  private validateState(state: any): AppState {
    // Validate children
    const validatedChildren = Object.entries(state.children || {}).reduce((acc, [id, child]: [string, any]) => {
      if (isValidChildId(id)) {
        const taskSetId = `${id}_tasks` as TaskSetId;
        acc[id] = {
          id: id as ChildId,
          name: child.name || id,
          taskSetId,
          completedTasks: Array.isArray(child.completedTasks) ? child.completedTasks : [],
          backgroundColor: child.backgroundColor || '#FFFFFF'
        };
      }
      return acc;
    }, {} as Record<ChildId, AppState['children'][ChildId]>);

    // Validate task sets
    const validatedTaskSets = Object.entries(state.taskSets || {}).reduce((acc, [id, taskSet]: [string, any]) => {
      if (isValidTaskSetId(id)) {
        acc[id] = {
          id: id as TaskSetId,
          name: taskSet.name || id,
          tasks: taskSet.tasks || {}
        };
      }
      return acc;
    }, {} as Record<TaskSetId, TaskSet>);

    return {
      children: validatedChildren,
      taskSets: validatedTaskSets,
      lastReset: state.lastReset || null
    };
  }
}

export const firebaseService = new FirebaseService(); 