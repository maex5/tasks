import { initializeApp } from 'firebase/app';
import { 
  getDatabase, 
  ref, 
  onValue, 
  set, 
  get, 
  off,
  DatabaseReference,
  DataSnapshot,
  Database
} from 'firebase/database';
import { AppState } from '../types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: "tasks-34654.appspot.com",
  messagingSenderId: "222183554116",
  appId: "1:222183554116:web:42ae8e8f1d224ce8475011"
};

class FirebaseService {
  private static instance: FirebaseService;
  private database: Database;
  private app;

  private constructor() {
    // Initialize Firebase
    this.app = initializeApp(firebaseConfig);
    this.database = getDatabase(this.app);
    
    // Debug logging in development
    if (import.meta.env.DEV) {
      console.log('Firebase Config:', {
        ...firebaseConfig,
        apiKey: '[HIDDEN]',
        databaseURL: firebaseConfig.databaseURL
      });
    }
  }

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  public getStateRef(): DatabaseReference {
    return ref(this.database, 'state');
  }

  public getConnectionRef(): DatabaseReference {
    return ref(this.database, '.info/connected');
  }

  private validateState(state: AppState | null): AppState | null {
    if (!state) return null;

    console.log('Validating state:', {
      originalChildren: state.children,
      originalTaskSets: state.taskSets
    });

    // Ensure all children have completedTasks array and taskSetId
    const validatedChildren = Object.fromEntries(
      Object.entries(state.children).map(([id, child]) => [
        id,
        {
          ...child,
          taskSetId: child.taskSetId || 'all_tasks', // Default to all_tasks if not set
          completedTasks: Array.isArray(child.completedTasks) ? child.completedTasks : []
        }
      ])
    );

    // Ensure taskSets exist with at least the default sets
    const defaultTaskSets = {
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
    };

    // We were merging incorrectly! The spread order was wrong
    // Now we prioritize existing task sets over defaults
    const taskSets = {
      ...state.taskSets, // Existing task sets take precedence
      ...defaultTaskSets  // Only add defaults if they don't exist
    };

    console.log('After validation:', {
      children: validatedChildren,
      taskSets: taskSets,
      childrenTaskSets: Object.entries(validatedChildren).map(([id, child]) => ({
        childId: id,
        taskSetId: child.taskSetId,
        availableTasks: child.taskSetId in taskSets ? taskSets[child.taskSetId as keyof typeof taskSets].tasks : {}
      }))
    });

    return {
      ...state,
      lastReset: state.lastReset || null,
      children: validatedChildren,
      taskSets
    };
  }

  public async getState(): Promise<AppState | null> {
    try {
      const snapshot = await get(this.getStateRef());
      const state = snapshot.exists() ? snapshot.val() : null;
      return this.validateState(state);
    } catch (error) {
      console.error('Error getting state:', error);
      throw error;
    }
  }

  public async setState(state: AppState): Promise<void> {
    try {
      const validatedState = this.validateState(state);
      if (!validatedState) throw new Error('Invalid state');
      await set(this.getStateRef(), validatedState);
    } catch (error) {
      console.error('Error setting state:', error);
      throw error;
    }
  }

  public subscribeToState(callback: (state: AppState | null) => void): () => void {
    const stateRef = this.getStateRef();
    
    const handleStateChange = (snapshot: DataSnapshot) => {
      const state = snapshot.val();
      callback(this.validateState(state));
    };

    onValue(stateRef, handleStateChange);
    
    // Return unsubscribe function
    return () => off(stateRef);
  }

  public subscribeToConnection(callback: (isConnected: boolean) => void): () => void {
    const connectedRef = this.getConnectionRef();
    
    const handleConnectionChange = (snapshot: DataSnapshot) => {
      callback(!!snapshot.val());
    };

    onValue(connectedRef, handleConnectionChange);
    
    // Return unsubscribe function
    return () => off(connectedRef);
  }
}

// Export singleton instance
export const firebaseService = FirebaseService.getInstance(); 