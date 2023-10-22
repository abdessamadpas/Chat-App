// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use

const firebaseConfig = {
  apiKey: "AIzaSyAl9wgroXdmzZXTJyZFs99_4AVD27oDc5U",
  authDomain: "chatapp-788dd.firebaseapp.com",
  projectId: "chatapp-788dd",
  storageBucket: "chatapp-788dd.appspot.com",
  messagingSenderId: "457387886560",
  appId: "1:457387886560:web:6ad9a4eefdfd0794f90d85",
  measurementId: "G-8LEMLRRJE9"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export default storage;

