import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAjou5jH4BjszvbG-G3TyHPRq1cEuVE06w",
  authDomain: "ratemydorm-4c226-787e6.firebaseapp.com",
  projectId: "ratemydorm-4c226-787e6",
  storageBucket: "ratemydorm-4c226-787e6.appspot.com",
  messagingSenderId: "447072155149",
  appId: "1:447072155149:web:74ec82e09a43b72d260744",
  measurementId: "G-XWCCT2QGB5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export { app,auth, db, GoogleAuthProvider, signInWithPopup };
