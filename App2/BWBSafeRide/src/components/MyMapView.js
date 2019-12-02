import React from 'react';
import MapView, { AnimatedRegion, Marker  } from 'react-native-maps';
import { Dimensions } from 'react-native';
import MapViewDirections from 'react-native-maps-directions';

let { width, height } = Dimensions.get('window');
const origin = {latitude: 37.3318456, longitude: -122.0296002};
const destination = {latitude: 37.771707, longitude: -122.4053769};
const GOOGLE_MAPS_APIKEY = 'AIzaSyC8lpkvXFDua9S2al669zfwz7GSkeVFWs4';

// this.mapView = null;

// <Text>
// XD
// </Text>

const MyMapView = (props) => {
  console.log('MyMapView Renedering');
  console.log(props);
  // height = (props.height)?props.height+300:height;
  return (
    <MapView
        style={{ flex: 1,  height: height-100,  width: width }}
        // region={{origin}}
        region={props.region}
        showsUserLocation={true}
        ref={c => this.mapView = c}
        onRegionChangeComplete={(reg) => props.onRegionChange(reg)}
        >
          {
            //   <MapView.Marker
            //    coordinate={props.selectedLatLong}
            //    title={"title"}
            //    description={"description"}
            // />
            // NOTE: MapViewDirections Can Have
            // onStart={(params) => {
            //  console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
            // }}
          }
    </MapView>
  )
}
export default MyMapView;



  // <MapViewDirections
  //   origin={props.form_from}
  //   destination={props.form_to}
  //   apikey={GOOGLE_MAPS_APIKEY}
  //   strokeWidth={5}
  //   strokeColor="#4372AA"
  //   onReady={result => {
  //     props.getData(result)
  //     // console.log(`Distance: ${result.distance} km`)
  //     // console.log(`Duration: ${result.duration} min.`)
  //     this.mapView.fitToCoordinates(result.coordinates, {
  //       edgePadding: {
  //         right: (width / 20),
  //         bottom: (height / 5),
  //         left: (width / 20),
  //         top: (height / 20),
  //       }
  //     });
  //   }}
  //   onError={(errorMessage) => {
  //     console.log('GOT AN ERROR');
  //   }}
  // />
