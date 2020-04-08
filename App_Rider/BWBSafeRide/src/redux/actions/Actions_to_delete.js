import axios from 'axios';
//import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
import firebase from "../firestore.js";
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Geocoder from 'react-native-geocoding';
import { CONSTANT } from '../components/helpers/Helper';
Geocoder.init(CONSTANT.api_key);

const geolib = require('geolib');

export function get_data(url, parameter = {}, state) {
    return (dispatch) => {
        axios({
            method: 'post',
            url: url,
            data: parameter,
            config: { headers: { 'Content-Type': 'multipart/form-data' } }
        }).then((res) => {
            dispatch({ type: 'GET_DATA', payload: { state: state, data: data } });
        });
    }
}

export function call_Firestore(type, collection, collection_id, status) {
    switch (type) {
        case "ONLINE_SATUS":
            return (dispatch) => {
                collection.doc(collection_id).set({
                    status: status,
                    riderId: '',
                    date: ''
                })
                    .then(function () {
                        dispatch({ type: 'SET_TRUE_OR_FALSE', state: 'isLoggedIn' });
                        if (status === 1) {
                            dispatch({ type: 'SET_DATA', payload: { state: 'onlinestatus', value: 'NOT AVAILABLE' } });
                        }
                    })
                    .catch(function (error) {
                        console.error("Error removing document: ", error);
                    });
            }
        default:
            return null;
    }
}
export function get_data_FIRESTORE(parameter) {
    const snapshot = firebase.firestore().collection('driver_location');
    let markers = snapshot.docs.map(doc => {
        let type = '';
        if (doc.data().user_type !== undefined)
            type = doc.data().user_type;
        return {
            coordinate:
            {
                latitude: doc.data().latitude,
                longitude: doc.data().longitude,
                user_type: type.charAt(type.length - 1)
            }
        }
    }).filter(marker => {
        let distance = Action.calculateDistance(parameter.latitude, parameter.longitude, marker.coordinate.latitude, marker.coordinate.longitude);
        return distance <= 2000;
    });

    return (dispatch) => {
        dispatch({ type: 'SET_DATA', payload: { state: 'driver_loc', value: markers } });
    }
}
export function calculateDistance(origLat, origLon, markerLat, markerLon) {
    return geolib.getDistance(
        { latitude: origLat, longitude: origLon },
        { latitude: markerLat, longitude: markerLon }
    );
}
export function RegionChange(region) {
    return (dispatch) => {
        dispatch({ type: 'SET_DATA', payload: { state: 'mapRegion', value: region } });
    }
}
export function getLocation(type, data) {
    Geolocation.getCurrentPosition(
        (position) => {
            let region = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121
            }
            // Action.get_data_FIRESTORE({ latitude: position.coords.latitude, longitude: position.coords.longitude });
            // Action.RegionChange(region, region.latitude, region.longitude);
            return {
                type: 'SET_DATA',
                payload: { state: 'current_loc', value: { latitude: position.coords.latitude, longitude: position.coords.longitude } }
            }
        }
    );
}

export function watchPosition() {
    Geolocation.watchPosition((position) => {
        let region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121
        }

        Action.get_data_FIRESTORE({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        Action.RegionChange(region, region.latitude, region.longitude);
        return (dispatch) => {
            dispatch({ type: 'SET_DATA', payload: { state: 'current_loc', value: { latitude: position.coords.latitude, longitude: position.coords.longitude } } });
        }
    }
    );
}

export function setData(type, data) {
    return {
        type: type,
        payload: data
    }
}

export function settruefalse(type_, data_) {
    return {
        type: type_,
        payload: data_
    }
}

export function geocode(type_, position) {
    return (dispatch) => {
        Geocoder.from(position.value.latitude, position.value.longitude)
            .then(json => {
                var addressComponent_ = json.results[0].address_components[0];
                addressComponent = addressComponent_.long_name;
                var data = {
                    state: position.state,
                    value: addressComponent,
                    idx: position.idx
                }
                dispatch({
                    type: type_,
                    payload: data
                });
            });
    }
}

