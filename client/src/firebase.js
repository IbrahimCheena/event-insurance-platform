// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAeVwNOyMDHHeWT1E1G5zjJQz_dyEzWiX8",
    authDomain: "event-insurance-platform.firebaseapp.com",
    projectId: "event-insurance-platform",
    storageBucket: "event-insurance-platform.firebasestorage.app",
    messagingSenderId: "187863786700",
    appId: "1:187863786700:web:e24bda70e3d54a6bab8e69",
    measurementId: "G-BT7BL835Y9"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
