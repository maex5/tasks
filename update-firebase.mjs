import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const DEFAULT_STATE = {
  taskSets: {
    alex_tasks: {
      id: 'alex_tasks',
      name: 'Alex\'s Tasks',
      tasks: {
        make_bed: { id: 'make_bed', name: '🛏️', emoji: '🛏️', order: 1 },
        brush_teeth_morning: { id: 'brush_teeth_morning', name: '🪥☀️', emoji: '🪥☀️', order: 2 },
        do_homework: { id: 'do_homework', name: '📚✏️', emoji: '📚✏️', order: 3 },
        take_dog_out: { id: 'take_dog_out', name: '🐶', emoji: '🐶', order: 4 },
        read_book: { id: 'read_book', name: '📖', emoji: '📖', order: 5 },
        clean_room: { id: 'clean_room', name: '🧹', emoji: '🧹', order: 6 },
        brush_teeth_evening: { id: 'brush_teeth_evening', name: '🪥🌙', emoji: '🪥🌙', order: 7 },
      }
    },
    vicka_tasks: {
      id: 'vicka_tasks',
      name: 'Vicka\'s Tasks',
      tasks: {
        make_bed: { id: 'make_bed', name: '🛏️', emoji: '🛏️', order: 1 },
        brush_teeth_morning: { id: 'brush_teeth_morning', name: '🪥☀️', emoji: '🪥☀️', order: 2 },
        do_homework: { id: 'do_homework', name: '📚✏️', emoji: '📚✏️', order: 3 },
        take_dog_out: { id: 'take_dog_out', name: '🐶', emoji: '🐶', order: 4 },
        read_book: { id: 'read_book', name: '📖', emoji: '📖', order: 5 },
        clean_room: { id: 'clean_room', name: '🧹', emoji: '🧹', order: 6 },
        brush_teeth_evening: { id: 'brush_teeth_evening', name: '🪥🌙', emoji: '🪥🌙', order: 7 },
      }
    },
    cecci_tasks: {
      id: 'cecci_tasks',
      name: 'Cecci\'s Tasks',
      tasks: {
        make_bed: { id: 'make_bed', name: '🛏️', emoji: '🛏️', order: 1 },
        brush_teeth_morning: { id: 'brush_teeth_morning', name: '🪥☀️', emoji: '🪥☀️', order: 2 },
        clean_room: { id: 'clean_room', name: '🧹', emoji: '🧹', order: 3 },
        draw_picture: { id: 'draw_picture', name: '🎨✏️', emoji: '🎨✏️', order: 4 },
        play: { id: 'play', name: '🧸🪁', emoji: '🧸🪁', order: 5 },
        practice_letters: { id: 'practice_letters', name: '🔠✏️', emoji: '🔠✏️', order: 6 },
        go_out: { id: 'go_out', name: '🏃🌳', emoji: '🏃🌳', order: 7 },
        brush_teeth_evening: { id: 'brush_teeth_evening', name: '🪥🌙', emoji: '🪥🌙', order: 8 },
      }
    }
  },
  children: {
    alex: {
      id: 'alex',
      name: 'Alex',
      taskSetId: 'alex_tasks',
      completedTasks: [],
      backgroundColor: 'linear-gradient(to bottom right, #FFA500, #0066FF)'
    },
    cecci: {
      id: 'cecci',
      name: 'Cecci',
      taskSetId: 'cecci_tasks',
      completedTasks: [],
      backgroundColor: 'linear-gradient(to bottom right, #fbd3e9, #bb377d)'
    },
    vicka: {
      id: 'vicka',
      name: 'Vicka',
      taskSetId: 'vicka_tasks',
      completedTasks: [],
      backgroundColor: 'linear-gradient(to bottom right, #ff4e50, #f9d423)'
    }
  },
  lastReset: null
};

// Update the state
async function updateState() {
  try {
    await set(ref(database, 'state'), DEFAULT_STATE);
    console.log('Successfully updated Firebase state!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating state:', error);
    process.exit(1);
  }
}

updateState(); 