// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDsuk3adRoiJuP6PNh0HgXeQ1YqZ0OKjs",
  authDomain: "automated-parking-system-4d615.firebaseapp.com",
  databaseURL: "https://automated-parking-system-4d615-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "automated-parking-system-4d615",
  storageBucket: "automated-parking-system-4d615.firebasestorage.app",
  messagingSenderId: "1055212858973",
  appId: "1:1055212858973:web:49301f24f98cef8d6ba7b4",
  measurementId: "G-C0LV0PQPCV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
export { database };