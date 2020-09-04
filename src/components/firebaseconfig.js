import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/firestore";
import "firebase/database"

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDF4j_1OTDcIyxD7rVu2YOZZQ5JUbQX8Sw",
        authDomain: "waldo-fb77e.firebaseapp.com",
        databaseURL: "https://waldo-fb77e.firebaseio.com",
        projectId: "waldo-fb77e",
        storageBucket: "waldo-fb77e.appspot.com",
        messagingSenderId: "673162512383",
        appId: "1:673162512383:web:8ea82ebc02f93b00c7c9ca",
        measurementId: "G-P9MHP1K83K"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase