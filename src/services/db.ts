import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBxwtbD4_jgGk8dQ9irYqcJ5IdYkNdeij0",
  authDomain: "testing-41397.firebaseapp.com",
  databaseURL: "https://testing-41397-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "testing-41397",
  storageBucket: "testing-41397.appspot.com",
  messagingSenderId: "285672254334",
  appId: "1:285672254334:web:15c291f71b84107e68a12f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;