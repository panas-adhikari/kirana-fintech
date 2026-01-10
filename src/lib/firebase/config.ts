// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getMessaging } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC4PwIBK6NVtKeNZsPZ093aGxeIV5pdkeo",
    authDomain: "kiranafintech.firebaseapp.com",
    databaseURL: "https://kiranafintech-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "kiranafintech",
    storageBucket: "kiranafintech.firebasestorage.app",
    messagingSenderId: "194044718956",
    appId: "1:194044718956:web:10a98abc682ae795bb8d49",
    measurementId: "G-9GQR721VTE"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Services
const db = getDatabase(app);

// Services that require window/client-side check
const analytics = typeof window !== 'undefined' ? isSupported().then(yes => yes ? getAnalytics(app) : null) : null;
const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

export { app, db, messaging, analytics };
