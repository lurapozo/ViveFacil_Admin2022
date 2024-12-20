// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBa34Ewlyeqo4CYMus3t2IwI2l1Kil-d0c",
  authDomain: "vive-facil-66ae4.firebaseapp.com",
  databaseURL: "https://vive-facil-66ae4-default-rtdb.firebaseio.com",
  projectId: "vive-facil-66ae4",
  storageBucket: "vive-facil-66ae4.firebasestorage.app",
  messagingSenderId: "488204411614",
  appId: "1:488204411614:web:09336209e1b0238eedd84f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);