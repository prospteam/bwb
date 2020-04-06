// import axios from 'axios';
// import Geolocation from '@react-native-community/geolocation';
// import firebase from "../../components/common/Firebase.js";
// import { Alert } from 'react-native';
// import AsyncStorage from '@react-native-community/async-storage';

// const geolib = require('geolib');

export function SET_DISPLAY_DRIVER_LOCATION(result) {
    return {
        type: "SET_DISPLAY_DRIVER_LOCATION",
        payload: result
    }
}
export function DRIVER_LOCATION_CHANGE(result) {
    return {
        type: "DRIVER_LOCATION_CHANGE",
        payload: result
    }
}
export function BOOKING_LIST_REFRESH_CHANGE(result) {
    return {
        type: "BOOKING_LIST_REFRESH_CHANGE",
        payload: result
    }
}

