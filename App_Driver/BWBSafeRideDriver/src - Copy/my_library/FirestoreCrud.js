
		// RETREIVE
		// this.ref_bookings_status.doc("28")
		// .get().then((docSnapshot) => {
			// console.log(docSnapshot.data())
          // });
		  
		// SAVE 
        // const ref_single = this.ref_bookings_status.doc("29");
		// ref_single.get().then((docSnapshot) => {
                  // if (docSnapshot.exists) {
					  
						// console.log("NAA NA")
                  // } else {
					// console.log("yesA")
                    // ref_single.set({
                      // "status":"asd",
                    // })
                    // .catch(function(error) {
                        // console.error("Error adding document: ", error);
                    // });
                // }
          // });
		  
		  
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