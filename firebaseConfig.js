// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB94cIrlL_xf6xd2N88Op2c87fKDnMHNis",
  authDomain: "sigma-1662454704866.firebaseapp.com",
  projectId: "sigma-1662454704866",
  storageBucket: "sigma-1662454704866.appspot.com",
  messagingSenderId: "208208695629",
  appId: "1:208208695629:web:e245e91655dffd5ea3e704",
  measurementId: "G-ZQE4KTEQC1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
/* const analytics = getAnalytics(app); */
export const storage = getStorage(app);
