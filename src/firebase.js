import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAf7IniO_ENQ7abfrySJkPUyRUdJ7iwkcg",
  authDomain: "car-project-b3f47.firebaseapp.com",
  projectId: "car-project-b3f47",
  storageBucket: "car-project-b3f47.firebasestorage.app",
  messagingSenderId: "434008970998",
  appId: "1:434008970998:web:55fc95bddca44717effed7",
  measurementId: "G-0LKTZW65TV"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();