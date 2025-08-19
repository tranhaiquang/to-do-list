// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth"
import AsyncStorage from "@react-native-async-storage/async-storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyByPVlVgqUyC16bG0fHOQpqkzzMo4_ezgo",
  authDomain: "to-do-list-cf5a7.firebaseapp.com",
  projectId: "to-do-list-cf5a7",
  storageBucket: "to-do-list-cf5a7.firebasestorage.app",
  messagingSenderId: "96033539849",
  appId: "1:96033539849:web:e723befde12042b02d75d8",
  measurementId: "G-6D2F5KLEQP",
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export { db, auth };
