import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBU22Sr-HjEJj89wFoeVDY8IAfzAw2R7V8",
  authDomain: "tasks-34654.firebaseapp.com",
  databaseURL: "https://tasks-34654-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tasks-34654",
  storageBucket: "tasks-34654.firebasestorage.app",
  messagingSenderId: "222183554116",
  appId: "1:222183554116:web:42ae8e8f1d224ce8475011"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);