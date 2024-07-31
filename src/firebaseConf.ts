import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { Zoom, toast } from "react-toastify";

const firebaseConfig = {
  //firebase config
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase authentication
const auth = getAuth(app);

// Initialize Firestore database
const firestore = getFirestore(app);

// Initialize Realtime Database
const database = getDatabase(app);

// Initialize Firebase storage
const storage = getStorage(app);

const provider = new GoogleAuthProvider();

// Whenever a user interacts with the provider, we force them to select an account
provider.setCustomParameters({
  prompt: "select_account",
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
      // Handle sign out error
      console.error("Sign out error:", error);
      toast.error("Failed to log out. Please try again later.", { transition: Zoom });
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
