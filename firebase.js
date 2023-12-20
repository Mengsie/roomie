
import { getApps, initializeApp } from "firebase/app"; 
import { initializeAuth, getAuth } from 'firebase/auth';
import { getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyCOht1JJt315PZTntcHqdQzxJj6spDl7Ag",
  authDomain: "roomie-fdb5e.firebaseapp.com",
  projectId: "roomie-fdb5e",
  storageBucket: "roomie-fdb5e.appspot.com",
  messagingSenderId: "1073545675612",
  appId: "1:1073545675612:web:c5b421878887995a39b799",
  measurementId: "G-DVRX4Q066C"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore()
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});



export { auth, db }