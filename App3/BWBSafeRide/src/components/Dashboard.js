import React, { Component } from 'react';
import { Dimensions, Alert, PermissionsAndroid, TextInput, View, StyleSheet } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Switch } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import MapContainer from './MapContainer';
import Helpers from '../../Helpers';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
// const LATITUDE = 37.771707;
// const LONGITUDE = -122.4053769;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const origin = {latitude: 37.3318456, longitude: 123.0296002};
const destination = {latitude: 37.771707, longitude: 123.4053769};
const GOOGLE_MAPS_APIKEY = 'AIzaSyC8lpkvXFDua9S2al669zfwz7GSkeVFWs4';

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

  // componentWillUnmount() {
  //   navigator.geolocation.clearWatch(this.watchID);
  // }

  constructor(props){
      super(props);
      this.state = {
          isMapReady: false,
          longitude: 37.771707,
          latitude: -122.4053769,
          switchValue: false,
          user_type: null
      }
  }

  toggleSwitch = async () => {

      const data = JSON.parse(await AsyncStorage.getItem('userData'));

      let msg = '';
      this.setState({ switchValue: !this.state.switchValue });

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
     }).then((response) => response.json())
       .then((responseJson) => {

           if(responseJson.response === 'success'){
               msg = responseJson.msg;
               Alert.alert(msg);
           }

       }).catch((error) => {
         console.error(error);
       });

  }

  async getDriverStatus(){
      const data = JSON.parse(await AsyncStorage.getItem('userData'));

      this.setState({ user_type: data['user_type_id'] });

      fetch(Helpers.api_url+'get_driver_status', {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         driver_id: data.user_id
       })
     }).then((response) => response.json())
       .then((responseJson) => {

           if(responseJson.status === 'true'){
               this.setState({ switchValue: true });
           }else{
               this.setState({ switchValue: false });
           }

       }).catch((error) => {
         console.error(error);
       });

  }

  componentDidMount() {

      // const {latitude} = this.props;
      // navigation.getParam('latitude', 0)

      this.getDriverStatus();

    var that = this;
      //Checking for the permission just after component loaded
      // if(Platform.OS === 'ios'){
      //   this.callLocation(that);
      // }else{
        async function requestLocationPermission() {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
                'title': 'Location Access Required',
                'message': 'This App needs to Access your location'
              }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              // that.callLocation(that); // TEMP
            }
          } catch (err) {
            // alert("Unable to get current location."); // TEMP
            console.warn("err",err);
          }
        }
        requestLocationPermission();
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
      // console.log('here');
      if(await AsyncStorage.getItem('userData')) {
        // this.setState({
        //   isLogged: true,
        //   });
        // console.log('naa');
        // console.log(await AsyncStorage.getItem('userData'));
      }else {
          this.props.actions.navigate('Logout');
      }

      // setTimeout(() => {
      //   this.setState({
      //     isLoading: false,
      //     });
      //   }, 1000);
    }

    render() {
        const { navigation } = this.props;

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
             {this.state.user_type === '3' && <View style={{flexDirection: 'row'}}><Text style={{color: '#d3a04c'}}>I am available  </Text><Switch onValueChange = {this.toggleSwitch} value={this.state.switchValue} trackColor={{false: '#c1191c', true: "#32CD32"}} thumbColor={'#d3a04c'} /></View> }
           </Right>
          </Header>
          <Content Styles={{position:'relative'}}>
            <View style={styles.container}>
            {
                <MapContainer navigation={this.props.navigation} {...params} pinned_latitude={navigation.getParam('pinned_loc_lat', 0)} pinned_longitude={navigation.getParam('pinned_loc_long', 0)} pinned_stat={navigation.getParam('pinned_stat', true)} window_height={height} set_destination_lat={navigation.getParam('latitude', 0)} set_destination_long={navigation.getParam('longitude', 0)} />
              }
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
