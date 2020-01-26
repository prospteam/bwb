import * as firebase from 'firebase';
import firestore from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBHoGShWYIEzuHM0Lfnl67EkVgi4hEM4qw",
    authDomain: "bwbsaferide.firebaseapp.com",
    databaseURL: "https://bwbsaferide.firebaseio.com",
    projectId: "bwbsaferide",
    storageBucket: "bwbsaferide.appspot.com",
    messagingSenderId: "903140254593",
    appId: "1:903140254593:web:7e259c6891e88a5837be80"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;