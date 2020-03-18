import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';
import firebase from "../../components/common/Firebase.js";
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const geolib = require('geolib');

export function DRIVER_LOCATION_CHANGE(result) {
    // alert(2222);
    return {
        type: "DRIVER_LOCATION_CHANGE",
        payload: result
    }
}



