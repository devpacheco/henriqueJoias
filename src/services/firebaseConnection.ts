import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCxkj3ykWJdd_-EF0pKN9X6Bh_WowhInaU",
  authDomain: "henrique-joias-5105f.firebaseapp.com",
  projectId: "henrique-joias-5105f",
  storageBucket: "henrique-joias-5105f.appspot.com",
  messagingSenderId: "988578021130",
  appId: "1:988578021130:web:ffc04d40baa3f7e95544f3"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };