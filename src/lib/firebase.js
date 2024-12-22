// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth} from "firebase/auth"; // Added GoogleAuthProvider for Google login
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCrb4s2SEq-CAu_bnAbGNlzCq0VC5lsMXI",
    authDomain: "image-store-2af71.firebaseapp.com",
    projectId: "image-store-2af71",
    storageBucket: "image-store-2af71.firebasestorage.app",
    messagingSenderId: "285867646782",
    appId: "1:285867646782:web:c5c8e47ca45fffe15e166f",
    measurementId: "G-ZH3HJVTNW6"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

// Initialize Google Auth Provider


export { auth, db, app, firebaseConfig };