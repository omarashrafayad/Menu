import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDUNJ4Wc_uHwz9MSkKahFW5oAttF9jERRA",
  authDomain: "menu-32403.firebaseapp.com",
  projectId: "menu-32403",
  storageBucket: "menu-32403.firebasestorage.app",
  messagingSenderId: "768984308112",
  appId: "1:768984308112:web:3aa193f2570fc16fccbb15",
  measurementId: "G-TZ4YYJT9ME"
};

// Initialize Firebase (safely checks if app already initialized in SSR environments)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
