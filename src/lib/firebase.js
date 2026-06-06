import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAc0ASSMkESCsZW5Pu2Wph9oF0OCmI-YDQ",
  authDomain: "vanttflow-app.firebaseapp.com",
  projectId: "vanttflow-app",
  storageBucket: "vanttflow-app.firebasestorage.app",
  messagingSenderId: "313827981019",
  appId: "1:313827981019:web:6446461196c7eaae383efe",
  measurementId: "G-LQQXH9JFVT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const dbFirestore = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export { signInWithPopup, signOut, onAuthStateChanged, doc, setDoc, getDoc };
