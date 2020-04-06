import React, { Component } from 'react';
import MapView, { AnimatedRegion, Marker  } from 'react-native-maps';
import { Dimensions, TouchableHighlight, TouchableOpacity, View, Alert } from 'react-native';
import { Icon, Text } from 'native-base';
import MapViewDirections from 'react-native-maps-directions';
import Helpers from '../../Helpers';
import styles from '.././assets/my_styles.js';

let { width, height } = Dimensions.get('window');
// const origin = {latitude: 10.3157, longitude: 123.886};
const destination = {latitude: 37.771707, longitude: 123.4053769};
const GOOGLE_MAPS_APIKEY = 'AIzaSyC8lpkvXFDua9S2al669zfwz7GSkeVFWs4';

// this.mapView = null;

export default class MyMapView extends Component {
  constructor(props) {
  super(props);

  this.mapRef = null;
   this.state = {
    region: {
     latitude: 10.3157,
     longitude: 123.886,
     latitudeDelta:  0.0,
     longitudeDelta:  0.0,
    },
    markers: {
      coordinate: {
        latitude: 4,
        longitude: 4,
        },
      key: 1,
      color: "red",
    },
    marker2:  {
      coordinate: {
        latitude: 10.3157,
        longitude: 123.886,
        },
      key: 2,
      color: "red",
    },
   };
  }
  onMapPress(e) {
      this.setState({
         markers: 
         {
            coordinate: e.nativeEvent.coordinate,
            key: 2,
            color: "red",
         },
      });

   SaveAddress=()=>{
     console.log(JSON.stringify(this.state.markers[0].coordinate.latitude))
   }
  }
  onDragMap(e){
    this.setState({
       marker2: 
       {
          coordinate: {
            longitude:e.longitude,
            latitude:e.latitude
          },
          key: 2,
          color: "red",
       },
    });

  }

   render() {
     console.log(this.state.marker2);
      return (
        <>
          
          <MapView
            ref={(ref) => { this.mapRef = ref }}
            provider={this.props.provider}
            style={{height:400}}
            initialRegion={this.state.region}
            onPress={e => this.onMapPress(e)}
            // onRegionChange={e => console.log(e)}
            // onRegionChange={e => this.onDragMap(e)}
          > 
            <Marker
              key={this.state.markers.key}
              coordinate={this.state.markers.coordinate}
              pinColor={this.state.markers.color}
            >
              <View >
                <Text > 
                  {JSON.stringify(this.state.markers.coordinate)}
                </Text>
              </View>
            </Marker>
            <Marker
              key={this.state.marker2.key}
              coordinate={this.state.marker2.coordinate}
              pinColor={this.state.marker2.color}
            >
            </Marker>
          </MapView>
          <Icon style={styles.center_pick_icon} type="FontAwesome5" name="map-marker-alt" />
        </>
      )
    }
}