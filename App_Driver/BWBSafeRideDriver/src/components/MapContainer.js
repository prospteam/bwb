import React from 'react';
import { Image, View, KeyboardAvoidingView, Alert, TouchableOpacity } from 'react-native';
import { Button, Text, Input, Form, Item, Label, DatePicker,Thumbnail, Left, Body, Spinner } from 'native-base';
import MapInput from './MapInput';
import MyMapView from './MyMapView';
import { getLocation } from './getLocation';
import {Actions} from 'react-native-router-flux';
import DateTimePicker from "react-native-modal-datetime-picker";
import BottomDrawer from 'rn-bottom-drawer';
import styles from '.././assets/my_styles.js';
import Helpers from '../../Helpers';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import firebase from './common/Firebase';
import CommonProgressBar from './common/CommonProgressBar';
// import Geolocation from "@react-native-community/geolocation";


// redux 
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DRIVER_LOCATION_CHANGE } from '../redux/actions/index.js';
// I included ang "index.js" para di malibog

const sample_img_link = 'http://web2.proweaverlinks.com/tech/bwbsafe/backend_web_api/assets/images/sample.png';

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
        testlocation:null,
        is_finish_check_booking_status:false,
        is_user_type_ready:false,
        user_data:null,
        driver_details:[],
        rider_details:[],
        distance:0,
        duration:0,
        my_latitude:0,
        my_longitude:0,
        can_book:false,
        isDateTimePickerVisible: false,
        region: {
          latitude: 44.3148, // Michigan Lat
          longitude: -84.506836, // Michigan Long
          latitudeDelta: 3,
          longitudeDelta: 3,
        },
        geocode_name: null,
        geocode_lat: null,
        geocode_long: null,
        login_id: null,
        booking_details:[],
        pinned_stat: false,
        my_latitude_as_rider: 0,
        my_longitude_as_rider: 0,
        // form_from_latlong: null,
        set_destination_lat: this.props.set_destination_lat,
        set_destination_long: this.props.set_destination_long,
        form_from_text: null,
        booking_details_ready:null,
        form_to_text: null,
        textValue: "Going to Pick-up Location",
        disabledBotton: false,
        loadingBar: ''
        // pinned_latitude: 0,
        // pinned_longitude: 0
    };

    componentWillReceiveProps(nextProps, nextState){
        const {navigation} = this.props;

        if(navigation.getParam('booking_data_from_latlong', null) !== null){
              this.updateState({
                latitude: navigation.getParam('booking_data_from_latlong', null).latitude,
                longitude: navigation.getParam('booking_data_from_latlong', null).longitude,
              });
              // this.reverseGeocode(navigation.getParam('booking_data_from_latlong', null).latitude, navigation.getParam('booking_data_from_latlong', null).longitude);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const {navigation} = this.props;

        if(this.state.geocode_lat !== prevState.geocode_lat){
            if(navigation.getParam('booking_data_from_text', null) !== null){
                  this.setState({geocode_name: navigation.getParam('booking_data_from_text', null)});
                  this.setState({geocode_lat: navigation.getParam('booking_data_from_latlong', null).latitude});
                  this.setState({geocode_long: navigation.getParam('booking_data_from_latlong', null).longitude});
            }
        }


        if(prevProps.set_destination_lat !== this.props.set_destination_lat) {
            fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.props.set_destination_lat + ',' + this.props.set_destination_long + '&key=' + GOOGLE_MAPS_APIKEY)
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({set_destination_lat: this.props.set_destination_lat,
                        form_to_text: responseJson.results[0].formatted_address,
                        form_to:'to',
                        form_to_latlong:{
                        latitude: this.props.set_destination_lat,
                        longitude: this.props.set_destination_long
                    }});
               });
        }

        if(prevProps.set_destination_long !== this.props.set_destination_long) {
            fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.props.set_destination_lat + ',' + this.props.set_destination_long + '&key=' + GOOGLE_MAPS_APIKEY)
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({set_destination_long: this.props.set_destination_long,
                        form_to_text: responseJson.results[0].formatted_address,
                        form_to:'to',
                        form_to_latlong:{
                        latitude: this.props.set_destination_lat,
                        longitude: this.props.set_destination_long
                    }});
               });
        }

        // if(prevProps.loc_to_text !== this.props.loc_to_text) {
        //     this.locationDestRef.setAddressText(this.props.loc_to_text);
        // }

        if(prevProps.latlong !== this.props.latlong) {

            for(var key in this.props.latlong) {
                if(this.props.latlong.hasOwnProperty(key)) {
                    var latitude = this.props.latlong['latitude'];
                    var longitude = this.props.latlong['longitude'];
                }
            }
        }
    }

  watchID: ?number = null;

  constructor(props) {
    super(props);

    console.log('cjheclomng props');
    console.log(props);
    // console.error(JSON.parse(AsyncStorage.getItem('userData')));

    this.ref = firebase.firestore().collection('driver_location_logs');
    this.ref_bookings_status = firebase.firestore().collection('bookings_status');

      // console.log('LOEDDEDDDD1');

    // Alert.alert("Watch Position");

    Geolocation.getCurrentPosition(
      position => {
        const initialPosition = JSON.stringify(position);
        // this.setState({initialPosition});
        console.log(initialPosition);
      },
      error => console.log('Error', JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000},
    );

    this.watchID = Geolocation.watchPosition((position) => {
      //const lastPosition = JSON.stringify(position);
      //this.setState({lastPosition});
      console.log("position pdatedddssd");
      console.log(position.coords);
      props.DRIVER_LOCATION_CHANGE(position.coords);

        this.setState({
            region: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta:  0.015,
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

           //this.driverSendLocation();

    // if (this.state.booking_details) {

      // this.ref.onSnapshot(this.driverLocationListener);

    // }

    const {pinned_stat, navigation} = this.props;

    // if(navigation.getParam('booking_data_from_latlong', null) !== null){
    //       this.updateState({
    //         latitude: navigation.getParam('booking_data_from_latlong', null).latitude,
    //         longitude: navigation.getParam('booking_data_from_latlong', null).longitude,
    //       });
    //       // this.reverseGeocode(navigation.getParam('booking_data_from_latlong', null).latitude, navigation.getParam('booking_data_from_latlong', null).longitude);
    // }

    this.setState({pinned_stat: pinned_stat});

    AsyncStorage.getItem("userData", (errs,result) => {
       if (!errs) {
           if (result !== null) {
               // this.setState({activeID:result});
               let res = JSON.parse(result);
               this.setState({
                 user_data: res,
                 is_user_type_ready:true,
               });
               // console.error(res);

               // Alert.alert('USER READY');
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

  driverLocationListener = (querySnapShot) => {
    // const books = [];
    // // console.log("FAYR");
    // // console.log(querySnapShot);
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

    this.ref.doc(this.state.booking_details.booking_id).onSnapshot(docSnapshot => {
      console.log(`Received doc snapshot:`);
      console.log(docSnapshot);

        this.setState({
          testlocation: docSnapshot.data(),
        });
          // this.setState({
          //   testlocation: doc.data(),
          // });
      // ...
    }, err => {
      console.log(`Encountered error: ${err}`);
    });
  }


  riderGetCurrentLocation(){
    // geolocation.getCurrentPosition(geo_success, [geo_error], [geo_options]); // FUNCTION PARAMETER

      const watchId = Geolocation.getCurrentPosition(
        pos => {
          console.log("Get initial location");
          this.setState({
            my_latitude_as_rider: pos.coords.latitude,
            my_longitude_as_rider: pos.coords.longitude,
          });
        },
        e => setError(e.message+"ERRRORR NOOOOO")
      );

  }

  driverSendLocation(){
    geolocation.getCurrentPosition(geo_success, [geo_error], [geo_options]);
    
    const watchId = Geolocation.watchPosition(
      pos => {
        console.log("GETTINGS");
        // console.log(newCoordinate);
        // setError("");
        this.setState({
          my_latitude: pos.coords.latitude,
          my_longitude: pos.coords.longitude,
        });

        if (this.state.booking_details){
          const ref_single = this.ref.doc(this.state.booking_details.booking_id);
          ref_single.get()
            .then((docSnapshot) => {
                if (this.state.login_id) {
                  if (docSnapshot.exists) {
                      ref_single.update({
                        // booking_id:this.state.booking_details.booking_id,
                        booking_id:0,
                        driver_id:this.state.login_id,
                        latitude:pos.coords.latitude,
                        longitude:pos.coords.longitude,
                      })
                      .catch(function(error) {
                          console.error("Error adding document: ", error);
                      });
                  } else {
                    ref_single.set({
                      // booking_id:this.state.booking_details.booking_id,
                      booking_id:0,
                      driver_id:this.state.login_id,
                      latitude:pos.coords.latitude,
                      longitude:pos.coords.longitude,
                    })
                    .catch(function(error) {
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
      e => setError(e.message+"ERRRORR NOOOOO")
    );

  }

  reverseGeocode(latitude, longitude){
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + latitude + ',' + longitude + '&key=' + GOOGLE_MAPS_APIKEY)
        .then((response) => response.json())
        .then((responseJson) => {
            const data = {
                // user_id: this.state.userid,
                latitude: latitude,
                longitude: longitude,
                location_name: responseJson.results[0].formatted_address
            }
            this.setState({geocode_name: responseJson.results[0].formatted_address});
            this.setState({geocode_lat: latitude});
            this.setState({geocode_long: longitude});

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

    const data = JSON.parse(await AsyncStorage.getItem('userData'));

    // console.log(data);
    // console.log('DATA');

    // // user_type

    // fetch(Helpers.ci_url+'booking/user_booking_status/'+data.login_id, {
    // method: 'GET',
    // headers: {
    //   'Accept': 'application/json',
    //   'Content-Type': 'application/json',
    // }
    // }).then((response) => response.json())
    // .then((responseJson) => {
    //   console.log('getting API');
    //   console.log(responseJson);
    //   if(responseJson.num_of_active_booking > 0){
    //     this.setState({
    //       can_book:true,
    //       driver_details:responseJson.driver_details,
    //       booking_details:responseJson.booking_details,
    //     });
    //   }else{
    //     this.setState({
    //       can_book:false,
    //       driver_details:[],
    //       booking_details:[],
    //     });
    //   }
    // }).catch((error) => {
    //   console.log('NOT getting API');
    //   // console.error(error);
    // });
    //   // this.setState({ region });
    //   // console.log('GETTING DSISTSATNCEEEEEEEE');
    //   // console.log(params);
    //   //   this.setState({
    //   //     distance:params.distance,
    //   //     duration:params.duration,
    //   //     height:500
    //   //   });
    this.setState({login_id: data.login_id});
    // console.log(Helpers.ci_url+'booking/user_boonotifyChangeking_status/'+data.login_id);
    console.log(Helpers.ci_url+'booking/user_booking_status/'+data.login_id);
    console.log('checkBookingStatus');

  fetch(Helpers.ci_url+'booking/user_booking_status/'+data.login_id, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
   }).then((response) => response.json())
     .then((responseJson) => {
       console.log('getting API');
       console.log(responseJson);
        if(responseJson.num_of_active_booking > 0){
          // msg = responseJson.msg;
          console.log(responseJson.booking_details.booking_status);
          let textVal = '';
          if(responseJson.booking_details.booking_status == "pending"){
               textVal = "Going to pick up location";
          }else if (responseJson.booking_details.booking_status == "inprogress") {
			  if(responseJson.booking_details.additional_field_driver_status=="going_drop"){
				  
               textVal = "Ride completed";
			  }else{
               textVal = "Going to drop off location";
				  
			  }
          }else if(responseJson.booking_details.booking_status == "completed"){
               textVal = "Ride completed";
          }

          console.log("textVal");
          console.log(textVal);

          this.setState({
            can_book:false,
            rider_details:responseJson.rider_details,
            driver_details:responseJson.driver_details,
            booking_details:responseJson.booking_details,
             textValue: textVal
          });
// this.state.user.user_type_id
          console.log('LOEDDEDDDD2');
          // this.ref.onSnapshot(this.driverLocationListener);

        }else{
          console.log('LOEDDEDDDD444444444');
          this.setState({
            can_book:true,
            driver_details:[],
            booking_details:[],
          });
        }

        this.setState({
          booking_details_ready:true,
        });

     }).catch((error) => {
       console.log('NOT getting API');
		// console.error(error);
		Alert.alert('Not Able to connect to server');
     });

     this.setState({
      is_finish_check_booking_status:true,
    });
    // this.setState({ region });
    // console.log('GETTING DSISTSATNCEEEEEEEE');
    // console.log(params);
    //   this.setState({
    //     distance:params.distance,
    //     duration:params.duration,
    //     height:500
    //   });
      // console.log(this.state);
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
      console.log('Error:'+err.message);
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
      selectedLatLong:{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
      }
    });
  }

  getCoordsFromName(loc,inputField, inputText) {

      // Alert.alert(JSON.stringify(loc));

      this.props.navigation.setParams({booking_data_region: null});

      console.log('heeeeeeeeeeeeeeeeelllllooooooooo');
      console.log(loc);
      console.log('heeeeeeeeeeeeeeeeelllllooooooooo');

    this.setState({pinned_stat: false});
    // alert(this.state.pinned_stat);

    // this.updateSelectedLatLong({
    //   latitude: loc.lat,
    //   longitude: loc.lng,
    // });

    if (inputField==='from') {
        this.props.navigation.setParams({booking_data_from_latlong: null});
        this.props.navigation.setParams({booking_data_from_text: null});

        this.updateState({
          latitude: loc.lat || this.state.set_destination_lat,
          longitude: loc.lng || this.state.set_destination_long,
        });

      this.setState({
        form_from_text:inputText,
        form_from:'from',
        form_from_latlong:{
          latitude: loc.lat,
          longitude: loc.lng,
        },
      });

      this.setState({region: {
          latitude: loc.lat,
          longitude: loc.lng,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015
      }});

    }else{
         this.props.navigation.setParams({booking_data_to_latlong: null});
         this.props.navigation.setParams({booking_data_to_text: null});
      this.setState({
        form_to_text:inputText,
        form_to:'to',
        form_to_latlong:{
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
        distance:params.distance,
        duration:params.duration,
        height:500
      });
      // console.log(this.state);
  }

  // testChange = () =>{
  //     this.setState({
  //         textValue: 'test',
  //
  //     })
  // }

  bookNow(e, from, to){
    const { state } = this;
    // const { navigation } = this.props;

    // Base fare $2.75 to start $2.25 a mile during regular hours, peek hours and high volume Horus it goes to $3.50 Pick up $3.00 a mile. Traffic congestion rate is $1.00  a minute
    let baseFare = 2.75;
    let baseFarePeekHours = 3.50;

    let payByDistance = baseFare*(state.distance+1);

    if(typeof(state.chosenDate) === 'undefined'){
        Alert.alert('Please select date of pickup.');
    }else if(typeof(state.chosenTime) === 'undefined'){
        Alert.alert('Please select time of pickup.');
    }else{
        const formData = {
          // chosenDate:state.chosenDate.toString().substr(4, 12),
          chosenDate:state.chosenDate,
          chosenTime:state.chosenTime,
          distance:state.distance,
          duration:state.duration,
          form_from_latlong:state.form_from_latlong,
          form_from_text:state.form_from_text ? state.form_from_text: from,
          form_to_latlong:state.form_to_latlong,
          form_to_text:state.form_to_text ? state.form_to_text: to,
          payByDistance:payByDistance,
        };

        // Actions.payment();

        // NOTE:
        this.props.navigation.navigate('Payment',{params:formData});
        // this.props.navigate('Payment');
        // console.log('Booknow');
        console.log(formData);
        // console.log('state');
        // console.log(state);
        // console.log(state.form_from_latlong);
        // console.log(state.form_from_latlong);
    }
  }
  async testfunction(id){
      alert();
       // const data = JSON.parse(await AsyncStorage.getItem('userData'));

       // console.log('ididididi');
       // console.log(id);


      fetch(Helpers.api_url+'update_location_status/'+id+'/pending', {
           method: 'GET',
           headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json',
           }

      }).then( (response) => {
          console.log("response XCFXFXDFFXD");
          console.log(response);
          // return response.json();
      }).then( (response) => {
          console.log("22222response XCFXFXDFFXD");
          console.log(response);
          // return response.json();
      });
       // .then((responseJson) => {
       //   console.log('getting API');
       //   console.log(responseJson);
       // }).catch((error) => {
       //
       //   console.log('JOren Error');
       //   // console.error(error);
       // });

  }

  setDate(newDate) {
    // console.log('setting');
    const newDate2 = JSON.stringify(newDate);
    this.setState({ chosenDate: newDate2.split('T')[0].substr(1) });
    // console.log(this.state);
    // console.log(newDate);
    //   console.log('settted');
  }

  // how to handle the cases where time is one digit
  makeTwoDigits (time) {
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
      if(min < 10){
          min = "0" + min;
      }
      time24 = this.pad(h, 2) + ":" + min + " " + ampm;

      return time24;
  };

  testfunction1 = (id) => {
      console.log("XDD");
        console.log(Helpers.api_url+'update_location_status/'+id+'/pending');
          fetch(Helpers.api_url+'update_location_status/'+id+'/pending', {
               method: 'GET',
               headers: {
                 'Accept': 'application/json',
                 'Content-Type': 'application/json',
               }

          }).then( (response) => {
              console.log("response XCFXFXDFFXD");
              console.log(response);
              // return response.json();
          }).then( (response) => {
              console.log("22222response XCFXFXDFFXD");
              console.log(response);
              // return response.json();
          });

  };

  changFunction = (id) => {
      // console.log(this.state.login_id);
      // console.log("XDD");
       this.setState({disabledBotton: true});
      console.log(this.state.disabledBotton);
      console.log('testssss');
      console.log(this.state.textValue);

      console.log('id');
      console.log(this.state.booking_details.booking_id);

      let  status = "";
      let  additional_field_driver_status = "";

      if(this.state.textValue == "Going to pick up location"){
          status = "inprogress";
          additional_field_driver_status = "going_pick";
          console.log('pick up');
      }else if (this.state.textValue == "Going to drop off location") {
          console.log('drop off');
          status = "inprogress";
          additional_field_driver_status = "going_drop";
      }else if (this.state.textValue == "Ride Complete"){
          status = "completed";
          additional_field_driver_status = "completed";
      }

      console.log('statusxxxxx');
      console.log(status);
      console.log(Helpers.api_url+'update_location_status/'+id+'/'+status+'/'+additional_field_driver_status);

          fetch(Helpers.api_url+'update_location_status/'+id+'/'+status+'/'+additional_field_driver_status, {
               method: 'GET',
               headers: {
                 'Accept': 'application/json',
                 'Content-Type': 'application/json',
               }

          }).then( (response) => {
              console.log("response YYYYYY");
              console.log(response);
               // this.setState({textValue:'On the way to Drop-Off'});

               if(this.state.textValue == "Going to pick up location"){
                   this.setState({textValue:'Going to drop off location'});
                   this.setState({disabledBotton: false});
               }else if (this.state.textValue == 'Going to drop off location') {
                   this.setState({textValue:'Ride Complete'});
                   this.setState({disabledBotton: false});
               }else if (this.state.textValue == 'Ride Complete') {
                   this.setState({disabledBotton: false});
                   this.props.navigation.navigate("Bookings");
               }

                 const ref_single = this.ref_bookings_status.doc(id+"");
                 ref_single.get()
                   .then((docSnapshot) => {
                       // if (this.state.login_id) {
                         if (docSnapshot.exists) {
                             console.log("Naa unta peru wala diay: ");
                             ref_single.update({
                               "booking_status":status,
                               "additional_field_driver_status":additional_field_driver_status,
                             })
                             .catch(function(error) {
                                 console.error("Error adding document: ", error);
                             });
                         } else {
                           ref_single.set({
                               "booking_status":status,
                               "additional_field_driver_status":additional_field_driver_status,
                           })
                           .catch(function(error) {
                               console.error("Error adding document: ", error);
                           });
                         }
                       // }
                 });
              // return response.json();
              // console.log('disable false');
              // console.log(this.state.disabledBotton);
          }).then( (response) => {
              console.log("22222response XCFXFXDFFXD");
              console.log(response);
              // return response.json();
          }).catch( (err) => {
              console.log("22222response errrr");
              console.log(err);
              // return response.json();
          });

           //this.setState({textValue:'On the way tp Drop-Off'});
           // console.log('enable');
           // this.setState({disabledBotton: false});
           // console.log(this.state.disabledBotton);
  }

  handleDatePicked = date => {
    // console.log("A date has been picked: ", date);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    this.setState({ chosenTime: this.tConv24(hours+":"+minutes) });
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

  render() {
    // if (true){
    //   <CommonProgressBar/>
    // }

    console.log("MY STATUS");
    console.log(this.state.booking_details);
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


    // Alert.alert(navigation.getParam('booking_data_from_text', null));

    if(navigation.getParam('booking_data_from_text', null) !== null){
          this.locationOrigRef.setAddressText(navigation.getParam('booking_data_from_text', null));
          console.log("latttttttttttttttttttttttttttttttttiiiiiiiiiiiiiiiiiiii");
          console.log(navigation.getParam('booking_data_from_latlong', null).latitude);
          console.log("latttttttttttttttttttttttttttttttttiiiiiiiiiiiiiiiiiiii");

          // this.reverseGeocode(navigation.getParam('booking_data_from_latlong', null).latitude, navigation.getParam('booking_data_from_latlong', null).longitude);
    }else{
        if(this.state.form_from_text !== null)
            this.locationOrigRef.setAddressText(this.state.form_from_text);
    }

    if(navigation.getParam('booking_data_to_text', null) !== null)
        this.locationDestRef.setAddressText(navigation.getParam('booking_data_to_text', null));
    else{
        if(this.state.form_to_text !== null)
          this.locationDestRef.setAddressText(this.state.form_to_text);
    }
    console.log('finding location');
    // console.log(this.state);
    console.log(this.state.booking_details.pickup_latlong);
    console.log(this.state.booking_details.dropoff_latlong);
    console.log('finding last');
    // console.log(this.state.booking_details);
    const marker1 = this.state.is_user_type_ready ? this.state.user_data != 3 ? this.state.testlocation ? this.state.testlocation : null :null:null;
    // console.log(this.props);

    return (

      <View style={{ flex: 1,  backgroundColor:'red'}}>
        {this.state.region.latitude ? (
          <View style={{ flex: 1, backgroundColor:'blue' }}>
            <MyMapView
              my_latitude={this.state.my_latitude}
              my_longitude={this.state.my_longitude}
              my_latitude_as_rider={this.state.my_latitude_as_rider}
              my_longitude_as_rider={this.state.my_longitude_as_rider}
              marker1={marker1}
              region={navigation.getParam('booking_data_region', null) !== null ? navigation.getParam('booking_data_region', null) : this.state.region}
              viewed_region={this.state.viewed_region}
              form_from={navigation.getParam('booking_data_from_latlong', null) !== null ? navigation.getParam('booking_data_from_latlong', null) : this.state.form_from_latlong}
              form_to={navigation.getParam('booking_data_to_latlong', null) !== null ? navigation.getParam('booking_data_to_latlong', null) : set_destination_latlong}
              form_from={this.state.booking_details.pickup_latlong ?
                 ({
                    latitude: Number(this.state.booking_details.pickup_latlong.split(":")[0]), // Michigan Lat
                    longitude: Number(this.state.booking_details.pickup_latlong.split(":")[1]), // Michigan Long
                  })
                  : ({
                    latitude: 0, // Michigan Lat
                    longitude: 1, // Michigan Long
                    // latitude: 44.3148, // Michigan Lat
                    // longitude: -84.506836, // Michigan Long
                  }) }
              // form_to= {this.state.booking_details.dropoff_latlong ? this.state.booking_details.dropoff_latlong :  0}
              // form_from={{
              //   latitude: 44.3148, // Michigan Lat
              //   longitude: -84.506836, // Michigan Long
              // }}
              form_to= {this.state.booking_details.dropoff_latlong ?
                ({
                   latitude: Number(this.state.booking_details.dropoff_latlong.split(":")[0]), // Michigan Lat
                   longitude: Number(this.state.booking_details.dropoff_latlong.split(":")[1]), // Michigan Long
                 })
                 : ({
                   latitude: 0, // Michigan Lat
                   longitude: 1, // Michigan Long
                   // latitude: 44.3148, // Michigan Lat
                   // longitude: -84.506836, // Michigan Long
                 }) }
              selectedLatLong={this.state.selectedLatLong}
              // onRegionChange={reg => this.onMapRegionChange(reg)}
              getData={params => this.getDataFromMap(params)}
              geocode_name={this.state.geocode_name}
              geocode_lat={this.state.geocode_lat}
              geocode_long={this.state.geocode_long}
              login_id={this.state.login_id}
              pinned_lat={this.props.pinned_latitude}
              pinned_long={this.props.pinned_longitude}
              pinned_stat={this.state.pinned_stat}
              navigation={this.props.navigation}
            />
            {
            // true ? null
            !this.state.user_data || !this.state.booking_details_ready? null
            // this.state.user_data == false || this.state.booking_details != []? null
            // : (false) ?(
            // : (true) ?this.props.navigation.navigate('Bookings'):(
            : (can_book || this.state.can_book) ?this.props.navigation.navigate('Bookings'):(
            // : (!(can_book || this.state.can_book) && this.state.booking_details != [] ) ?(
            <>
              {
                // <Left>
                // <Thumbnail source={{uri: sample_img_link}} />
                //   <Body>
                //     <Text>NativeBase</Text>
                //     <Text note>April 15, 2016</Text>
                //   </Body>
                // </Left>
              }
              <BottomDrawer
                containerHeight={500}
                offset={100}
                startUp={false}
                // downDisplay={0.5}
                backgroundColor='rgba(255, 0, 0, 0)'
              >
                <View style={{
                  zIndex:1,
                  position: 'absolute',
                  top:0,
                  flex: 0.4,
                  textAlign:'center',
                  width:'100%',
                  paddingVertical: 10,
                  paddingHorizontal: 30,
                }}>
                <View style={{
                  padding:20,
                  borderRadius:10,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 5,
                  },
                  shadowOpacity: 0.34,
                  shadowRadius: 6.27,
                  elevation: 10,
                  backgroundColor:'white',
                }}>
                {
                  // <Button onPress={this.testfunction} >
                  //   <Text>Click Me!</Text>
                  // </Button>
                  }
                  <Text
                    style={{
                      width:'100%',
                      height:3,
                      textAlign:'center',
                      position:'relative',
                      bottom:8,
                    }}>
                    <Text style={{
                      width:100,
                      // backgroundColor:'black',
                    }}>____
                    </Text>
                  </Text>
                  <View style={{
                    flex:1,
                    flexDirection: 'row',
                    // backgroundColor:'blue',
                    textAlign: 'center',
                    padding: 10,
                  }}>
                    <View style={{
                      // alignItems: 'center',
                      // justifyContent: 'center',
                      // backgroundColor:'red',
                      padding:5,
                      textAlign: 'center',
                    }}>
                    {
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
                      textAlign: 'center',
                      // width:'100%',
                      // margin: 10,
                      padding:5,
                      flex:1,
                      alignItems: this.state.user_data.user_type_id==3?'center':'null',
                    }}>

                  {
                    // can_book || this.state.can_book ?(
                      <>
                        <Text note>
                        {this.state.user_data.user_type_id == 3 ? "Your rider":"Your driver"
                          // {this.state.is_user_type_ready?('Where are you goingxxx?'):('asd')}
                        }
                        </Text>
                        <Text>
							{this.state.rider_details?this.state.rider_details.first_name:"No Data Found"} 
							{this.state.rider_details?this.state.rider_details.last_name:""} 
						</Text>
                        <Text>
							{this.state.rider_details?this.state.rider_details.email:""} 
						</Text>
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
					{//<TouchableOpacity style={{backgroundColor: '#1c1b22', paddingVertical: 10, paddingHorizontal: 20}} onPress={() => this.testfunction1(1)}>
                    }
					<TouchableOpacity disabled={this.state.disabledBotton} style={{backgroundColor: '#1c1b22', paddingVertical: 15, paddingHorizontal: 48, height:70,marginTop:25, position:"relative",textAlign:"center",alignItems:"center"}} onPress={() => this.changFunction(Number(this.state.booking_details.booking_id))} >
                        {/* {true?( */}
                        {this.state.disabledBotton?(
                            <View style={{position:'relative',top:-28}}><Spinner /></View>
                            
                        ):(
                            <Text style={{color: '#d3a04c'}}>{this.state.textValue}</Text>
                        )

                        }
                    </TouchableOpacity>
                  </View>
                </View>
              </BottomDrawer>
              </>
            )
            }
          </View>
        ) : null}
      </View>
    );
  }
}

// export default MapContainer;

// export default MapContainer;
function mapStateToProps(state) {
  return {
    driver_location:state.driver_location.driver_location,
  }
}
function mapActionsToDispatch(dispatch) {
  return bindActionCreators({
    DRIVER_LOCATION_CHANGE: DRIVER_LOCATION_CHANGE,
  }, dispatch)
}
export default connect(mapStateToProps, mapActionsToDispatch)(MapContainer);