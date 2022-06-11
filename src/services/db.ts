import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyA0X7rRk0gmQpAC2lHsYjyPmzEB-3nKjCA",
  authDomain: "angkotin-352405.firebaseapp.com",
  projectId: "angkotin-352405",
  storageBucket: "angkotin-352405.appspot.com",
  messagingSenderId: "677320649420",
  appId: "1:677320649420:web:56c3f7639e4d2aab733069"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;