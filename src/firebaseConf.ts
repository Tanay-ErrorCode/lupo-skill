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
  // firebase configuration
  apiKey: "AIzaSyBQgNBQyC1AIY8yqOwuK9tiyhHJ1vkF2Zs",
  authDomain: "lupo-skill-62b65.firebaseapp.com",
  projectId: "lupo-skill-62b65",
  storageBucket: "lupo-skill-62b65.appspot.com",
  messagingSenderId: "770931678454",
  appId: "1:770931678454:web:74f0fe54e02f0a882020d7",
  measurementId: "G-R8BE7P4DRG",
  databaseURL:"https://lupo-skill-62b65-default-rtdb.asia-southeast1.firebasedatabase.app/"
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
