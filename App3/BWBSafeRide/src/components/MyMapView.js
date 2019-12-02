import React from 'react';
import MapView, { AnimatedRegion, Marker  } from 'react-native-maps';
import { Dimensions, TouchableHighlight, TouchableOpacity, View, Alert } from 'react-native';
import { Icon, Text } from 'native-base';
import MapViewDirections from 'react-native-maps-directions';
import Helpers from '../../Helpers';

let { width, height } = Dimensions.get('window');
const origin = {latitude: 37.3318456, longitude: -122.0296002};
const destination = {latitude: 37.771707, longitude: -122.4053769};
const GOOGLE_MAPS_APIKEY = 'AIzaSyC8lpkvXFDua9S2al669zfwz7GSkeVFWs4';

// this.mapView = null;

const MyMapView = (props) => {
  console.log('MyMapView Renedering');
  console.log(props);
  // height = (props.height)?props.height+300:height;
  return (
    <MapView
        style={{ flex: 1,  height: height-100,  width: width }}
        // region={{origin}}
        // region={props.region}
        showsUserLocation={true}
        // ref={c => this.mapView = c}
        onRegionChangeComplete={(reg) => props.onRegionChange(reg)}
        initialRegion={{
          // latitude: props.marker1 ? props.marker1.latitude:37.78825,
          latitude: 37.78825,
          // longitude: props.marker1 ? props.marker1.longitude:-122.4324,
          longitude: -122.4324,
          latitudeDelta: 0.0,
          longitudeDelta: 0.0,
        }}

        >
          {props.form_from && <MapView.Marker
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
                                    Alert.alert(res.msg);

                                 }).catch((error) => {
                                   console.error(error);
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
            {props.form_to && <MapView.Marker
                 coordinate={props.form_to}
                 title={"Drop-off Location"}
                 description={props.geocode_name}
              />}

            {true && <MapView.Marker
                 coordinate={{
                    // latitude: 37.78825,
                    latitude: props.marker1 ? props.marker1.latitude:37.78825,
                    // longitude: -122.4324,
                    longitude: props.marker1 ? props.marker1.longitude:-122.4324,
                  }}
                 title={"Drop-off LocationX"}
                 description={props.geocode_name}
              />}
              {

        // <MapView.Marker
        //     coordinate={{latitude: 37.78825,
        //     longitude: -122.4324}}
        //     title={"title"}
        //     description={"description"}
        //  />
         }
          <MapViewDirections
            origin={props.form_from}
            destination={props.form_to}
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
              console.log('GOT AN ERROR');
            }}
          />

    </MapView>
  )
}
export default MyMapView;
