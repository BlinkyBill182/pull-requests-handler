import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCrOVODfIwv0St5W9aeD80k1rJRDwXqbDE",
    authDomain: "pull-requests-handler.firebaseapp.com",
    databaseURL: "https://pull-requests-handler-default-rtdb.firebaseio.com",
    projectId: "pull-requests-handler",
    storageBucket: "pull-requests-handler.appspot.com",
    messagingSenderId: "207968340936",
    appId: "1:207968340936:web:a79ed6867bb8f0996f0efd"
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth();

// Initialize Firebase Database
const database = getDatabase();

export { auth, database };