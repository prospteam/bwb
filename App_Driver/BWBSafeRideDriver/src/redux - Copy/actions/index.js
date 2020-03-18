import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';
import firebase from "../../components/common/Firebase.js";
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const geolib = require('geolib');

export function getDatas(type_, result) {
    return {
        type: type_,
        payload: result
    }
}
export function sampleFunction(result) {
    // alert(2222);
    return {
        type: "DRIVER_LOCATION_CHANGE",
        payload: result
    }
}

export function getDatasThunk(type_, url_, where = null) {
    return function (dispatch, getState) {
        
        let bodyFormdata = new FormData();
        let sampelState = {}

        sampelState = where;

        if (where !== null) {
            for (var i = 0; i < Object.keys(sampelState).length; i++) {
                bodyFormdata.append(Object.keys(sampelState)[i], sampelState[Object.keys(sampelState)[i]]);
            }
            // axios({
            //     method: 'post',
            //     url: url_,
            //     data: bodyFormdata,
            //     config: { headers: { 'Content-Type': 'multipart/form-data' } }

            // })
            //     .then(function (result) {
              
            //         dispatch(getDatas(type_, result.data));
            //     })
            //     .catch((error) => {
            //         console.error(error, "HEHEHE ERRORR")
            //     });
        } else {
            fetch(url_).then(res => res.json()).then(res => {
                dispatch(getDatas(type_, res));
            });
        }
    }
}

export function getsingleData(type, sdata) {
    return {
        type: type,
        payload: sdata
    }
}

export function getCalculations(data) {
    return {
        type: 'CALCULATIONS',
        payload: data,
    }
}
export function set_Destination(type, data) {
    return {
        type: type,
        payload: data,
    }
}
export function set_calculate_destination(type, data) {
    return {
        type: type,
        payload: data,
    }
}
export function set_pinned(type, data) {
    return {
        type: type,
        payload: data,
    }
}

export function setData(type_, data) {
    return  {
        type: type_, 
        payload: data 
    }
}
export function setData2(type_, data) {
    return  {
        type: type_, 
        payload: data 
    }
}
export function set_TRUE_FALSE(type_, data) {
    return {
        type: type_,
        payload: data 
    }
}

export function get_data(url, parameter = {}, state) {
    return (dispatch) => {
        // axios({
        //     method: 'post',
        //     url: url,
        //     data: parameter,
        //     config: { headers: { 'Content-Type': 'multipart/form-data' } }
        // }).then((res) => {
        //     dispatch({ type: 'GET_DATA', payload: { state: state, data: data } });
        // });
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

    return function(dispatch){
        return Geolocation.getCurrentPosition((position) => {
            let region = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121
            }
            // Action.get_data_FIRESTORE({ latitude: position.coords.latitude, longitude: position.coords.longitude });
            RegionChange(region);
            return dispatch({
                type: 'SET_DATA',
                payload: { state: 'current_loc', value: { latitude: position.coords.latitude, longitude: position.coords.longitude } }
            });
        }, (error) => { console.log(error.code, error.message); },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
    }
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


