// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite"
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSOkNvWa7RlrA4HqNTTGP_asbFPGPQ2bE",
  authDomain: "vite-firebase-b6e7c.firebaseapp.com",
  projectId: "vite-firebase-b6e7c",
  storageBucket: "vite-firebase-b6e7c.appspot.com",
  messagingSenderId: "650417247754",
  appId: "1:650417247754:web:df69cc6c28dc92349cb1f3"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();
const storage = getStorage(firebaseApp)

export { auth, db, storage };