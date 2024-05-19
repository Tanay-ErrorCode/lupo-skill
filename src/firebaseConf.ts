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
  apiKey: "AIzaSyAjkf7JaCuhKeYR-RjUEXWerhXJSwr8HUw",

  authDomain: "lupo-skill-5bb1b.firebaseapp.com",

  databaseURL: "https://lupo-skill-5bb1b-default-rtdb.firebaseio.com",

  projectId: "lupo-skill-5bb1b",

  storageBucket: "lupo-skill-5bb1b.appspot.com",

  messagingSenderId: "888378512808",

  appId: "1:888378512808:web:6884d36a6c3c001300f99d",

  measurementId: "G-DW3GM3GK6F",
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
      toast.success("Logged out successfully", { transition: Zoom });
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
