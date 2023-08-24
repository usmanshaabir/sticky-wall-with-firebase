// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-JT0t8I1ATZzqe8B3ewxdrilHwdDXUd4",
  authDomain: "sticky-wall-1f2ff.firebaseapp.com",
  projectId: "sticky-wall-1f2ff",
  storageBucket: "sticky-wall-1f2ff.appspot.com",
  messagingSenderId: "424528054173",
  appId: "1:424528054173:web:2480f67aed8689a44f9174",
  measurementId: "G-FVGJ8YKQ7W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore=getFirestore()
const analytics = getAnalytics(app);

export  {firestore,analytics}