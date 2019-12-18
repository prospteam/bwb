import React from 'react';
import { Image, View, KeyboardAvoidingView, Alert } from 'react-native';
import { Button, Text, Input, Form, Item, Label, DatePicker,Thumbnail, Left, Body } from 'native-base';
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
import firebase from './common/firebase';
// import Geolocation from "@react-native-community/geolocation";

const sample_img_link = 'http://web2.proweaverlinks.com/tech/bwbsafe/backend_web_api/assets/images/sample.png';

const TAB_BAR_HEIGHT = 80;
const DRAWER_HEIGHT_SMALL = 300;
const DRAWER_HEIGHT_BIG = 500;
// const GOOGLE_MAPS_APIKEY = 'AIzaSyDNiQ_vrw3zB6pM_s2nNC-0mohwlWi6wGo';
const GOOGLE_MAPS_APIKEY = 'AIzaSyCsCARtyDaiIeDtGY0r3jz4pT4YwiR41Fw';
// const GOOGLE_MAPS_APIKEY = 'AIzaSyC8lpkvXFDua9S2al669zfwz7GSkeVFWs4';

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

    componentDidUpdate(prevProps) {
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
    }

  watchID: ?number = null;

  constructor(props) {
    super(props);

    this.state = {
      testlocation:null,
      is_finish_check_booking_status:false,
      is_user_type_ready:false,
      user:null,
      driver_details:[],
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
      // pinned_latitude: 0,
      // pinned_longitude: 0
    }

    this.ref = firebase.firestore().collection('driver_location_logs');

      // console.log('LOEDDEDDDD1');

    // Alert.alert("Watch Position");

    this.watchID = Geolocation.watchPosition((position) => {
      //const lastPosition = JSON.stringify(position);
      //this.setState({lastPosition});

        this.setState({
            region: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta:  0.015,
              longitudeDelta: 0.0121
            }
        });
      },
      (error) => Alert.alert(JSON.stringify(error))
      );
  }



  async componentDidMount() {


          // this.driverSendLocation();

    // if (this.state.booking_details) {

      // this.ref.onSnapshot(this.driverLocationListener);

    // }

    const {pinned_stat} = this.props;

    this.setState({pinned_stat: pinned_stat});

    this.setState({
      user: JSON.parse(await AsyncStorage.getItem('userData')),
      is_user_type_ready:true,
    });

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
    console.log(Helpers.ci_url+'booking/user_boonotifyChangeking_status/'+data.login_id);
    // console.log('XDXDXDXD');

  fetch(Helpers.ci_url+'booking/user_booking_status/'+data.login_id, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
   }).then((response) => response.json())
     .then((responseJson) => {
       console.log('getting API');
       // console.log(responseJson);
        if(responseJson.num_of_active_booking > 0){
          // msg = responseJson.msg;

          this.setState({
            can_book:false,
            driver_details:responseJson.driver_details,
            booking_details:responseJson.booking_details,
          });
// this.state.user.user_type_id
          console.log('LOEDDEDDDD2');
          // this.ref.onSnapshot(this.driverLocationListener);

        }else{
          this.setState({
            can_book:true,
            driver_details:[],
            booking_details:[],
          });
        }
     }).catch((error) => {
       console.log('NOT getting API');
       // console.error(error);
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

      let latDelta = (location.latitudeDelta) ? location.latitudeDelta:0.003;
      let longDelta = (location.longitudeDelta) ? location.longitudeDelta:0.003;
      this.setState({
        region: {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: latDelta,
          longitudeDelta: longDelta,
        },
      });

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
    this.setState({pinned_stat: false});
    // alert(this.state.pinned_stat);

    this.updateState({
      latitude: loc.lat || this.state.set_destination_lat,
      longitude: loc.lng || this.state.set_destination_long,
    });
    // this.updateSelectedLatLong({
    //   latitude: loc.lat,
    //   longitude: loc.lng,
    // });

    if (inputField==='from') {
      this.setState({
        form_from_text:inputText,
        form_from:'from',
        form_from_latlong:{
          latitude: loc.lat,
          longitude: loc.lng,
        },
      });
    }else{
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
    // this.setState({ region });
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

  bookNow(e){
    const { state } = this;

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
          chosenDate:state.chosenDate.toString().substr(4, 12),
          chosenTime:state.chosenTime,
          distance:state.distance,
          duration:state.duration,
          form_from_latlong:state.form_from_latlong,
          form_from_text:state.form_from_text,
          form_to_latlong:state.form_to_latlong,
          form_to_text:state.form_to_text,
          payByDistance:payByDistance,
        };

        // Actions.payment();

        // NOTE:
        this.props.navigation.navigate('Payment',{params:formData});
        // this.props.navigate('Payment');
        // console.log('Booknow');
        // console.log(formData);
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
    this.setState({ chosenDate: newDate });
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
    // console.log("MY STATUS");
    // console.log(this.state);
    // console.log(this.props);
    // console.log("getting NEW PROPS");
    const { window_height, can_book, pinned_latitude, pinned_longitude, navigation } = this.props;
    // console.log('MapContainer Rendered');
    const { distance, duration } = this.state;

    const set_destination_latlong = {
        latitude: this.state.set_destination_lat,
        longitude: this.state.set_destination_long
    }

    // console.log(distance);
    // console.log("distance Calculating");

    console.log('YYYYYYYYYYYYYY');
    console.log(this.state.can_book);
    // console.log(this.state.booking_details);
    const marker1 = this.state.is_user_type_ready ? this.state.user != 3 ? this.state.testlocation ? this.state.testlocation : null :null:null;
    // console.log(this.props);

    return (
      <View style={{ flex: 1 ,  backgroundColor:'red'}}>
        {this.state.region.latitude ? (
          <View style={{ flex: 1, backgroundColor:'blue' }}>
            <MyMapView
              my_latitude={this.state.my_latitude}
              my_longitude={this.state.my_longitude}
              my_latitude_as_rider={this.state.my_latitude_as_rider}
              my_longitude_as_rider={this.state.my_longitude_as_rider}
              marker1={marker1}
              region={this.state.region}
              viewed_region={this.state.viewed_region}
              form_from={this.state.form_from_latlong}
              form_to={set_destination_latlong}
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
            this.state.is_user_type_ready == false || !this.state.booking_details ? null
            : (can_book || this.state.can_book) ?(
              <>
              {
              (this.state.user.user_type_id == 3 && (can_book || this.state.can_book) && this.state.is_finish_check_booking_status) ? (this.props.navigate('Bookings')):(
              <BottomDrawer
                containerHeight={ window_height - 15 }
                offset={0}
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

                    <Text
                      style={{
                        width:'100%',
                        height:3,
                        textAlign:'center',
                        position:'relative',
                        bottom:10,
                      }}>
                      <Text style={{
                        width:100,
                        backgroundColor:'black',
                      }}>____
                      </Text>
                    </Text>
                    <Text style={{
                      width:'100%',
                      textAlign: 'left',
                      fontWeight:'bold',
                      fontSize:20,
                      marginBottom:15
                    }}>
                      {this.state.is_user_type_ready?('Where are you going?'):('__')}
                    </Text>
                  <Label>Pickup</Label>
                  <MapInput notifyChange={(loc,loc_text) => this.getCoordsFromName(loc,'from',loc_text)} placeholder='Enter pickup location.'/>
                  <View
                    style={{
                      borderBottomColor: '#d9d9d9',
                      borderBottomWidth: 2,
                    }}
                  />
                  <Label>Drop-Off</Label>
                  <MapInput notifyChange={(loc,loc_text) => this.getCoordsFromName(loc,'to',loc_text)} latlong={set_destination_latlong} placeholder='Enter drop-off location' />
                  {distance ?(
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
                      <View style={{display:'flex',flexDirection:'row',marginTop: 20}}>
                          <View style={{width:'55%'}}>
                            <Label style={{marginTop: 0}}>Pickup Date</Label>
                            <DatePicker
                              defaultDate={new Date()}
                              minimumDate={new Date(2018, 1, 1)}
                              locale={"en"}
                              modalTransparent={false}
                              animationType={"fade"}
                              androidMode={"default"}
                              placeHolderText="Select date"
                              textStyle={{ color: "black", border: 1 , fontSize: 18}}
                              placeHolderTextStyle={{ color: "#d3d3d3" }}
                              onDateChange={(e) => this.setDate(e)}
                              disabled={false}
                              />
                            </View>
                            <View style={{width:'45%'}}>
                              <Label>Pickup Time</Label>
                              <Text onPress={this.showDateTimePicker} style={{
                                marginLeft: 10,
                                marginTop: 10,
                                textAlign: 'left',
                              }}>{this.state.chosenTime?this.state.chosenTime:'00:00 AM'}</Text>
                              <DateTimePicker
                                mode='time'
                                isVisible={this.state.isDateTimePickerVisible}
                                onConfirm={this.handleDatePicked}
                                onCancel={this.hideDateTimePicker}
                              />
                              </View>
                        </View>
                      <Button style={{marginTop: 30}} onPress={(e) => this.bookNow(e)}>
                        <Text style={{
                          width:'100%',
                          textAlign: 'center',
                        }}>Book Now</Text>
                      </Button>
                    </Form>
                    ) : null}
                  </View>
                </View>
              </BottomDrawer>
                )
              }
                </>
              ):(
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
                containerHeight={300}
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
                    {this.state.user.user_type_id == 3 ? null: !can_book || !this.state.can_book ?(
                          <Thumbnail
                            source={{uri: `data:image/gif;base64,${this.state.driver_details.photo}` }} />
                          ):(
                          <Thumbnail
                            source={require('../assets/images/avatar.png')} />
                          )
                       }
                    </View>
                    <View style={{
                      // backgroundColor:'green',
                      textAlign: 'center',
                      // width:'100%',
                      // margin: 10,
                      padding:5,
                      flex:1,
                      alignItems: this.state.user.user_type_id==3?'center':'stretch',
                    }}>

                    {
                      // can_book || this.state.can_book ?(
                        <>
                          <Text note>
                          {this.state.user.user_type_id == 3 ? "Your rider":"Your driver"
                            // {this.state.is_user_type_ready?('Where are you goingxxx?'):('asd')}
                          }
                          </Text>
                          <Text>{this.state.driver_details.first_name} {this.state.driver_details.last_name}</Text>
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
              </>
            ):(
              <>
              {

              (this.state.user.user_type_id == 3 && (can_book || this.state.can_book) && this.state.is_finish_check_booking_status) ? (this.props.navigate('Bookings')):(
              <BottomDrawer
                containerHeight={ window_height - 15 }
                offset={0}
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

                    <Text
                      style={{
                        width:'100%',
                        height:3,
                        textAlign:'center',
                        position:'relative',
                        bottom:10,
                      }}>
                      <Text style={{
                        width:100,
                        backgroundColor:'black',
                      }}>____
                      </Text>
                    </Text>
                    <Text style={{
                      width:'100%',
                      textAlign: 'left',
                      fontWeight:'bold',
                      fontSize:20,
                      marginBottom:15
                    }}>
                      {this.state.is_user_type_ready?('Where are you going?'):('__')}
                    </Text>
                  <Label>Pickup</Label>
                  <MapInput notifyChange={(loc,loc_text) => this.getCoordsFromName(loc,'from',loc_text)} latlong={this.state.form_from_latlong} placeholder='Enter pickup location.'/>
                  <View
                    style={{
                      borderBottomColor: '#d9d9d9',
                      borderBottomWidth: 2,
                    }}
                  />
                  <Label>Drop-Off</Label>
                  <MapInput notifyChange={(loc,loc_text) => this.getCoordsFromName(loc,'to',loc_text)} latlong={set_destination_latlong} placeholder='Enter drop-off location' />
                  {distance ?(
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
                      <View style={{display:'flex',flexDirection:'row',marginTop: 20}}>
                          <View style={{width:'55%'}}>
                            <Label style={{marginTop: 0}}>Pickup Date</Label>
                            <DatePicker
                              defaultDate={new Date()}
                              minimumDate={new Date(2018, 1, 1)}
                              locale={"en"}
                              modalTransparent={false}
                              animationType={"fade"}
                              androidMode={"default"}
                              placeHolderText="Select date"
                              textStyle={{ color: "black", border: 1 , fontSize: 18}}
                              placeHolderTextStyle={{ color: "#d3d3d3" }}
                              onDateChange={(e) => this.setDate(e)}
                              disabled={false}
                              />
                            </View>
                            <View style={{width:'45%'}}>
                              <Label>Pickup Time</Label>
                              <Text onPress={this.showDateTimePicker} style={{
                                marginLeft: 10,
                                marginTop: 10,
                                textAlign: 'left',
                              }}>{this.state.chosenTime?this.state.chosenTime:'00:00 AM'}</Text>
                              <DateTimePicker
                                mode='time'
                                isVisible={this.state.isDateTimePickerVisible}
                                onConfirm={this.handleDatePicked}
                                onCancel={this.hideDateTimePicker}
                              />
                              </View>
                        </View>
                      <Button style={{marginTop: 30}} onPress={(e) => this.bookNow(e)}>
                        <Text style={{
                          width:'100%',
                          textAlign: 'center',
                        }}>Book Now</Text>
                      </Button>
                    </Form>
                    ) : null}
                  </View>
                </View>
              </BottomDrawer>
                )
              }
                </>
              )
>>>>>>> 422c6ee40e044dd03bd8296a3a6a1eba631ad1d6
            }
          </View>
        ) : null}
      </View>
    );
  }
}

export default MapContainer;
