// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {

  apiKey: "AIzaSyA6Ko4usDxrGwJ3WEPpSz_23b6Go2MbDm0",

  authDomain: "blog-d85ac.firebaseapp.com",

  databaseURL: "https://blog-d85ac-default-rtdb.firebaseio.com",

  projectId: "blog-d85ac",

  storageBucket: "blog-d85ac.appspot.com",

  messagingSenderId: "139367876374",

  appId: "1:139367876374:web:565fd7c060cc44d9ee7237"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireDb = getFirestore(app);
const auth = getAuth(app);
const storage =getStorage(app);

export {fireDb , auth, storage}