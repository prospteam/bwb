import React from 'react';
import MapView, { AnimatedRegion, Marker  } from 'react-native-maps';
import { Dimensions, TouchableHighlight, TouchableOpacity, View, Alert } from 'react-native';
import { Icon, Text } from 'native-base';
import MapViewDirections from 'react-native-maps-directions';
import Helpers from '../../Helpers';

import map_style from '.././assets/map_style.js';
let { width, height } = Dimensions.get('window');
// const origin = {latitude: 10.3157, longitude: 123.886};
const destination = {latitude: 37.771707, longitude: 123.4053769};
const GOOGLE_MAPS_APIKEY = 'AIzaSyC8lpkvXFDua9S2al669zfwz7GSkeVFWs4';

// redux 
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SET_DISPLAY_DRIVER_LOCATION } from '../redux/actions/Actions';

// this.mapView = null;
const MyMapView = (props) => {
    // Alert.alert('hello');
  console.log('MyMapView Rendering-start');
  // console.log(props.driver_location);
  // console.log(props.form_from);
  console.log('MyMapView Rendering-');
  // height = (props.height)?props.height+300:height;

  // const origin = {
  //     latitude: props.region.latitude,
  //     longitude: props.region.longitude
  // }

  return (
    <MapView
        customMapStyle={map_style}
        style={{ flex: 1,  height: height-100,  width: width }}

        // region={{origin}}
        // region={props.marker1?props.marker1:props.region?props.region:origin}
        // region={{
        //   latitude: props.marker1 ? props.marker1.latitude:37.78825,
        //   // latitude: 37.78825,
        //   longitude: props.marker1 ? props.marker1.longitude:-122.4324,
        //   // longitude: -122.4324,
        //   latitudeDelta: 0.0,
        //   longitudeDelta: 0.0,
        // }}

        region={{
          latitude: (props.pinned_lat !== 0) ? parseFloat(props.pinned_lat) : props.region.latitude,
          longitude: (props.pinned_long !== 0) ? parseFloat(props.pinned_long) : props.region.longitude,
          // latitude: (props.pinned_lat !== 0) ? parseFloat(props.pinned_lat) : props.region.region,
          // longitude: (props.pinned_stat !== 0) ? parseFloat(props.pinned_long) : props.region.region,
          latitudeDelta: props.region.latitudeDelta,
          longitudeDelta: props.region.longitudeDelta,
        }}

        // showsUserLocation={true}
        // ref={c => this.mapView = c}
        // onRegionChangeComplete={(reg) => props.onRegionChange(reg)}
        // initialRegion={{
        //   // latitude: props.my_latitude_as_rider,
        //   // latitude: props.marker1 ? props.marker1.latitude:37.78825,
        //   latitude: 37.78825,
        //   // longitude: props.my_longitude_as_rider,
        //   // longitude: props.marker1 ? props.marker1.longitude:-122.4324,
        //   longitude: -122.4324,
        //   latitudeDelta: 0.0,
        //   longitudeDelta: 0.0,
        // }}
        >
            {(props.driver_location.latitude)&&<MapView.Marker
            coordinate={{latitude:props.driver_location.latitude, longitude: props.driver_location.longitude}}
            >
          <Icon type="FontAwesome5" name="car-side"></Icon>
            </MapView.Marker>}
            
          {(props.form_from) && <MapView.Marker
               coordinate={props.form_from}
               title={"Pickup Location"}
               description={props.geocode_name}
               pinColor='#45A163'
            >
            <MapView.Callout tooltip={true}
                style={{backgroundColor: '#d3a04c'}}
                onPress={() => {
                          const data = {
                              location_name: props.geocode_name,
                              latitude: props.geocode_lat,
                              longitude: props.geocode_long,
                              login_id: props.login_id
                          }
                          // Alert.alert(props.geocode_name+":"+props.geocode_lat);
                            // Alert.alert(data.location_name);
                            fetch(Helpers.api_url+'save_location', {
                                 method: 'POST',
                                 headers: {
                                   'Accept': 'application/json',
                                   'Content-Type': 'application/json',
                                 },
                                 body: JSON.stringify(data)
                               }).then((response) => response.json())
                                 .then((res) => {
                                    // Alert.alert(res.msg);
                                   this.setState({
                                     scl_alert: {
                                       show: true,
                                       title: "Alert",
                                       message: res.msg,
                                     }
                                   });
                                 }).catch((error) => {
                                   //console.error(error);
                                 });
                            // const api = url()+'api/save_location';
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
                }}
            >
                <TouchableOpacity>
                    <Text style={{color: '#fff', padding: 10}}>Bookmark location</Text>
                </TouchableOpacity>
            </MapView.Callout>
            </MapView.Marker>
        }
            {(props.form_to) && <MapView.Marker
                 coordinate={props.form_to}
                 title={"Drop-off Location"}
              />}

            {props.marker1 && <MapView.Marker
                 coordinate={{
                    // latitude: 37.78825,
                    latitude: props.marker1 ? props.marker1.latitude:37.78825,
                    // longitude: -122.4324,
                    longitude: props.marker1 ? props.marker1.longitude:-122.4324,
                  }}
                 title={"Drop-off LocationX"}
                 // description={props.geocode_name}
              />}

            {props.my_latitude!=0 && <MapView.Marker
                 coordinate={{
                    // latitude: 37.78825,
                    latitude: props.my_latitude,
                    // longitude: -122.4324,
                    longitude: props.my_longitude,
                  }}
                 title={"Drop-off LocationX"}
                 // description={props.geocode_name}
              />}
              {(props.pinned_lat !== 0) && <MapView.Marker
                   coordinate={{latitude: parseFloat(props.pinned_lat), longitude: parseFloat(props.pinned_long)}}
                   title={"Saved Location"}
                   pinColor='#d3a04c'
                >
                <MapView.Callout tooltip={true}
                    style={{backgroundColor: '#d3a04c'}}
                    onPress={() => {props.navigation.navigate('Dashboard', {
                        latitude: parseFloat(props.pinned_lat),
                        longitude: parseFloat(props.pinned_long)
                    })}}
                    >
                    <TouchableOpacity>
                        <Text style={{color: '#fff', padding: 10}}>Set Destination</Text>
                    </TouchableOpacity>
                </MapView.Callout>
                </MapView.Marker>}
          <MapViewDirections
            origin={props.form_from?props.form_from:{}}
            destination={props.form_to?props.form_to:{}}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={5}
            strokeColor="#4372AA"
            onReady={result => {
              props.getData(result)
              // console.log(`Distance: ${result.distance} km`)
              // console.log(`Duration: ${result.duration} min.`)
              // this.mapView.fitToCoordinates(result.coordinates, {
              //   edgePadding: {
              //     right: (width / 20),
              //     bottom: (height / 5),
              //     left: (width / 20),
              //     top: (height / 20),
              //   }
              // });
            }}
            onError={(errorMessage) => {
              console.log('GOT AN ERROR1');
            }}
          />
		{
			props.driver_location.latitude!=0 && <MapViewDirections
            origin={{latitude:props.driver_location.latitude, longitude: props.driver_location.longitude}}
            destination={props.form_from?props.form_from:{}}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={5}
            strokeColor="orange"
            onReady={result => {
              if(this.props.display_driver_location){
                var duration = (Number(result.distance.toFixed(0))==0)?"You are soon to arrive to your destination.":result.duration.toFixed(0)+" minute\\s to arrive.";
                var distance = result.duration.toFixed(2) + "km from your location.";
                props.getDataDriverLocation({distance:distance,duration:duration})
              }
            }}
            onError={(errorMessage) => {	
              console.log(errorMessage);
              console.log('GOT AN ERROR2');
            }}
          />}
    </MapView>
  )
}
// export default MyMapView;

// export default MapContainer;

// export default MapContainer;
function mapStateToProps(state) {
  return {
    driver_location:state.redux_state.driver_location,
    display_driver_location:state.redux_state.display_driver_location,
  }
}
function mapActionsToDispatch(dispatch) {
  return bindActionCreators({
    SET_DISPLAY_DRIVER_LOCATION: SET_DISPLAY_DRIVER_LOCATION,
  }, dispatch)
}
export default connect(mapStateToProps, mapActionsToDispatch)(MyMapView);