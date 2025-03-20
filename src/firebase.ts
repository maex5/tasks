import { initializeApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: "tasks-34654.appspot.com",
  messagingSenderId: "222183554116",
  appId: "1:222183554116:web:42ae8e8f1d224ce8475011"
};

// Debug logging
console.log('Firebase Config:', {
  ...firebaseConfig,
  apiKey: '[HIDDEN]',
  databaseURL: firebaseConfig.databaseURL
});

let database: Database;

// Initialize Firebase
try {
  const app = initializeApp(firebaseConfig);
  database = getDatabase(app);
  console.log('Firebase Database initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

export { database };