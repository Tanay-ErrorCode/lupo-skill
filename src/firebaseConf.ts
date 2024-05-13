import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { Zoom, toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyA_Q1ZdPfafShrLqZ6AhIxahCJfKRCOk5c",
  authDomain: "lupo-skill-11.firebaseapp.com",
  projectId: "lupo-skill-11",
  storageBucket: "lupo-skill-11.appspot.com",
  messagingSenderId: "776849758518",
  appId: "1:776849758518:web:48516c2ea4a5b8598bbb97",
  measurementId: "G-3ZSDLLJ3HG",
  databaseURL:"https://lupo-skill-11-default-rtdb.firebaseio.com/"
};
const app = firebase.initializeApp(firebaseConfig);
// Initialize Firebase authentication
const auth = getAuth(app);

// Initialize Firestore database
const firestore = getFirestore(app);

// Initialize Realtime Database
const database = getDatabase(app);

// Initialize Firebase storage
const storage = getStorage(app);

const provider = new GoogleAuthProvider();

// whenever a user interacts with the provider, we force them to select an account
provider.setCustomParameters({
  prompt: "select_account ",
});
const signInWithGooglePopup = () => signInWithPopup(auth, provider);
const signOutUser = () => {
  signOut(auth)
    .then(() => {
      localStorage.clear();
      toast.success("Logged out successfully",  {transition:Zoom});
      window.location.href = "#/";
      window.location.reload();
    })
    .catch((error) => {
      // An error happened.
      console.error(error);
    });
};
export {
  auth,
  firestore,
  database,
  storage,
  signInWithGooglePopup,
  signOutUser,
};
