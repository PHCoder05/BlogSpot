// src/firebase/FirebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
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
const storage = getStorage(app);

// Initialize Auth Providers
const googleAuthProvider = new GoogleAuthProvider();
const githubAuthProvider = new GithubAuthProvider();

export { fireDb, auth, storage, googleAuthProvider, githubAuthProvider };
