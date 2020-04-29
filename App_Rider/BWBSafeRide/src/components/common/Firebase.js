import * as firebase from 'firebase';
// const firebaseConfig = {
//     apiKey: "AIzaSyBHoGShWYIEzuHM0Lfnl67EkVgi4hEM4qw",
//     authDomain: "bwbsaferide.firebaseapp.com",
//     databaseURL: "https://bwbsaferide.firebaseio.com",
//     projectId: "bwbsaferide",
//     storageBucket: "bwbsaferide.appspot.com",
//     messagingSenderId: "903140254593",
//     appId: "1:903140254593:web:7e259c6891e88a5837be80"
// };

var firebaseConfig = {
    apiKey: "AIzaSyAb5kfppQCQjfo1_S6yDsLD8onpoU27bY8",
    authDomain: "bwbsaferide-6e68c.firebaseapp.com",
    databaseURL: "https://bwbsaferide-6e68c.firebaseio.com",
    projectId: "bwbsaferide-6e68c",
    storageBucket: "bwbsaferide-6e68c.appspot.com",
    messagingSenderId: "589194825925",
    appId: "1:589194825925:web:5015e3c8b080a0b49420ac",
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;