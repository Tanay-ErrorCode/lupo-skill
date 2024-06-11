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
  apiKey: "AIzaSyA8ooV2yhe-pRdbaOnzm-tm4JKJ5SjTcJM",
  authDomain: "jio-jamai.firebaseapp.com",
  databaseURL: "https://jio-jamai-default-rtdb.firebaseio.com",
  projectId: "jio-jamai",
  storageBucket: "jio-jamai.appspot.com",
  messagingSenderId: "1034732973241",
  appId: "1:1034732973241:web:b66c4dc0f3502c45dcbf68",
  measurementId: "G-12YE23385J",
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
