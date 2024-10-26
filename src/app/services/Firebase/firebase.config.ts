// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyB9RIQgcP43-2-taFc4SQnCc1ZoSz_ZDTU",
  authDomain: "to-me-292901.firebaseapp.com",
  databaseURL: "https://to-me-292901.firebaseio.com",
  projectId: "to-me-292901",
  storageBucket: "to-me-292901.appspot.com",
  messagingSenderId: "233470508425",
  appId: "1:233470508425:web:72202908c1d2863d893558",
  measurementId: "G-1VYKMRKC94"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);