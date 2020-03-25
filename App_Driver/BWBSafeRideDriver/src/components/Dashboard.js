import React, { Component } from 'react';
import { Dimensions, Alert, PermissionsAndroid, TextInput, View, StyleSheet, BackHandler, DeviceEventEmitter } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Switch } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import MapContainer from './MapContainer';
import Helpers from '../../Helpers';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

import {
  SCLAlert,
  SCLAlertButton
} from 'react-native-scl-alert';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
// const LATITUDE = 37.771707;
// const LONGITUDE = -122.4053769;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const origin = {latitude: 37.3318456, longitude: 123.0296002};
const destination = {latitude: 37.771707, longitude: 123.4053769};
const GOOGLE_MAPS_APIKEY = 'AIzaSyC8lpkvXFDua9S2al669zfwz7GSkeVFWs4';

export async function requestLocationPermission()
{
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      // {
      //   'title': 'Example App',
      //   'message': 'Example App access to your location '
      // }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the location")
      // alert("You can use the location");
    } else {
      console.log("location permission denied")
      // alert("Location permission denied");
    }
  } catch (err) {
    console.warn(err)
  }
}

LocationServicesDialogBox.checkLocationServicesIsEnabled({
    message: "<h2 style='color: #0af13e'>Use Location?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
    ok: "YES",
    cancel: "NO",
    enableHighAccuracy: false, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
    showDialog: true, // false => Opens the Location access page directly
    openLocationServices: true, // false => Directly catch method is called if location services are turned off
    preventOutSideTouch: false, // true => To prevent the location services window from closing when it is clicked outside
    preventBackClick: false, // true => To prevent the location services popup from closing when it is clicked back button
    providerListener: true // true ==> Trigger locationProviderStatusChange listener when the location state changes
}).then(function(success) {
    console.log(success); // success => {alreadyEnabled: false, enabled: true, status: "enabled"}
}).catch((error) => {
    console.log(error.message); // error.message => "disabled"
});

BackHandler.addEventListener('hardwareBackPress', () => { //(optional) you can use it if you need it
   //do not use this method if you are using navigation."preventBackClick: false" is already doing the same thing.
   LocationServicesDialogBox.forceCloseDialog();
});

DeviceEventEmitter.addListener('locationProviderStatusChange', function(status) { // only trigger when "providerListener" is enabled
    console.log(status); //  status => {enabled: false, status: "disabled"} or {enabled: true, status: "enabled"}
});

// const getCurrentLocation = () => { // TO REMOVE NA
  // alert('3');
   // this.watchID = navigator.geolocation.watchPosition((position) => {
   //  console.log(position);
   //  console.log('asd');
   //      // Create the object to update this.state.mapRegion through the onRegionChange function
   //    //   let region = {
   //    //     latitude:       position.coords.latitude,
   //    //     longitude:      position.coords.longitude,
   //    //     latitudeDelta:  0.00922*1.5,
   //    //     longitudeDelta: 0.00421*1.5
   //    //   }
   //    //   this.onRegionChange(region, region.latitude, region.longitude);
   //    }, (error)=>console.log(error));
// }

export default class Dashboard extends Component {
  // getCurrentLocation();
  // state = {
  // }

  async componentWillMount() {
    // navigator.geolocation.clearWatch(this.watchID);

    await requestLocationPermission();
  }

  constructor(props){
      super(props);
      this.state = {
          isMapReady: false,
          longitude: 37.771707,
          latitude: -122.4053769,
          switchValue: false,
          user_type: null,
          
          scl_alert: {
            show: false,
            title: "title",
            message: "message",
          },
      }

  }

  toggleSwitch = async (event) => {
      const data = JSON.parse(await AsyncStorage.getItem('userData'));

      let msg = '';
      // this.setState({ switchValue: !this.state.switchValue });
      this.setState({ switchValue: event });

      console.log("this.state.switchValue");
      console.log(event);
      console.log(this.state.switchValue);
      AsyncStorage.setItem('is_available', JSON.stringify(event));

      fetch(Helpers.api_url+'update_driver_status', {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         driver_id: data.user_id,
         status_name: JSON.stringify(this.state.switchValue)
       })
      }).then((response) => {
        // console.log("update_driver_status");
        // console.log(response);
        if (response.status == 200) {
          // VALIDATION IF ANY
          return response.json();
        } else {
          // alert('Error on connecting to server.');

          this.setState({
            scl_alert: {
              show: true,
              title: "Alert",
              message: "Error on connecting to server",
            }
          });
        }
      }).then((responseJson) => {
        if (responseJson){
          if (responseJson.response === 'success') {
            // msg = responseJson.msg;
            // Alert.alert(msg);

            this.setState({
              scl_alert: {
                show: true,
                title: "Alert",
                message: "Availability status updated.",
              }
            });
          }
        }
       }).catch((error) => {
         console.error(error);
         console.error("toggleSwitch");
       });
  }

  async getDriverStatus(){
      const data = JSON.parse(await AsyncStorage.getItem('userData'));
      this.setState({ user_type: data['user_type_id'] });
      console.log("getDriverStatus");
      console.log(Helpers.api_url + 'get_driver_status');
      fetch(Helpers.api_url+'get_driver_status', {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         driver_id: data.user_id
       })
     }).then((response) => {
      if (response.status == 200){
        // VALIDATION IF ANY
        return response.json();
      }else{
        // alert('Error on connecting to server.');

        this.setState({
          scl_alert: {
            show: true,
            title: "Alert",
            message: "Error on connecting to server",
          }
        });
      }
     }).then((responseJson) => {
      //  console.log("responseJsonXDXDXD");
      //  console.log(responseJson);
       if (responseJson){
         if (responseJson.status === 'true') {
           this.setState({ switchValue: true });
         } else {
           this.setState({ switchValue: false });
         }
        }
      }).catch((error) => {
        console.error(error);
        console.log("getDriverStatus");
      });
  }

  componentDidMount() {

    this.getDriverStatus();

    var that = this;


      //Checking for the permission just after component loaded
      // if(Platform.OS === 'ios'){
      //   this.callLocation(that);
      // }else{
        // async function requestLocationPermission() {
        //   try {
        //     const granted = await PermissionsAndroid.request(
        //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
        //         'title': 'Location Access Required',
        //         'message': 'This App needs to Access your location'
        //       }
        //     )
        //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //       // that.callLocation(that);
        //     }
        //   } catch (err) {
        //     alert("Something went wrong.");
        //     console.warn("err",err);
        //   }
        // }
        // requestLocationPermission();
      // }
  }
  
  callLocation(that){
    console.log('getting Location');
    console.log(navigator);
    navigator.geolocation.getCurrentPosition(
     //Will give you the current location
      (position) => {
        console.log(position);
         const currentLongitude = Number(JSON.stringify(position.coords.longitude));
         //getting the Longitude from the location json
         const currentLatitude = Number(JSON.stringify(position.coords.latitude));
         //getting the Latitude from the location json
         //Setting state Longitude to re re-render the Longitude Text
         that.setState({
           longitude:currentLongitude,
           latitude:currentLatitude,
           isMapReady:true
         });
         //Setting state Latitude to re re-render the Longitude Text
      },
      (error) => console.log(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
     // that.watchID = navigator.geolocation.watchPosition((position) => {
     //   //Will give you the location on location change
     //     console.log(position);
     //     const currentLongitude = JSON.stringify(position.coords.longitude);
     //     //getting the Longitude from the location json
     //     const currentLatitude = JSON.stringify(position.coords.latitude);
     //     //getting the Latitude from the location json
     //    that.setState({ currentLongitude:currentLongitude });
     //    //Setting state Longitude to re re-render the Longitude Text
     //    that.setState({ currentLatitude:currentLatitude });
     //    //Setting state Latitude to re re-render the Longitude Text
     // });
  }

  //  async componentDidMount() {
  //    await requestLocationPermission();
  //     this.watchID = navigator.geolocation.watchPosition((position) => {
  //       console.log(position);
  //           // Create the object to update this.state.mapRegion through the onRegionChange function
  //         //   let region = {
  //         //     latitude:       position.coords.latitude,
  //         //     longitude:      position.coords.longitude,
  //         //     latitudeDelta:  0.00922*1.5,
  //         //     longitudeDelta: 0.00421*1.5
  //         //   }
  //         //   this.onRegionChange(region, region.latitude, region.longitude);
  //         }, (error)=>console.log(error));
  // }
//   onRegionChange(region, lastLat, lastLong) {
//   this.setState({
//     mapRegion: region,
//     // If there are no new values set the current ones
//     lastLat: lastLat || this.state.lastLat,
//     lastLong: lastLong || this.state.lastLong
//   });
// }
    // async  requestLocationPermission(){
    //   try {
    //     const granted = await PermissionsAndroid.request(
    //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //       {
    //         'title': 'Example App',
    //         'message': 'Example App access to your location '
    //       }
    //     )
    //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //       console.log("You can use the location")
    //       alert("You can use the location");
    //     } else {
    //       console.log("location permission denied")
    //       alert("Location permission denied");
    //     }
    //   } catch (err) {
    //     console.warn(err)
    //   }
    // }

   // async componentDidMount() {
   //   await requestLocationPermission()
   //  }

    static navigationOptions = {
      drawerLabel: 'Dashboard',
      drawerIcon: () => (
          <Icon type="FontAwesome" name="home" style={{ fontSize: 22 }} />
      )
    };

    checkSession = async () => {
      if(await AsyncStorage.getItem('userData')) {
        // this.setState({
        //   isLogged: true,
        //   });
        console.log('NAKA LOGIN');
        console.log(await AsyncStorage.getItem('userData'));
      }else {
          // this.props.actions.navigate('Logout');
          this.props.navigation.navigate('Logout');
          // console.log('WALA NAKA LOGIN pomise');
               // Actions.dashboard();
      }

      console.log('SESSION CHECKED');
      // setTimeout(() => {
      //   this.setState({
      //     isLoading: false,
      //     });
      //   }, 1000);
    }

    render() {
        const { navigation } = this.props;

		
        console.log('Temp this.props');
        console.log(this.props);
        console.log('Temp this.props');
		
		
		
        console.log('boooooooooooking');
        console.log(this.props.navigation.getParam('booking_data', null));
        console.log('boooooooooooking');

        let params = false;
      if (this.props.navigation.getParam('params',false)) {
        params = this.props.navigation.getParam('params',false);
        // console.log('XDXDXDXDXD');
        // console.log(params);
      }else{
        params = false;
        // console.log('zzzzzzzzzzzzz');
      }

      // console.log('props');
      // console.log(this.props);
      // console.log(this.props.navigation.getParam('params',false));
      // console.log('props end');

      // if (this.state.isMapReady) {
      // }else {
      //   this.setState(state => { latitude:100 });
      //   this.setState(state => { longitude:37 });
      // }
      let { latitude, longitude } = this.state;

      // console.log(Dimensions.get('window'));

      // console.log("render");
      // console.log(this.state);
      this.checkSession();
    console.log("XDXDXXDXDXD");

      console.log(this.props);

      return (
        <Container>
          <Header>
            <Left style={{ flexDirection: 'row' }}>
              <Icon onPress={() => this.props.navigation.openDrawer()} name="md-menu" style={{ color: '#d3a04c', marginRight: 15 }} />
            </Left>
            <Right>
              {this.state.user_type === '3' && <View style={{ flexDirection: 'row' }}><Text style={{ color: '#d3a04c' }}>I am available  </Text><Switch onValueChange={(value) => this.toggleSwitch(value)} value={this.state.switchValue} trackColor={{false: '#c1191c', true: "#32CD32"}} thumbColor={'#d3a04c'} /></View> }
            </Right>
          </Header>
          <Content contentContainerStyle ={{position:'relative',flex: 1 }}>
            <View style={styles.container}>
            {
                <MapContainer 
					navigation={this.props.navigation} 
					{...params} 
					pinned_latitude={this.props.navigation.getParam('pinned_loc_lat', 0)} 
					pinned_longitude={this.props.navigation.getParam('pinned_loc_long', 0)} 
					pinned_stat={this.props.navigation.getParam('pinned_stat', true)} 
					window_height={height} 
					set_destination_lat={this.props.navigation.getParam('latitude', 0)} 
					set_destination_long={this.props.navigation.getParam('longitude', 0)} 
				/>
              }

              <SCLAlert
                // show={true}
                show={this.state.scl_alert.show}
                onRequestClose={() => { this.setState({ scl_alert: { show: false } }) }}
                theme="info"
                title={this.state.scl_alert.title}
                subtitle={this.state.scl_alert.message}
              >
                <SCLAlertButton theme="info" onPress={() => { this.setState({ scl_alert: { show: false } }) }}>OK</SCLAlertButton>
              </SCLAlert>
              
            </View>
          </Content>
          {
            // <Footer>
            //   <FooterTab style={{backgroundColor:"#1c1b22"}}>
            //       <Button vertical active onPress={() => getCurrentLocation()}>
            //           <Icon active name="map" />
            //           <Text>Book Now</Text>
            //       </Button>
            //   </FooterTab>
            // </Footer>
          }
      </Container>
      );
    }
}

const styles = StyleSheet.create({
  container: {
  flex: 1,

  },
});


