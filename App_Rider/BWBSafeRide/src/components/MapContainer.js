import React from 'react';
import { Image, View, KeyboardAvoidingView, Alert } from 'react-native';
import { Button, Text, Input, Form, Item, Label, DatePicker, Thumbnail, Left, Body, Spinner } from 'native-base';
import MapInput from './MapInput';
import MyMapView from './MyMapView';
import { getLocation } from './getLocation';
import { Actions } from 'react-native-router-flux';
import DateTimePicker from "react-native-modal-datetime-picker";
import BottomDrawer from 'rn-bottom-drawer';
import styles from '.././assets/my_styles.js';
import Helpers from '../../Helpers';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import firebase from './common/Firebase';
import CommonProgressBar from './common/CommonProgressBar.js';

//import Geolocation from "@react-native-community/geolocation";

// redux 
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { sampleFunction } from '../actions/index.js';
// I included ang "index.js" para di malibog

var PushNotification = require("react-native-push-notification"); // PUSH NOTIFICATION TEMPLATE

// PushNotification.localNotification({
// foreground: false, // BOOLEAN: If the notification was received in foreground or not
// userInteraction: false, // BOOLEAN: If the notification was opened by the user from the notification area or not
// message: 'Booking Updates', // STRING: The notification message
// data: {}, // OBJECT: The push data
// });

const TAB_BAR_HEIGHT = 80;
const DRAWER_HEIGHT_SMALL = 300;
const DRAWER_HEIGHT_BIG = 500;
// const GOOGLE_MAPS_APIKEY = 'AIzaSyDNiQ_vrw3zB6pM_s2nNC-0mohwlWi6wGo';
// const GOOGLE_MAPS_APIKEY = 'AIzaSyCsCARtyDaiIeDtGY0r3jz4pT4YwiR41Fw';
const GOOGLE_MAPS_APIKEY = 'AIzaSyC8lpkvXFDua9S2al669zfwz7GSkeVFWs4';

// const DRAWER_HEIGHT_SMALL = 80;
class MapContainer extends React.Component {

  // state = {
  //   testlocation:null,
  //   is_finish_check_booking_status:false,
  //   is_user_type_ready:false,
  //   user:null,
  //   driver_details:[],
  //   my_latitude:0,
  //   my_longitude:0,
  //   can_book:false,
  //   isDateTimePickerVisible: false,
  //   region: {
  //     latitude: 43.7984299,
  //     longitude: -84.7310113,
  //     latitudeDelta: 3,
  //     longitudeDelta: 3,
  //   },
  //   geocode_name: null,
  //   geocode_lat: null,
  //   geocode_long: null,
  //   login_id: null,
  //   pinned_stat: false,
  //   set_destination_lat: this.props.set_destination_lat,
  //   set_destination_long: this.props.set_destination_long
  // };

  state = {
    testlocation: null,
    is_finish_check_booking_status: false,
    is_user_type_ready: true,
    user: null,
    driver_details: [],
    distance: 0,
    duration: 0,
    my_latitude: 0,
    my_longitude: 0,
    can_book: true,
    isDateTimePickerVisible: false,
    region: {
      latitude: 44.3148, // Michigan Lat
      longitude: -84.506836, // Michigan Long
      latitudeDelta: 1,
      longitudeDelta: 1,
    },
    geocode_name: null,
    geocode_lat: null,
    geocode_long: null,
    login_id: null,
    booking_details: [],
    pinned_stat: false,
    my_latitude_as_rider: 0,
    my_longitude_as_rider: 0,
    // form_from_latlong: null,
    set_destination_lat: this.props.set_destination_lat,
    set_destination_long: this.props.set_destination_long,
    form_from_text: null,
    form_to_text: null,
    loading_bar: false
    // pinned_latitude: 0,
    // pinned_longitude: 0
  };

  // componentWillReceiveProps(nextProps, nextState){
  //     const {navigation} = this.props;
  //
  //     if(navigation.getParam('booking_data_from_latlong', null) !== null){
  //           this.updateState({
  //             latitude: navigation.getParam('booking_data_from_latlong', null).latitude,
  //             longitude: navigation.getParam('booking_data_from_latlong', null).longitude,
  //           });
  //           // this.reverseGeocode(navigation.getParam('booking_data_from_latlong', null).latitude, navigation.getParam('booking_data_from_latlong', null).longitude);
  //     }
  // }

  componentDidUpdate(prevProps, prevState) {
    const { navigation } = this.props;

    // if(prevState.user !== this.state.user){
    //     Alert.alert("user update");
    // }

    // console.error(navigation.getParam('booking_data_from_latlong', null).latitude);

    if (prevState.user !== this.state.user) {
      this.setState({ can_book: true });
      this.setState({ is_finish_check_booking_status: true });
    }

    // if(this.state.geocode_lat !== prevState.geocode_lat){
    //     if(navigation.getParam('booking_data_from_text', null) !== null){
    //           this.setState({geocode_name: navigation.getParam('booking_data_from_text', null)});
    //           this.setState({geocode_lat: navigation.getParam('booking_data_from_latlong', null).latitude});
    //           this.setState({geocode_long: navigation.getParam('booking_data_from_latlong', null).longitude});
    //     }
    // }

    if (prevProps.set_destination_lat !== this.props.set_destination_lat) {
      fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.props.set_destination_lat + ',' + this.props.set_destination_long + '&key=' + GOOGLE_MAPS_APIKEY)
        .then((response) => response.json())
        .then((responseJson) => {

          this.setState({
            set_destination_lat: this.props.set_destination_lat,
            form_to_text: responseJson.results[0].formatted_address,
            form_to: 'to',
            form_to_latlong: {
              latitude: this.props.set_destination_lat,
              longitude: this.props.set_destination_long
            }
          });
        });
    }

    if (prevProps.set_destination_long !== this.props.set_destination_long) {
      fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.props.set_destination_lat + ',' + this.props.set_destination_long + '&key=' + GOOGLE_MAPS_APIKEY)
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({
            set_destination_long: this.props.set_destination_long,
            form_to_text: responseJson.results[0].formatted_address,
            form_to: 'to',
            form_to_latlong: {
              latitude: this.props.set_destination_lat,
              longitude: this.props.set_destination_long
            }
          });
        });
    }

    // if(prevProps.loc_to_text !== this.props.loc_to_text) {
    //     this.locationDestRef.setAddressText(this.props.loc_to_text);
    // }

    if (prevProps.latlong !== this.props.latlong) {

      for (var key in this.props.latlong) {
        if (this.props.latlong.hasOwnProperty(key)) {
          var latitude = this.props.latlong['latitude'];
          var longitude = this.props.latlong['longitude'];
        }
      }
    }
    if (this.props.can_book) {

      this.checkBookingStatus();
    }

  }
  // watchID: ?number = null;

  constructor(props) {
    super(props);

    // console.error(JSON.parse(AsyncStorage.getItem('userData')));

    this.ref = firebase.firestore().collection('driver_location_logs');
    this.ref_bookings_status = firebase.firestore().collection('bookings_status');

    // console.log('this.ref');
    // console.log(this.ref);
    // console.log('this.ref_bookings_status');
    // console.log(this.ref_bookings_status);
    // console.log('LOEDDEDDDD1');
    // Alert.alert("Watch Position");
    Geolocation.getCurrentPosition(
      position => {
        const initialPosition = JSON.stringify(position);
        // this.setState({initialPosition});
        console.log(initialPosition);
      },
      error => console.log('Error', JSON.stringify(error)),
      { enableHighAccuracy: true, timeout: 20000 },
    );

    this.watchID = Geolocation.watchPosition((position) => {
      //const lastPosition = JSON.stringify(position);
      //this.setState({lastPosition});

      this.setState({
        region: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121
        }
      });
    },
      (error) => console.log(JSON.stringify(error))
    );


  }

  componentDidMount() {
    // Alert.alert(this.state.form_from_text);

    // if(this.props.navigation.getParam('booking_data_from_text', null) || this.state.form_from_text){
    //     Alert.alert(this.props.navigation.getParam('booking_data_from_text', this.state.form_from_text));
    // this.locationOrigRef.setAddressText(this.props.navigation.getParam('booking_data_from_text', this.state.form_from_text));

    // }

    // if(this.props.navigation.getParam('booking_data_to_text', null) || this.state.form_to_text){
    //     this.locationDestRef.setAddressText(this.props.navigation.getParam('booking_data_to_text', this.state.form_to_text));
    // }

    // this.driverSendLocation();


    const { pinned_stat, navigation } = this.props;
    // if(navigation.getParam('booking_data_from_latlong', null) !== null){
    //       this.updateState({
    //         latitude: navigation.getParam('booking_data_from_latlong', null).latitude,
    //         longitude: navigation.getParam('booking_data_from_latlong', null).longitude,
    //       });
    //       // this.reverseGeocode(navigation.getParam('booking_data_from_latlong', null).latitude, navigation.getParam('booking_data_from_latlong', null).longitude);
    // }

    this.setState({ pinned_stat: pinned_stat });

    AsyncStorage.getItem("userData", (errs, result) => {
      if (!errs) {
        if (result !== null) {
          // this.setState({activeID:result});
          let res = JSON.parse(result);
          // console.error(res.userid)

          this.setState({
            user: res,
            is_user_type_ready: true,
          });

          // Alert.alert('asdsf');
        }
      }
    });

    // if(navigation.getParam('booking_data_from_text', null) !== null){
    //       this.setState({geocode_name: navigation.getParam('booking_data_from_text', null)});
    //       this.setState({geocode_lat: navigation.getParam('booking_data_from_latlong', null).latitude});
    //       this.setState({geocode_long: navigation.getParam('booking_data_from_latlong', null).longitude});
    // }

    // this.setState({
    //   user: JSON.parse(await AsyncStorage.getItem('userData')),
    //   is_user_type_ready:true,
    // });

    // this.setState({
    //     region: {
    //       latitude: this.props.booking_data_to_latlong.latitude,
    //       longitude: this.props.booking_data_to_latlong.longitude,
    //       latitudeDelta:  0.015,
    //       longitudeDelta: 0.0121
    //     }
    // });

    // this.setState({form_from_text: navigation.getParam('booking_data_from_text', this.state.state.form_from_text)});
    // this.setState({form_to_text: navigation.getParam('booking_data_to_text', this.state.state.form_to_text)});

    // console.log('MapContainer-start');
    // console.log(this.props);
    // console.log('MapContainer-end');
    //
    // this.setState({pinned_latitude: this.props.pinned_latitude});
    // this.setState({pinned_longitude: this.props.pinned_longitude});
    // this.updateState({
    //   latitude: parseFloat(pinned_lat),
    //   longitude: parseFloat(pinned_long),
    // });

    this.initMyLocation();
    this.checkBookingStatus();
  }

  driverLocationListener = () => {
    // const books = [];
    console.log("FAYR");
    console.log(this.state.booking_details);
    // querySnapShot.forEach((doc) => {
    //   console.log("ITEM");
    //   console.log(doc);
    //   console.log(doc.data());
    //   const { name } = doc.data();
    //   // books.push({
    //   //   name
    //   // });
    //   this.setState({
    //     testlocation: doc.data(),
    //   });
    // });

    this.ref.doc(String(Number(this.state.booking_details.booking_id))).onSnapshot(docSnapshot => {
    // this.ref.doc(this.state.booking_details.booking_id).onSnapshot(docSnapshot => {
      console.log(`Received doc snapshot:`);
      console.log(docSnapshot.data());

        this.setState({
          driver_location_realtime: docSnapshot.data(),
        });
          // this.setState({
          //   testlocation: doc.data(),
          // });
      // ...
    }, err => {
      console.log(`Encountered error on driver listener: ${err}`);
    });
  }

  riderGetCurrentLocation() {
    // geolocation.getCurrentPosition(geo_success, [geo_error], [geo_options]); // FUNCTION PARAMETER

    const watchId = Geolocation.getCurrentPosition(
      pos => {
        console.log("Get initial location");
        this.setState({
          my_latitude_as_rider: pos.coords.latitude,
          my_longitude_as_rider: pos.coords.longitude,
        });
      },
      e => setError(e.message + "ERRRORR NOOOOO")
    );

  }

  driverSendLocation() {
    const watchId = Geolocation.watchPosition(
      pos => {
        console.log("GETTINGS");
        // console.log(newCoordinate);
        // setError("");
        this.setState({
          my_latitude: pos.coords.latitude,
          my_longitude: pos.coords.longitude,
        });

        if (this.state.booking_details) {
          const ref_single = this.ref.doc(this.state.booking_details.booking_id);
          ref_single.get()
            .then((docSnapshot) => {
              if (this.state.login_id) {
                if (docSnapshot.exists) {
                  ref_single.update({
                    // booking_id:this.state.booking_details.booking_id,
                    booking_id: 0,
                    driver_id: this.state.login_id,
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                  })
                    .catch(function (error) {
                      console.error("Error adding document: ", error);
                    });
                } else {
                  ref_single.set({
                    // booking_id:this.state.booking_details.booking_id,
                    booking_id: 0,
                    driver_id: this.state.login_id,
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                  })
                    .catch(function (error) {
                      console.error("Error adding document: ", error);
                    });
                }
              }
              // console.log('ALKSDJASJLDKASJLKDASKDJLAKSJ');
              // console.log(docSnapshot);

              // Add a new document with a generated id.
              // db.collection("cities").add({
              //     name: "Tokyo",
              //     country: "Japan"
              // })
              // .then(function(docRef) {
              //     console.log("Document written with ID: ", docRef.id);
              // })
              // .catch(function(error) {
              //     console.error("Error adding document: ", error);
              // });


            });
        }

        // setPosition({
        //   latitude: pos.coords.latitude,
        //   longitude: pos.coords.longitude
        // });
      },
      e => setError(e.message + "ERRRORR NOOOOO")
    );

  }

  reverseGeocode(latitude, longitude) {
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + latitude + ',' + longitude + '&key=' + GOOGLE_MAPS_APIKEY)
      .then((response) => response.json())
      .then((responseJson) => {
        const data = {
          // user_id: this.state.userid,
          latitude: latitude,
          longitude: longitude,
          location_name: responseJson.results[0].formatted_address
        }
        this.setState({ geocode_name: responseJson.results[0].formatted_address });
        this.setState({ geocode_lat: latitude });
        this.setState({ geocode_long: longitude });

        //  const self = this;
        //  const api = url()+'api/save_location';
        //
        //  fetch(api, {
        //   method: 'POST',
        //   headers: {
        //     'Accept': 'application/json',
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(data)
        // }).then((response) => response.json())
        //   .then((res) => {
        //      Alert.alert(res.msg);
        //
        //   }).catch((error) => {
        //     console.error(error);
        //   });
      })
  }

  async checkBookingStatus() {
    // Alert.alert('hello');
    // const data = JSON.parse(await AsyncStorage.getItem('userData'));
    await AsyncStorage.getItem("userData", (errs, result) => {
      if (!errs) {
        if (result !== null) {
          // this.setState({activeID:result});
          let data = JSON.parse(result);
          // console.error(data);
          this.setState({ login_id: data.login_id });
          console.log('Getting Boking Status');
          console.log(Helpers.ci_url + 'booking/rider_booking_status/' + data.login_id);

          fetch(Helpers.ci_url + 'booking/rider_booking_status/' + data.login_id, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
          }).then((response) => response.json())
            .then((responseJson) => {
              console.log('getting API');
              console.log(responseJson);

              if (responseJson.num_of_active_booking > 0) {
                let prepare_driver_details;
                if (responseJson.driver_details) {
                  prepare_driver_details = responseJson.driver_details;
                } else {
                  prepare_driver_details = [];
                }

                // get_realtime_booking_status = (id) => {
                //   console.log(`getting freee:`);
                // console.log(responseJson.booking_details.booking_id);

                this.setState({
                  can_book: false,
                  driver_details: prepare_driver_details,
                  booking_details: responseJson.booking_details,
                });

                if (this.state.booking_details) {
                  this.driverLocationListener();
                }
      
                const usersRef = this.ref_bookings_status.doc(String(Number(responseJson.booking_details.booking_id)));
                usersRef.get()
                  .then((docSnapshot) => {
                    if (docSnapshot.exists) {
                      usersRef.update({
                        "booking_status": responseJson.booking_details.booking_status,
						// "additional_field_driver_status":docSnapshot_data.additional_field_driver_status
                      });
                    } else {
                      usersRef.set({
                        "booking_status": "",
						// "booking_status": responseJson.booking_details.booking_status,
						// "additional_field_driver_status":docSnapshot_data.additional_field_driver_status
                      });
                    }
					let docSnapshot_data=docSnapshot.data();
					console.log("docSnapshot_data");
					console.log(docSnapshot_data);
					let push_notif_message = "Updates On Your Bookings";
					
				  usersRef.onSnapshot((doc) => {
					  docSnapshot_data=doc.data();
					console.log("docSnapshot_data2");
					console.log(docSnapshot_data);
                    // if (doc.exists) {
						if(docSnapshot_data.additional_field_driver_status){
							if(docSnapshot_data.additional_field_driver_status=="going_pick"){
								push_notif_message = "Driver is on the way on your location";
							}else if(docSnapshot_data.additional_field_driver_status=="going_drop"){
								push_notif_message = "Going to drop location";
							}else if(docSnapshot_data.additional_field_driver_status=="completed"){
								push_notif_message = "Booking complete, Thank you for using the service";
							}
							
						}
                    // }
                    
					PushNotification.cancelLocalNotifications({ id: '52341234' });
					PushNotification.localNotification({
						id: '52341234',
					  foreground: false, // BOOLEAN: If the notification was received in foreground or not
					  userInteraction: false, // BOOLEAN: If the notification was opened by the user from the notification area or not
					  message: push_notif_message, // STRING: The notification message
					  data: {}, // OBJECT: The push data
					});
					// this.setState({
					//   booking_status: docSnapshot.data().booking_id,
					// });
					let data = doc.data();
					console.log("docSnapshot.data()");
					console.log(doc);
					// console.log(this.state.booking_status);
					if (data.booking_status) {
					  let can_book = false;
					  const alter_booking_details = this.state.booking_details;
					  alter_booking_details.booking_status = data.booking_status;
					  if (data.booking_status == "completed") {
						can_book = true;
					  }
					  this.setState({
						can_book: can_book,
						// driver_details: prepare_driver_details,
						booking_details: alter_booking_details,
            });
            

					}
				  }, err => {
					console.log(`Encountered error: ${err}`);
				  });
					
                  });


              } else {
                this.setState({
                  can_book: true,
                  driver_details: [],
                  booking_details: [],
                });

              }
            }).catch((error) => {
              //console.log('NOT getting API');
              alert('You have encountered issued on your internet connection, Please try again later!');
              //console.error(error);
            });
			
          this.setState({
            is_finish_check_booking_status: true,
          });
        }
      }
    });

  }

  initMyLocation() {
    getLocation().then(data => {
      console.log('GET LOCATION');
      // this.updateState({
      //   latitude: data.latitude,
      //   longitude: data.longitude,
      // });
      // this.updateSelectedLatLong({
      //   latitude: data.latitude,
      //   longitude: data.longitude,
      // });
      this.setState({
        my_latitude: data.latitude,
        my_longitude: data.longitude,
      });

      this.setState({ geocode_lat: data.latitude });
      this.setState({ geocode_long: data.longitude });

      // return data;
    })
      .catch(err => {
        console.log('Error:' + err.message);
      });
  }

  updateState(location) {

    // this.setState({pinned_latitude: 0});
    // this.setState({pinned_longitude: 0});

    // const {pinned_lat, pinned_long} = this.props;
    //
    // this.updateState({
    //   latitude: parseFloat(pinned_lat),
    //   longitude: parseFloat(pinned_long),
    // });

    // let latDelta = (location.latitudeDelta) ? location.latitudeDelta:0.003;
    // let longDelta = (location.longitudeDelta) ? location.longitudeDelta:0.003;
    // this.setState({
    //   region: {
    //     latitude: location.latitude,
    //     longitude: location.longitude,
    //     latitudeDelta: latDelta,
    //     longitudeDelta: longDelta,
    //   },
    // });

    this.reverseGeocode(location.latitude, location.longitude);
  }

  updateSelectedLatLong(location) {
    this.setState({
      selectedLatLong: {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
      }
    });
  }

  getCoordsFromName(loc, inputField, inputText) {

    // Alert.alert(JSON.stringify(loc));

    this.props.navigation.setParams({ booking_data_region: null });

    console.log('heeeeeeeeeeeeeeeeelllllooooooooo');
    console.log(loc);
    console.log('heeeeeeeeeeeeeeeeelllllooooooooo');

    this.setState({ pinned_stat: false });
    // alert(this.state.pinned_stat);

    // this.updateSelectedLatLong({
    //   latitude: loc.lat,
    //   longitude: loc.lng,
    // });

    if (inputField === 'from') {

      if (this.props.navigation.getParam('booking_data_from_latlong', null) !== null) {
        this.props.navigation.setParams({ booking_data_from_latlong: null });
        this.props.navigation.setParams({ booking_data_from_lat: null });
        this.props.navigation.setParams({ booking_data_from_long: null });
        this.props.navigation.setParams({ booking_data_from_text: null });
      }

      this.updateState({
        latitude: loc.lat || this.state.set_destination_lat,
        longitude: loc.lng || this.state.set_destination_long,
      });

      this.setState({
        form_from_text: inputText,
        form_from: 'from',
        form_from_latlong: {
          latitude: loc.lat,
          longitude: loc.lng,
        },
      });

      this.setState({
        region: {
          latitude: loc.lat,
          longitude: loc.lng,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015
        }
      });

    } else {
      this.props.navigation.setParams({ booking_data_to_latlong: null });
      this.props.navigation.setParams({ booking_data_to_text: null });
      this.setState({
        form_to_text: inputText,
        form_to: 'to',
        form_to_latlong: {
          latitude: loc.lat,
          longitude: loc.lng,
        },
        set_destination_lat: loc.lat,
        set_destination_long: loc.lng
      });
    }
  }

  onMapRegionChange(region) {
    this.setState({ region });
    // console.log('GETTING NEW REGION');
    // console.log(this.state);
  }

  getDataFromMap(params) {
    // this.setState({ region });
    // console.log('GETTING DSISTSATNCEEEEEEEE');
    // console.log(params);
    this.setState({
      distance: params.distance,
      duration: params.duration,
      height: 500
    });
    // console.log(this.state);
  }
  
  getDataFromMapDriver(params) {
    // this.setState({ region });
    // console.log('params getDataFromMapDriver');
    // console.log(params);
	if(params)
      this.setState({
        distance_from_driver:params.distance,
        duration_from_driver:params.duration,
        // height:500
      });
	  // this.driverSendLocation();
		// additional_field_driver_status USE THIS

  }

  bookNow(e, from, to) {
    // alert(12);
    // this.props.sampleFunction('', '');

    const { state } = this;
    // const { navigation } = this.props;

    // Base fare $2.75 to start $2.25 a mile during regular hours, peek hours and high volume Horus it goes to $3.50 Pick up $3.00 a mile. Traffic congestion rate is $1.00  a minute
    let baseFare = 2.75;
    let baseFarePeekHours = 3.50;

    let payByDistance = baseFare * (state.distance + 1);

    if (typeof (state.chosenDate) === 'undefined') {
      Alert.alert('Please select date of pickup.');
    } else if (typeof (state.chosenTime) === 'undefined') {
      Alert.alert('Please select time of pickup.');
    } else {
      const formData = {
        // chosenDate:state.chosenDate.toString().substr(4, 12),
        chosenDate: state.chosenDate,
        chosenTime: state.chosenTime,
        distance: state.distance,
        duration: state.duration,
        form_from_latlong: state.form_from_latlong,
        form_from_text: state.form_from_text ? state.form_from_text : from,
        form_to_latlong: state.form_to_latlong,
        form_to_text: state.form_to_text ? state.form_to_text : to,
        payByDistance: payByDistance,
        baseFare: baseFare,
      };

      // Actions.payment();

      // NOTE:
      this.props.navigation.navigate('Payment', { params: formData });
      // this.props.navigate('Payment');
      // console.log('Booknow');
      console.log(formData);
      // console.log('state');
      // console.log(state);
      // console.log(state.form_from_latlong);
      // console.log(state.form_from_latlong);
    }
  }

  // testfunction(){
  //   // const { state } = this;
  //   this.props.navigate('Payment');
  //   // alert('asd');
  // }

  setDate(newDate) {
    // console.log('setting');
    const newDate2 = JSON.stringify(newDate);
    this.setState({ chosenDate: newDate2.split('T')[0].substr(1) });
    // console.log(this.state);
    // console.log(newDate);
    //   console.log('settted');
  }

  // how to handle the cases where time is one digit
  makeTwoDigits(time) {
    const timeString = `${time}`;
    if (timeString.length === 2) return time;
    return `0${time}`;
  }

  pad(number, length) {

    var str = '' + number;
    while (str.length < length) {
      str = '0' + str;
    }

    return str;
  }

  tConv24(time24) {
    let hourEnd = time24.indexOf(":");
    let H = +time24.substr(0, hourEnd);
    let h = H % 12 || 12;
    let ampm = (H < 12 || H === 24) ? "AM" : "PM";
    let min = time24.substr(hourEnd + 1, 3);
    if (min < 10) {
      min = "0" + min;
    }
    time24 = this.pad(h, 2) + ":" + min + " " + ampm;

    return time24;
  };

  handleDatePicked = date => {
    // console.log("A date has been picked: ", date);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    this.setState({ chosenTime: this.tConv24(hours + ":" + minutes) });
    // console.log(`${hours}:${minutes}:${seconds}`);
    // console.log('GOT time');
    this.hideDateTimePicker();
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  // get_realtime_booking_status = (id) => {
  //   console.log(`getting freee:`);

  //   this.ref_bookings_status.doc(id).onSnapshot(docSnapshot => {
  //     console.log(`Received doc snapshot:`);
  //     console.log(docSnapshot.data());

  //       // this.setState({
  //       //   testlocation: docSnapshot.data(),
  //       // });
  //       // this.setState({
  //       //   testlocation: doc.data(),
  //       // });
  //       // ...
  //     }, err => {
  //       console.log(`Encountered error: ${err}`);
  //     });
  // };

  render() {

   
    // if (!this.state.is_finish_check_booking_status) {
    //   return (
    //     <CommonProgressBar />
    //   )
    // }


    // return (
    //   <View>
    //     <Button onPress={this.get_realtime_booking_status}>
    //       <Spinner />
    //     </Button>
    //   </View>
    // )
    console.log("MY STATUS startxxx");
    console.log(this.state);
    console.log("MY STATUS end");
	
    // if (!this.state.is_finish_check_booking_status) {
      // return (
        // <CommonProgressBar />
      // )
    // }

    // console.log(this.props);
    // console.log("getting NEW PROPS");
    const { window_height, can_book, pinned_latitude, pinned_longitude, navigation } = this.props;
    // console.log('MapContainer Rendered');
    const { distance, duration } = this.state;

    console.log('boooooooooooking container');
    console.log(navigation.getParam('booking_data_from_latlong', null));
    console.log('boooooooooooking container');

    const set_destination_latlong = {
      latitude: this.state.set_destination_lat,
      longitude: this.state.set_destination_long
    }

    // this.checkBookingStatus();


    // Alert.alert(navigation.getParam('booking_data_from_text', null));

    if (navigation.getParam('booking_data_from_text', null) !== null) {
      this.locationOrigRef.setAddressText(navigation.getParam('booking_data_from_text', null));
      console.log("latttttttttttttttttttttttttttttttttiiiiiiiiiiiiiiiiiiii");
      console.log(navigation.getParam('booking_data_from_latlong', null));
      console.log("latttttttttttttttttttttttttttttttttiiiiiiiiiiiiiiiiiiii");

      // this.reverseGeocode(navigation.getParam('booking_data_from_latlong', null).latitude, navigation.getParam('booking_data_from_latlong', null).longitude);
    } else {
      if (this.state.form_from_text !== null)
        this.locationOrigRef.setAddressText(this.state.form_from_text);
    }

    if (navigation.getParam('booking_data_to_text', null) !== null)
      this.locationDestRef.setAddressText(navigation.getParam('booking_data_to_text', null));
    else {
      if (this.state.form_to_text !== null)
        this.locationDestRef.setAddressText(this.state.form_to_text);
    }
    console.log('STATE BEFORE RENDER');
    console.log(this.state);
    // console.log('PROPS  BEFORE RENDER');
    // console.log(this.props);
    // console.log(this.state.booking_details);
    const marker1 = this.state.is_user_type_ready ? this.state.user != 3 ? this.state.testlocation ? this.state.testlocation : null : null : null;
    // console.log(this.props);

    return (
      <View style={{ flex: 1,height:"100%", backgroundColor: 'red' }}>
        {
        this.state.region.latitude ? (
          <View style={{ flex: 1, backgroundColor: 'blue' }}>
            <MyMapView
              my_latitude={this.state.my_latitude}
              my_longitude={this.state.my_longitude}
              my_latitude_as_rider={this.state.my_latitude_as_rider}
              my_longitude_as_rider={this.state.my_longitude_as_rider}
              marker1={marker1}
              region={navigation.getParam('booking_data_region', null) !== null ? navigation.getParam('booking_data_region', null) : this.state.region}
              //viewed_region={this.state.viewed_region}
              form_from={this.state.booking_details.pickup_latlong ?
                ({
                   latitude: Number(this.state.booking_details.pickup_latlong.split(":")[0]), // Michigan Lat
                   longitude: Number(this.state.booking_details.pickup_latlong.split(":")[1]), // Michigan Long
                 })
                 : ({
                   latitude: 44.3148, // Michigan Lat
                   longitude: -84.506836, // Michigan Long
                 }) }
              form_to= {this.state.booking_details.dropoff_latlong ?
              ({
                  latitude: Number(this.state.booking_details.dropoff_latlong.split(":")[0]), // Michigan Lat
                  longitude: Number(this.state.booking_details.dropoff_latlong.split(":")[1]), // Michigan Long
                })
                : ({
                  latitude: 44.3148, // Michigan Lat
                  longitude: -84.506836, // Michigan Long
                }) }
              // onRegionChange={reg => this.onMapRegionChange(reg)}
              getData={params => this.getDataFromMap(params)}
              getDataDriverLocation={params => this.getDataFromMapDriver(params)}
              geocode_name={navigation.getParam('booking_data_from_text', null) !== null ? navigation.getParam('booking_data_from_text', null) : this.state.geocode_name}
              geocode_lat={navigation.getParam('booking_data_from_lat', null) !== null ? navigation.getParam('booking_data_from_lat', null) : this.state.geocode_lat}
              geocode_long={navigation.getParam('booking_data_from_long', null) !== null ? navigation.getParam('booking_data_from_long', null) : this.state.geocode_long}
              login_id={this.state.login_id}
              pinned_lat={this.props.pinned_latitude}
              pinned_long={this.props.pinned_longitude}
              pinned_stat={this.state.pinned_stat}
              navigation={this.props.navigation}
              driver_location_realtime={this.state.driver_location_realtime}
            />
            {this.state.can_book == true && this.state.is_finish_check_booking_status == true &&
              //  { true &&
              <BottomDrawer
                containerHeight={window_height - 15}
                offset={0}
                startUp={false}
                // downDisplay={0.5}
                backgroundColor='rgba(255, 0, 0, 0)'
              >

                <View style={{
                  zIndex: 1,
                  position: 'absolute',
                  top: 0,
                  flex: 0.4,
                  textAlign: 'center',
                  width: '100%',
                  paddingVertical: 10,
                  paddingHorizontal: 30,
                }}>
                  <View style={{
                    padding: 20,
                    borderRadius: 10,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 5,
                    },
                    shadowOpacity: 0.34,
                    shadowRadius: 6.27,
                    elevation: 10,
                    backgroundColor: 'white',
                  }}>

                    <Text
                      style={{
                        width: '100%',
                        height: 3,
                        textAlign: 'center',
                        position: 'relative',
                        bottom: 10,
                      }}>
                      <Text style={{
                        width: 100,
                        backgroundColor: 'black',
                      }}>____
                      </Text>
                    </Text>
                    <Text style={{
                      width: '100%',
                      textAlign: 'left',
                      fontWeight: 'bold',
                      fontSize: 20,
                      marginBottom: 15
                    }}>
                      {this.state.is_user_type_ready ? ('Where are you going?') : ('__')}
                    </Text>
                    <Label>Pickup</Label>
                    <KeyboardAvoidingView
                      behavior="padding"
                    >
                      <GooglePlacesAutocomplete
                        // textInputProps={{
                        //     onChangeText: (loc) => this.setState({set_destination_name: loc})
                        // }}
                        ref={(instance) => this.locationOrigRef = instance}
                        placeholder={'Enter pickup location'}
                        minLength={2}
                        autoFocus={false}
                        returnKeyType={'search'}
                        listViewDisplayed={false}
                        fetchDetails={true}
                        onPress={(data, details = null) => {
                          //'details' is provided when fetchDetails = true
                          this.getCoordsFromName(details.geometry.location, 'from', data.description);
                          // this.props.notifyChange(details.geometry.location,data.description);
                          // console.log(data);
                          // console.log(details);
                          // console.log('what a life');
                          // Alert.alert('input');
                        }
                        }
                        query={{
                          key: 'AIzaSyC8lpkvXFDua9S2al669zfwz7GSkeVFWs4',
                          language: 'en'
                        }}
                        nearbyPlacesAPI='GooglePlacesSearch'
                        debounce={200}
                        styles={{
                          textInputContainer: {
                            backgroundColor: 'white',
                            borderTopWidth: 0,
                            borderBottomWidth: 0,
                            position: 'relative',
                          },
                          padding: {
                            padding: 20
                          },
                          textInput: {
                            borderRadius: 0,
                            paddingLeft: 10,
                          },
                          description: {
                            fontWeight: 'bold'
                          },
                          predefinedPlacesDescription: {
                            color: 'red'
                          },
                          listView: {
                            // backgroundColor: 'white',
                            // position: 'absolute',
                            // bottom: 30,
                            // border:1,
                            // padding:3,
                            // zIndex:9999,
                          }
                        }}
                      />

                    </KeyboardAvoidingView>
                    {/*<MapInput notifyChange={(loc,loc_text) => this.getCoordsFromName(loc,'from',loc_text)} latlong={navigation.getParam('booking_data_from_latlong', this.state.form_from_latlong)} loc_to_text={false} loc_from_text={this.state.form_from_text} placeholder='Enter pickup location.'/>*/}
                    <View
                      style={{
                        borderBottomColor: '#d9d9d9',
                        borderBottomWidth: 2,
                      }}
                    />
                    <Label>Drop-Off</Label>
                    <KeyboardAvoidingView
                      behavior="padding"
                    >
                      <GooglePlacesAutocomplete
                        // textInputProps={{
                        //     onChangeText: (loc) => this.setState({set_destination_name: loc})
                        // }}
                        ref={(instance2) => this.locationDestRef = instance2}
                        placeholder={'Enter drop-off location'}
                        minLength={2}
                        autoFocus={false}
                        returnKeyType={'search'}
                        listViewDisplayed={false}
                        fetchDetails={true}
                        onPress={(data, details = null) => {
                          //'details' is provided when fetchDetails = true
                          this.getCoordsFromName(details.geometry.location, 'to', data.description);
                          // this.props.notifyChange(details.geometry.location,data.description);
                          // console.log(data);
                          // console.log(details);
                          // console.log('what a life');
                          // Alert.alert('input');
                        }
                        }
                        query={{
                          key: 'AIzaSyC8lpkvXFDua9S2al669zfwz7GSkeVFWs4',
                          language: 'en'
                        }}
                        nearbyPlacesAPI='GooglePlacesSearch'
                        debounce={200}
                        styles={{
                          textInputContainer: {
                            backgroundColor: 'white',
                            borderTopWidth: 0,
                            borderBottomWidth: 0,
                            position: 'relative',
                          },
                          padding: {
                            padding: 20
                          },
                          textInput: {
                            borderRadius: 0,
                            paddingLeft: 10,
                          },
                          description: {
                            fontWeight: 'bold'
                          },
                          predefinedPlacesDescription: {
                            color: 'red'
                          },
                          listView: {
                            // backgroundColor: 'white',
                            // position: 'absolute',
                            // bottom: 30,
                            // border:1,
                            // padding:3,
                            // zIndex:9999,
                          }
                        }}
                      />

                    </KeyboardAvoidingView>
                    {
                      /*<MapInput notifyChange={(loc,loc_text) => this.getCoordsFromName(loc,'to',loc_text)} latlong={navigation.getParam('booking_data_to_latlong', set_destination_latlong)} loc_from_text={false} loc_to_text={this.state.form_to_text} placeholder='Enter drop-off location' />*/
                    }
                    {true ? (
                      // {distance ?(
                      <Form>
                        <View
                          style={{
                            borderBottomColor: '#d9d9d9',
                            borderBottomWidth: 2,
                            marginTop: 20,
                            marginLeft: -20,
                            marginRight: -20,
                          }}
                        />
                        <View style={{ display: 'flex', flexDirection: 'row', marginTop: 20 }}>
                          <View style={{ width: '55%' }}>
                            <Label style={{ marginTop: 0 }}>Pickup Date</Label>
                            <DatePicker
                              defaultDate={new Date().getFullYear()}
                              minimumDate={new Date(2018, 1, 1)}
                              locale={"en"}
                              modalTransparent={false}
                              animationType={"fade"}
                              androidMode={"default"}
                              placeHolderText="Select date"
                              textStyle={{ color: "black", border: 1, fontSize: 18 }}
                              placeHolderTextStyle={{ color: "#d3d3d3" }}
                              onDateChange={(e) => this.setDate(e)}
                              disabled={false}
                              minimumDate={new Date()}
                            />
                          </View>
                          <View style={{ width: '45%' }}>
                            <Label>Pickup Time</Label>
                            <Text onPress={this.showDateTimePicker} style={{
                              marginLeft: 10,
                              marginTop: 10,
                              textAlign: 'left',
                            }}>{this.state.chosenTime ? this.state.chosenTime : '00:00 AM'}</Text>
                            <DateTimePicker
                              mode='time'
                              isVisible={this.state.isDateTimePickerVisible}
                              onConfirm={this.handleDatePicked}
                              onCancel={this.hideDateTimePicker}
                            />
                          </View>
                        </View>
                        <Button
                          style={{ marginTop: 30 }}
                          onPress={(e) => this.bookNow(e, navigation.getParam('booking_data_from_text', null) !== null ? navigation.getParam('booking_data_from_text', null) : this.state.form_from_text, navigation.getParam('booking_data_to_text', null) ? navigation.getParam('booking_data_to_text', null) : this.state.form_to_text)}
                        >
                          <Text style={{
                            width: '100%',
                            textAlign: 'center',
                          }}>Book Now</Text>
                        </Button>
                      </Form>
                    ) : null}
                  </View>
                </View>
              </BottomDrawer>
              // )
            }

            {this.state.can_book == false && this.state.is_finish_check_booking_status == true &&
              // THIS CHECKS IF NAA PASYAY PENDING BOOKING
              //{ true &&
              //&& can_book == false 

              <BottomDrawer
                containerHeight={500}
                offset={100}
                startUp={false}
                // downDisplay={0.5}
                backgroundColor='rgba(255, 0, 0, 0)'
              >

                <View style={{
                  zIndex: 1,
                  position: 'absolute',
                  top: 0,
                  flex: 0.4,
                  textAlign: 'center',
                  width: '100%',
                  paddingVertical: 10,
                  paddingHorizontal: 30,
                }}>
                  <View style={{
                    padding: 20,
                    borderRadius: 10,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 5,
                    },
                    shadowOpacity: 0.34,
                    shadowRadius: 6.27,
                    elevation: 10,
                    backgroundColor: 'white',
                  }}>
                    {
                      // <Button onPress={this.testfunction} >
                      //   <Text>Click Me!</Text>
                      // </Button>
                    }
                    <Text
                      style={{
                        width: '100%',
                        height: 3,
                        textAlign: 'center',
                        position: 'relative',
                        bottom: 8,
                      }}>
                      <Text style={{
                        width: 100,
                        // backgroundColor:'black',
                      }}>____
                    </Text>
                    </Text>
                    <View style={{
                      flex: 1,
                      flexDirection: 'row',
                      // backgroundColor:'blue',
                      textAlign: 'center',
                      padding: 10,
                    }}>
                      <View style={{
                        // alignItems: 'center',
                        // justifyContent: 'center',
                        // backgroundColor:'red',
                        padding: 5,
                        textAlign: 'center',
                      }}>
                        {
                          (<Thumbnail
                            source={require('../assets/images/avatar.png')} />
                          )
                          /*this.state.user.user_type_id == 3 ? null: !can_book || !this.state.can_book ?(
                              <Thumbnail
                                source={{uri: `data:image/gif;base64,${this.state.driver_details.photo}` }} />
                              ):(
                              <Thumbnail
                                source={require('../assets/images/avatar.png')} />
                              )
                           */
                        }
                      </View>
                      <View style={{
                        // backgroundColor:'green',
                        textAlign: 'left',
                        // width:'100%',
                        // margin: 10,
                        padding: 5,
                        flex: 1,
                        justifyContent: 'flex-start'
                      }}>

                        {
                          // can_book || this.state.can_book ?(
                          <>
                            <Text note>
                              {"Your driver"}
                            </Text>
                            <Text>
                              {
                                !this.state.driver_details.first_name ? "Not Yet Available." : this.state.driver_details.first_name + " " + this.state.driver_details.last_name
                              }
                            </Text>
                            <Text>{this.state.driver_details.email}</Text>
                            
                          </>
                          // ):(
                          //   <>
                          //     <Text>Driver Name</Text>
                          //     <Text note>Other information</Text>
                          //   </>
                          // )
                        }
                      </View>
                    </View>
                    <View>
                      <Text>
                        {
                          this.state.duration_from_driver?
                          this.state.duration_from_driver:""
                        } 
                      </Text>
                      <Text>
                        {
                          this.state.distance_from_driver?
                          this.state.distance_from_driver:""
                        } 
                      </Text>
                    </View>
                    <View
                      style={styles.hr}
                    />
                    <Text style={styles.label1}>
                      Pickup
                  </Text>
                    <Text>
                      {this.state.booking_details.pickup_location}
                      {"\n"}
                    </Text>
                    <View
                      style={{
                        borderBottomColor: '#d9d9d9',
                        borderBottomWidth: 2,
                      }}
                    />
                    <Text style={styles.label1}>
                      {"\n"}
                      Drop-Off
                    </Text>
                    <Text>
                      {this.state.booking_details.dropoff_location}
                    </Text>
                  </View>
                </View>
              </BottomDrawer>
            }
          </View>
        ) : null
        }
      </View>
    );
  }
}

// export default MapContainer;
function mapStateToProps(state) {
  return {
  }
}
function mapActionsToDispatch(dispatch) {
  return bindActionCreators({
    sampleFunction: sampleFunction,
  }, dispatch)
}
export default connect(mapStateToProps, mapActionsToDispatch)(MapContainer);