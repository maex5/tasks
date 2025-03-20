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

    // Ensure all children have completedTasks array
    const validatedChildren = Object.fromEntries(
      Object.entries(state.children).map(([id, child]) => [
        id,
        {
          ...child,
          completedTasks: Array.isArray(child.completedTasks) ? child.completedTasks : []
        }
      ])
    );

    return {
      ...state,
      children: validatedChildren
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