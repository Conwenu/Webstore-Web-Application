// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_pdyVrhAw2GYA41uyoMcksqRElmqXpxU",
  authDomain: "webstorestorage-a1510.firebaseapp.com",
  projectId: "webstorestorage-a1510",
  storageBucket: "webstorestorage-a1510.appspot.com",
  messagingSenderId: "497865248231",
  appId: "1:497865248231:web:12a71cfbeeded5522ac142",
  measurementId: "G-95P7HYTT84",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
