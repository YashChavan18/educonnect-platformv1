// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyAh8D6KuM5XKVXvgfdppv6TxfUQZZjVgIE",
  authDomain: "educonnect-b13b9.firebaseapp.com",
  projectId: "educonnect-b13b9",
  storageBucket: "educonnect-b13b9.firebasestorage.app",
  messagingSenderId: "582360763150",
  appId: "1:582360763150:web:dd1a322c6f1e298adaa55f"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

