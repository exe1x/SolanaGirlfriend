// src/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase config here (replace with your actual Firebase project credentials)
const firebaseConfig = {
    apiKey: "AIzaSyBt5hibVydYU1-XRvy6xm8HqAFCjypCDPM",
    authDomain: "dogwifblog-b2997.firebaseapp.com",
    projectId: "dogwifblog-b2997",
    storageBucket: "dogwifblog-b2997.appspot.com",
    messagingSenderId: "293268586075",
    appId: "1:293268586075:web:6e1230b209ded0495b097e",
    measurementId: "G-R16VCZJ5XC"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };