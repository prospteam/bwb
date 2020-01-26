import React, { Component } from 'react';
import { Dimensions, Alert, PermissionsAndroid, TextInput, View } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
// const LATITUDE = 37.771707;
// const LONGITUDE = -122.4053769;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const origin = {latitude: 37.3318456, longitude: -122.0296002};
const destination = {latitude: 37.771707, longitude: -122.4053769};
const GOOGLE_MAPS_APIKEY = 'AIzaSyC8lpkvXFDua9S2al669zfwz7GSkeVFWs4';


const getCurrentLocation = () => {
  alert('3');
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

}

export default class Dashboard extends Component {
  // getCurrentLocation();
  state = {
    isMapReady: false,
    longitude: 37.771707,
    latitude: -122.4053769,
  }

  // componentWillUnmount() {
  //   navigator.geolocation.clearWatch(this.watchID);
  // }

  componentDidMount() {
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
              that.callLocation(that);
            }
          } catch (err) {
            alert("Something went wrong.");
            console.warn("err",err);
          }
        }
        requestLocationPermission();
      // }
  }

  callLocation(that){
    console.log('getting Location');
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
      console.log('here');
      if(await AsyncStorage.getItem('userData')) {
        // this.setState({
        //   isLogged: true,
        //   });
        console.log('naa');
        console.log(await AsyncStorage.getItem('userData'));
      }else {
          this.props.navigation.navigate('Logout');
      }
      // setTimeout(() => {
      //   this.setState({
      //     isLoading: false,
      //     });
      //   }, 1000);
    }

    render() {
      // if (this.state.isMapReady) {
      // }else {
      //   this.setState(state => { latitude:100 });
      //   this.setState(state => { longitude:37 });
      // }
      let { latitude, longitude } = this.state;

      // console.log(Dimensions.get('window'));

      console.log("render");
      console.log(this.state);
      this.checkSession();

        return (
          <Container>
            <Header>
             <Left style={{ flexDirection: 'row' }}>
              <Icon onPress={() => this.props.navigation.openDrawer()} name="md-menu" style={{ color: '#d3a04c', marginRight: 15 }} />
             </Left>
             <Right>
             </Right>
            </Header>
            <Content>
              <MapView
              style={{flex: 1,  height: height,  width: width}}
              showUserLocation={true}
              region={{
                  longitude: longitude,
                  latitude: latitude,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                }}>
                  <MapView.Marker />
                {
                  // <MapViewDirections
                  //   origin={origin}
                  //   destination={destination}
                  //   apikey={GOOGLE_MAPS_APIKEY}
                  // />
                  }
              </MapView>
            </Content>
            <Footer>
              <FooterTab style={{backgroundColor:"#1c1b22"}}>
                  <View>
                    <TextInput placeholder =" Search here" underlineColorAndroid='transparent' selectionColor={'black'} />
                  </View>
                  <Button vertical active onPress={() => getCurrentLocation()}>
                      <Icon active name="map" />
                      <Text>Book Now</Text>
                  </Button>
              </FooterTab>
            </Footer>
        </Container>
        );
    }
}
