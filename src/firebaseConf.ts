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
  // firebase config
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
