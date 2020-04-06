import firebase from '../components/common/Firebase';

// this.ref = firebase.firestore().collection('driver_location_logs');
// this.ref_bookings_status = firebase.firestore().collection('bookings_status');
// import React from 'react';
// import { Text, View, Button } from 'react-native';

export const addData = (collection = "", id = "", tosave = "") => {
  // alert(1);
  const ref_single = firebase.firestore().collection(collection + "").doc(id);
  ref_single.get().then((docSnapshot) => {
    if (docSnapshot.exists) {
      return false;
    } else {
      // alert("WALA");
      ref_single.set({
        "status": "asd",
      })
      .catch(function (error) {
        return false;
        console.error("Error adding document: ", error);
      });
      return true;
    }
  });
};

export const editData = (collection = "", id = "", tosave = []) => {
  // alert(1);
  const ref_single = firebase.firestore().collection(collection + "").doc(id);
  ref_single.get().then((docSnapshot) => {
    if (docSnapshot.exists) {
        ref_single.update(tosave)
        .catch(function (error) {
          return false;
          console.error("Error adding document: ", error);
        });
      return true;
    } else {
      return false;
    }
  });
};

export const getData = async (collection = "", id = "") => {
  const ref_single = await firebase.firestore().collection(collection).doc(id);
		// RETREIVE
    // console.log("GETTING HERE ");
    ref_single.get().then((docSnapshot) => {
      if (docSnapshot.exists) {
        return docSnapshot.data();
      } else {
        return false;
      }
    });
};

export const deleteData = (collection = "", id = "") => {
  const ref_single = firebase.firestore().collection(collection).doc(id);
  ref_single.delete().then(function () {
    // console.log("Document successfully deleted!");
    return true;
  }).catch(function(error) {
  console.error("Error removing document: ", error);
    return false;
  });
};

// UPDATE 
// const ref_single = this.ref_bookings_status.doc("29");
// ref_single.get().then((docSnapshot) => {
      // if (docSnapshot.exists) {
          // ref_single.update({
          // "status":"bablalba",
          // })
          // .catch(function(error) {
              // console.error("Error adding document: ", error);
          // });
      // } else {
// console.log("Wala")
    // }
// });
		  
		// DELETE 
        // const ref_single = this.ref_bookings_status.doc("29");
		// ref_single.delete().then(function() {
			// console.log("Document successfully deleted!");
		// }).catch(function(error) {
			// console.error("Error removing document: ", error);
		// });
		  
		  
		  // Get the current timestamp
// var now = new Date().getTime();
// Create a query that orders by the timestamp
// var query = ref.orderByChild('timestamp').startAt(now);
// Listen for the new children added from that point in time
// query.on('child_added', function (snap) { 
  // console.log(snap.val()
// });

// When you add this new item it will fire off the query above
// ref.push({ 
  // title: "hello", 
  // timestamp: Firebase.ServerValue.TIMESTAMP 
// });