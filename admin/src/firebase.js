// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWj8pgpyTuJ29VuWZshqV8EwRAQFLblZI",
  authDomain: "njfashion-d0819.firebaseapp.com",
  projectId: "njfashion-d0819",
  storageBucket: "njfashion-d0819.appspot.com",
  messagingSenderId: "890924570418",
  appId: "1:890924570418:web:75a8f6170c2859bf49692b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
