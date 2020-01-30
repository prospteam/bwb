import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Dimensions, PermissionsAndroid, Image, TouchableOpacity, Text } from 'react-native';
import { Icon } from 'native-base';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import s from "../style";
import { getLocation, watchPosition } from '../../../actions';
import { bindActionCreators } from 'redux';
import MapViewDirections from 'react-native-maps-directions';
import firebase from "../../../firestore.js";
const geolib = require('geolib');

class MapDriverLocationMarker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            driverLocations: [{
                latitude: 0,
                longitude: 0,
            }]
        }
        this.ref = firebase.firestore().collection('driver_location');
    }
    componentDidMount() {
        this.ref.onSnapshot(this.listenDriverLocation);
    }
    listenDriverLocation = (querySnapshot) => {
        let ridercurrloc = this.props.RegionReducer.directionRegions;
        const self = this;
        let markers = {};
        let riderlat, riderlong, driverlat, driverlong;
        markers = querySnapshot.docs.filter((doc) => {
            riderlat = ridercurrloc[0].latitude,
            riderlong = ridercurrloc[0].longitude,
            driverlat = doc.data().latitude;
            driverlong = doc.data().longitude;
            if (geolib.getDistance({ latitude: riderlat, longitude: riderlong },
                { latitude: driverlat, longitude: driverlong }
                ) <= 2000) {
                    return doc;
                }
            });
            let driver_locs = markers.map((doc) => {
                return {
                    latitude: doc.data().latitude,
                    longitude: doc.data().longitude
                }
                
            });
            this.setState({ driverLocations: driver_locs });
    }
    render() {
        return (
            <>
                {
                    this.state.driverLocations.map((coord, index) =>
                        <MapView.Marker key={index} coordinate={coord}>
                            <Icon type="FontAwesome" name="car" style={{ fontSize: 20, color: '#c1191c', marginLeft: 30, marginRight: 10 }} />
                        </MapView.Marker>
                    )
                }
            </>
        );
    }
}
function reduxState(state) {
    return {
        RiderReducer: state.RiderReducer,
        fetchData: state.fetchData,
        RegionReducer: state.RegionReducer
    }
}
function disPatchState(dispatch) {
    return bindActionCreators({
        getLocation: getLocation
    }, dispatch)
}
export default connect(reduxState, disPatchState)(MapDriverLocationMarker);