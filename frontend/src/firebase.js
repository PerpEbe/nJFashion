// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBWj8pgpyTuJ29VuWZshqV8EwRAQFLblZI",
//   authDomain: "njfashion-d0819.firebaseapp.com",
//   projectId: "njfashion-d0819",
//   storageBucket: "njfashion-d0819.appspot.com",
//   messagingSenderId: "890924570418",
//   appId: "1:890924570418:web:75a8f6170c2859bf49692b"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export default app;






// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCbP8UnJpbTXLd6S1o2Bp5_9Ji1uow_0E",
  authDomain: "njfashion-cce21.firebaseapp.com",
  projectId: "njfashion-cce21",
  storageBucket: "njfashion-cce21.appspot.com",
  messagingSenderId: "895472804983",
  appId: "1:895472804983:web:99dbfa0293ead496d45272"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage=getStorage(app);
export const db=getFirestore(app);
export const auth=getAuth(app);