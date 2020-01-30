import React, { Component } from 'react';
import { Alert, View, StyleSheet, Switch, TouchableOpacity, Image, BackHandler, ScrollView, TextInput, Dimensions, DeviceEventEmitter } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Form, Item, Input, Label, DatePicker } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import MapView, { PROVIDER_GOOGLE, Marker, AnimatedRegion } from 'react-native-maps';
import { Actions } from 'react-native-router-flux';
import BottomDrawer from 'rn-bottom-drawer';
import line from '../../assets/images/drawer-line.png';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
//import Geolocation from '@react-native-community/geolocation';

import Geolocation from 'react-native-geolocation-service';

import { KeyboardAwareView } from 'react-native-keyboard-aware-view';
import Polyline from '@mapbox/polyline';
import getDirections from 'react-native-google-maps-directions';
import MapViewDirections from 'react-native-maps-directions';
import { url } from '../helpers/Helper';
import axios from 'axios';
import { connect } from 'react-redux';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import s from "./style";
import mapstyles from "./maps/style";
import { set_Destination, set_calculate_destination, setData, set_TRUE_FALSE } from '../../actions';
import { bindActionCreators } from 'redux';
import Geocoder from 'react-native-geocoding';
import firebase from "../booking/firestore.js";
  import MapViewsMarker from "./maps/MapViewsMarker.js";
'use strict';
const geolib = require('geolib');
const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
LocationServicesDialogBox.checkLocationServicesIsEnabled({
    message: "<h2 style='color: #0af13e'>Use Location?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
    ok: "YES",
    cancel: "NO",
    enableHighAccuracy: false, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
    showDialog: true, // false => Opens the Location access page directly
    openLocationServices: true, // false => Directly catch method is called if location services are turned off
    preventOutSideTouch: false, // true => To prevent the location services window from closing when it is clicked outside
    preventBackClick: false, // true => To prevent the location services popup from closing when it is clicked back button
    providerListener: true // true ==> Trigger locationProviderStatusChange listener when the location state changes
}).then(function (success) {
    console.log(success); // success => {alreadyEnabled: false, enabled: true, status: "enabled"}
}).catch((error) => {
    console.log(error.message); // error.message => "disabled"
});

DeviceEventEmitter.addListener('locationProviderStatusChange', function (status) { // only trigger when "providerListener" is enabled
    console.log(status); //  status => {enabled: false, status: "disabled"} or {enabled: true, status: "enabled"}
});

const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } } };
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } } };

const TAB_BAR_HEIGHT = 0;
const HEADER_HEIGHT = 0;
const CONTAINER_HEIGHT = Math.round(Dimensions.get('window').height);
const GOOGLE_MAPS_APIKEY = 'AIzaSyAzU1rMg6-CYxTPBowJTby4oWgQVfOzRRY';
var addressComponent;
var current_lat;
var current_long;
var pinned_des = ' ';
var Spinner = require('react-native-spinkit');

var _locs_;
var _destination_locs;
var _curr_locs_;


// Geolocation.getCurrentPosition(
//     position => {
//         let region = {
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//             latitudeDelta: 0.015,
//             longitudeDelta: 0.0121
//         }
//         console.log('current_latcurrent_latcurrent_latcurrent_lat,', region);
//         console.log('current_latcurrent_latcurrent_latcurrent_lat,', position);
//         current_lat = region.latitude;
//         current_long = region.longitude;
//         Geocoder.from(position.coords.latitude, position.coords.longitude)
//             .then(json => {
//                 var addressComponent_ = json.results[0].address_components[0];
//                 addressComponent = addressComponent_.long_name;

//             })
//     }
// );

class Dashboard extends Component {

    state = {
        initialPosition: 'unknown',
        lastPosition: 'unknown',
        mapRegion: null,
        lastLat: null,
        lastLong: null,
        address_form_map: ''
    };
    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('driver_location');
        this.state = {
            userid: null,
            name: 'hehe',
            loggingout: false,
            chosenDate: new Date(),
            date: new Date(),
            mode: 'date',
            show: false,
            location: [],
            computation_for_location: [],
            showInput: false,
            add: false,
            count: 0,
            textInput: [],
            switchValue: false,
            pickupDate: new Date().getMonth() + 1 + '-' + new Date().getDate() + '-' + new Date().getFullYear(),
            pickupTime: this.tConv24(new Date().getHours() + ':' + new Date().getMinutes()),
            curr_location: '',
            destination_: [],
            curr_locsss: [],
            destination_locsss: [],
            input_count: 1,
            current_loc: null,
            driver_loc: []

        }

        this.setDate = this.setDate.bind(this);
        this.logout = this.logout.bind(this);
        this.pickupTime = this.pickupTime.bind(this);
        this.pickupDate = this.pickupDate.bind(this);
        this.transferData = this.transferData.bind(this);
        this.onRegionChange = this.onRegionChange.bind(this);
        this.addDestination = this.addDestination.bind(this);
        this.setLocation = this.setLocation.bind(this);
        this.setDestination = this.setDestination.bind(this);
        this.getData2 = this.getData2.bind(this);
        if (this.props.fetchData.pinned_location.length !== 0) {
            this.setDestination(this.props.fetchData.pinned_location[0].addressname, 1);
            this.setLocation(parseFloat(this.props.fetchData.pinned_location[0].latitude), parseFloat(this.props.fetchData.pinned_location[0].longitude), 1);
            pinned_des = this.props.fetchData.pinned_location[0].addressname;
        }
    }


    watchID: ?number = null;

    reverseGeocode(latitude, longitude) {
        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + latitude + ',' + longitude + '&key=' + GOOGLE_MAPS_APIKEY)
            .then((response) => response.json())
            .then((responseJson) => {
                const data = {
                    user_id: this.state.userid,
                    latitude: latitude,
                    longitude: longitude,
                    location_name: responseJson.results[0].formatted_address
                }

                const self = this;
                const api = url() + 'api/save_location';

                fetch(api, {
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

            })
    }

    transferData() {
        let loc = this.state.location; //location coordinates
        let date = this.state.pickupDate; //pickup date
        let time = this.state.pickupTime; //pickup time
        Actions.BookingDetails();
    }

    pickupDate() {
        return this.state.pickupDate;
    }

    pickupTime() {
        return this.state.pickupTime;
    }

    pad(number, length) {

        var str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }

        return str;
    }
    tConv24(time24) {
        let hourEnd = time24.indexOf(":");
        let H = +time24.substr(0, hourEnd);
        let h = H % 12 || 12;
        let ampm = (H < 12 || H === 24) ? "AM" : "PM";
        let min = time24.substr(hourEnd + 1, 3);
        if (min < 10) {
            min = "0" + min;
        }
        time24 = this.pad(h, 2) + ":" + min + " " + ampm;

        return time24;
    };

    addDestination(data, key) {
        this.setState({
            showInput: data,
            count: count + 1
        });
    }

    removeTextInput(index, counter) {
        const self = this;
        let textInput = this.state.textInput;
        textInput.pop();
        this.setState({ count: index - 1, input_count: counter - 1 });
        this.setState({ textInput })
        
        let destination_locsss = this.state.destination_locsss;
        let computation_for_location = this.state.computation_for_location;
        let newdest, newcmomptation;

        newdest = destination_locsss.filter((data, i) => { return i !== counter })
        newcmomptation = computation_for_location.filter((data, i2) => { return i2 !== counter })
        this.setState({ destination_locsss: newdest, computation_for_location: newcmomptation })
        this.props.set_Destination('Destination', newdest);
        this.props.set_calculate_destination('DIRECTIONS', newcmomptation);
    }
    setDestination(address, i) {
        let x = this.state.destination_locsss;
        x[i] = address;
        this.setState({ destination_locsss: x });
        this.props.set_Destination('Destination', x);
    }

    setLocation(lat, long, i) {
        let x = this.state.computation_for_location;
        x[i] = {
            latitude: lat,
            longitude: long
        }
        this.setState({ computation_for_location: x });
        this.props.set_calculate_destination('DIRECTIONS', x);
    }

    addTextInput = (c, idx_count) => {
        let key = c + 1;
        let counter = idx_count + 1;
        let textInput = this.state.textInput;
        this.setState({ input_count: counter })
        textInput.push(
            <View key={c}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon type="FontAwesome" name="map-marker" style={{ fontSize: 14, color: 'blue', marginLeft: 30, marginRight: 10 }} />
                    <GooglePlacesAutocomplete
                        placeholder="I'm going to..."
                        minLength={2} // minimum length of text to search
                        autoFocus={false}
                        returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                        listViewDisplayed='true'    // true/false/undefined
                        fetchDetails={true}
                        renderDescription={row => row.description} // custom description render
                        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                            this.setLocation(details.geometry.location.lat, details.geometry.location.lng, counter)
                            this.setDestination(details.formatted_address, counter)
                            this.props.setData('SET_DATA', 
                                 data ={ state:'mapRegion',
                                         value:{
                                             latitude: details.geometry.location.lat,
                                             longitude: details.geometry.location.lng,
                                             latitudeDelta: 0.015,
                                             longitudeDelta: 0.0121
                                         }})
                            this.setState({
                                location: [
                                    ...this.state.location,
                                    {
                                        latitude: details.geometry.location.lat,
                                        longitude: details.geometry.location.lng
                                    }
                                ],
                                lastLat: details.geometry.location.lat,
                                lastLong: details.geometry.location.lng,
                                latitudeDelta: 0.015,
                                longitudeDelta: 0.0121
                            });
                        }}

                        getDefaultValue={() => ''}

                        query={{
                            // available options: https://developers.google.com/places/web-service/autocomplete
                            key: GOOGLE_MAPS_APIKEY,
                            language: 'en', // language of the results
                            types: 'geocode' // default: 'geocode'
                        }}

                        styles={mapstyles}

                        //currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
                        //currentLocationLabel="Current location"
                        nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                        GoogleReverseGeocodingQuery={{
                            // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                        }}
                        GooglePlacesSearchQuery={{
                            // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                            rankby: 'distance',
                            types: 'postal_code'
                        }}

                        filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                        //predefinedPlaces={[homePlace, workPlace]}

                        debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                    />
                </View>
            </View>
        );
        this.setState({ textInput });
        this.setState({ count: key });
        this.setState({ add: true });
    }


    setDate = (event, date) => {
        date = date || this.state.date;

        this.setState({
            show: Platform.OS === 'ios' ? true : false,
            date,
        });

        let time = this.tConv24(this.state.date.getHours() + ':' + this.state.date.getMinutes());
        let date2 = this.state.date.getMonth() + 1 + '-' + this.state.date.getDate() + '-' + this.state.date.getFullYear();

        this.setState({
            pickupDate: date2,
            pickupTime: time
        });

    }

    show = mode => {
        this.setState({
            show: true,
            mode
        });
    }

    datepicker = () => {
        this.show('date');
    }

    timepicker = () => {
        this.show('time');
    }

    toggleSwitch = () => {
        this.setState({ switchValue: !this.state.switchValue });
        let time = this.tConv24(this.state.date.getHours() + ':' + this.state.date.getMinutes());
        let date = this.state.date.getMonth() + 1 + '-' + this.state.date.getDate() + '-' + this.state.date.getFullYear();
        this.setState({ pickupDate: date });
        this.setState({ pickupTime: time });
    }



    logout() {
        const self = this;
        self.props.set_TRUE_FALSE('SET_TRUE_FALSE', data = { state: 'isLoggedIn' });
        self.props.setData('SET_DATA', data = { state: 'loggedinData', value: [] });
        Actions.Login();
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            return true;
        });
        this.getData2();
        let self = this;
        self.setLocation(current_lat, current_long, 0);
        this.setDestination(addressComponent, 0);
        
        // Geolocation.getCurrentPosition(
        //     (position) => {
        //         let region = {
        //             latitude: position.coords.latitude,
        //             longitude: position.coords.longitude,
        //             latitudeDelta: 0.015,
        //             longitudeDelta: 0.0121
        //         }
        //         self.setState({ current_loc: { latitude: position.coords.latitude, longitude: position.coords.longitude } });
        //         self.onRegionChange(region, region.latitude, region.longitude);
        //         self.getMarker();
        //     },
        //     (error) => { console.log(error.code, error.message); },
        //     { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        // );

        // this.watchID = Geolocation.watchPosition((position) => {
        //     let region = {
        //         latitude: position.coords.latitude,
        //         longitude: position.coords.longitude,
        //         latitudeDelta: 0.015,
        //         longitudeDelta: 0.0121
        //     }

        //     this.setState({ current_loc: { latitude: position.coords.latitude, longitude: position.coords.longitude } });
        //     this.onRegionChange(region, region.latitude, region.longitude);
        //     //   this.setDriverLoc();
        //     this.getMarker();
        // },
        //     (error) => Alert.alert(JSON.stringify(error)),
        //     { enableHighAccuracy: true, timeout: 20000, maximumAge: 0, distanceFilter: 1 }
        // );
    }

    setDriverLoc() {
        this.ref.doc(this.state.userid).set({
            user_id: this.state.userid,
            user_type: this.state.usertype,
            latitude: this.state.current_loc.latitude,
            longitude: this.state.current_loc.longitude,
        })
    }
    async getData2(responseJson) {
        try {
            let userid = this.props.RiderReducer.loggedinData.userid;
            let type = this.props.RiderReducer.loggedinData.type;
            if (userid!== null) {
                this.setState({ userid:userid, usertype: type });
            }
        } catch (error) {
            console.log("Something went wrong", error);
        }
    }


    renderContent = (current_address_location = '') => {
        console.log('current_address_location', current_address_location);
        const { show, date, mode } = this.state;
        return (
            <View style={s.contentContainer}>
                <View>
                    <View style={{ flexDirection: 'column', marginTop: 5, marginBottom: 30 }}>
                        <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 5, marginBottom: 28 }}>
                            <Image source={line} style={{ width: 50, height: 30 }} />
                            <Text style={s.bookingHeader}>Where are you going?</Text>
                        </View>
                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon type="FontAwesome" name="circle" style={{ fontSize: 12, color: 'red', marginLeft: 30, marginRight: 10 }} />
                                <GooglePlacesAutocomplete
                                    placeholder='My current location'
                                    minLength={2}
                                    autoFocus={false}
                                    returnKeyType={'search'}
                                    listViewDisplayed='false'
                                    fetchDetails={true}
                                    renderDescription={row => row.description || row.formatted_address || row.name} // custom description render
                                    onPress={(data, details = null) => {
                                        console.log(details);
                                        this.setLocation(details.geometry.location.lat, details.geometry.location.lng, 0)
                                        this.setDestination(details.formatted_address, 0)
                                        this.props.setData('SET_DATA',
                                            data = {
                                                state: 'mapRegion',
                                                value: {
                                                    latitude: details.geometry.location.lat,
                                                    longitude: details.geometry.location.lng,
                                                    latitudeDelta: 0.015,
                                                    longitudeDelta: 0.0121
                                                }
                                            })
                                        this.setState({
                                            location: [{
                                                latitude: details.geometry.location.lat,
                                                longitude: details.geometry.location.lng
                                            }],
                                            lastLat: details.geometry.location.lat,
                                            lastLong: details.geometry.location.lng,
                                            latitudeDelta: 0.015,
                                            longitudeDelta: 0.0121
                                        });
                                    }}
                                    getDefaultValue={() => { return addressComponent }}
                                    query={{
                                        key: GOOGLE_MAPS_APIKEY,
                                        language: 'en', // language of the results
                                        types: 'geocode' // default: 'geocode'
                                    }}

                                    styles={mapstyles}
                                    currentLocation={false}
                                    currentLocationLabel="Current location"
                                    nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                                    GoogleReverseGeocodingQuery={{
                                    }}
                                    GooglePlacesSearchQuery={{
                                        // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                                        rankby: 'distance',
                                        types: 'postal_code'
                                    }}


                                    filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                                    // predefinedPlaces={[homePlace, workPlace]}

                                    debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                                />
                            </View>
                            {/*<Label style={{paddingLeft: 30, marginTop: 15, fontSize: 14}}>Drop-Off</Label>*/}
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {this.state.showInput == false && <Icon type="FontAwesome" name="map-marker" style={{ fontSize: 14, color: 'blue', marginLeft: 30, marginRight: 10 }} />}
                                {this.state.showInput == true && <Icon type="FontAwesome" name="circle" style={{ fontSize: 12, color: 'blue', marginLeft: 30, marginRight: 10 }} />}
                                <GooglePlacesAutocomplete
                                    placeholder="I'm going to..."
                                    minLength={2} // minimum length of text to search
                                    autoFocus={false}
                                    returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                                    listViewDisplayed='true'    // true/false/undefined
                                    fetchDetails={true}
                                    renderDescription={row => row.description} // custom description render
                                    onPress={() => (index) => {

                                    }}
                                    onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                                        this.setLocation(details.geometry.location.lat, details.geometry.location.lng, 1)
                                        this.setDestination(details.formatted_address, 1)
                                        this.setData('SET_DATA',
                                            data = {
                                                state: 'mapRegion',
                                                value: {
                                                    latitude: details.geometry.location.lat,
                                                    longitude: details.geometry.location.lng,
                                                    latitudeDelta: 0.015,
                                                    longitudeDelta: 0.0121
                                                }
                                            })
                                        this.setState({
                                            location: [
                                                ...this.state.location,
                                                {
                                                    latitude: details.geometry.location.lat,
                                                    longitude: details.geometry.location.lng
                                                }
                                            ],
                                            lastLat: details.geometry.location.lat,
                                            lastLong: details.geometry.location.lng,
                                            latitudeDelta: 0.015,
                                            longitudeDelta: 0.0121
                                        });
                                    }}

                                    getDefaultValue={() => { return pinned_des }}

                                    query={{
                                        // available options: https://developers.google.com/places/web-service/autocomplete
                                        key: GOOGLE_MAPS_APIKEY,
                                        language: 'en', // language of the results
                                        types: 'geocode' // default: 'geocode'
                                    }}

                                    styles={mapstyles}
                                    nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                                    GoogleReverseGeocodingQuery={{
                                    }}
                                    GooglePlacesSearchQuery={{
                                        rankby: 'distance',
                                        types: 'postal_code'
                                    }}

                                    filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding
                                    debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                                />
                            </View>

                            {this.state.showInput == true &&
                                <View>
                                    <Label style={{ paddingLeft: 30, marginTop: 15, fontSize: 14 }}>Drop-Off</Label>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Icon type="FontAwesome" name="map-marker" style={{ fontSize: 14, color: 'blue', marginLeft: 30, marginRight: 10 }} />
                                        <GooglePlacesAutocomplete
                                            placeholder="I'm going to..."
                                            minLength={2} // minimum length of text to search
                                            autoFocus={false}
                                            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                                            listViewDisplayed='true'    // true/false/undefined
                                            fetchDetails={true}
                                            renderDescription={row => row.description} // custom description render
                                            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                                                console.log(data, details);
                                                this.props.setData('SET_DATA',
                                                    data = {
                                                        state: 'mapRegion',
                                                        value: {
                                                            latitude: details.geometry.location.lat,
                                                            longitude: details.geometry.location.lng,
                                                            latitudeDelta: 0.015,
                                                            longitudeDelta: 0.0121
                                                        }
                                                    })
                                                this.setState({
                                                    location: [
                                                        ...this.state.location,
                                                        {
                                                            latitude: details.geometry.location.lat,
                                                            longitude: details.geometry.location.lng
                                                        }
                                                    ],
                                                    destination_locsss: [...this.state.destination_locsss, details.formatted_address],
                                                    lastLat: details.geometry.location.lat,
                                                    lastLong: details.geometry.location.lng,
                                                    latitudeDelta: 0.015,
                                                    longitudeDelta: 0.0121
                                                });
                                                this.props.BookingDestination()
                                                this.props.BookingDestination2()
                                            }}

                                            getDefaultValue={() => ''}

                                            query={{
                                                // available options: https://developers.google.com/places/web-service/autocomplete
                                                key: GOOGLE_MAPS_APIKEY,
                                                language: 'en', // language of the results
                                                types: 'geocode' // default: 'geocode'
                                            }}

                                            styles={mapstyles}
                                            nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                                            GoogleReverseGeocodingQuery={{

                                            }}
                                            GooglePlacesSearchQuery={{
                                                rankby: 'distance',
                                                types: 'postal_code'
                                            }}

                                            filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}

                                            debounce={200}
                                        />
                                        <View style={{ position: 'absolute', top: 0, left: 0, right: 25, bottom: 15, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                            <Icon type="FontAwesome" name="times" style={{ fontSize: 18, color: '#000' }} onPress={() => { this.addDestination(false, this.state.count) }} />
                                        </View>
                                    </View>
                                </View>
                            }
                            {this.state.textInput.map((value, index) => {
                                return value
                            })}
                            <TouchableOpacity style={{ marginTop: 30 }} onPress={() => this.addTextInput(this.state.count, this.state.input_count)}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Icon type="FontAwesome" name="plus-circle" style={{ fontSize: 14, color: '#000', marginLeft: 30, marginRight: 10 }} />
                                    <Text style={{ fontSize: 13 }}>Add destination</Text>
                                </View>
                            </TouchableOpacity>
                            {this.state.add == true && this.state.count > 0 &&
                                <View style={{ position: 'absolute', top: 0, left: 0, right: 45, bottom: 15, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                    <Icon type="FontAwesome" name="times-circle" style={{ fontSize: 18, color: '#000' }} onPress={() => { this.removeTextInput(this.state.count, this.state.input_count) }} />
                                </View>}
                        </View>
                    </View>
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: 30, marginBottom: 40 }}>
                            <View style={{ flexDirection: 'row' }}><Switch onValueChange={this.toggleSwitch} value={this.state.switchValue} trackColor={{ false: '#ddd', true: "#32CD32" }} thumbColor={'#c1191c'} /><Text> Advance Booking</Text></View>
                        </View>
                        <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
                            {this.state.switchValue == true &&
                                <Text style={{ textAlign: 'left', fontWeight: '600', marginBottom: 20 }}>Book a ride</Text>}
                            {this.state.switchValue == true &&
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <Item stackedLabel>
                                        <Text style={{ color: '#a1a1a1', fontSize: 14 }}>PICKUP DATE</Text>
                                        <Button onPress={this.datepicker} style={{ borderRadius: 3, borderColor: '#a1a1a1', backgroundColor: '#fff', borderWidth: 1, paddingHorizontal: 20, paddingVertical: 5, marginTop: 10 }}><Text style={{ color: '#000' }}>{this.pickupDate()}</Text></Button>
                                    </Item>
                                    <Item stackedLabel last>
                                        {/*<Label>PICKUP TIME</Label>*/}
                                        <Text style={{ color: '#a1a1a1', fontSize: 14 }}>PICKUP TIME</Text>
                                        <Button onPress={this.timepicker} style={{ borderRadius: 3, borderColor: '#a1a1a1', backgroundColor: '#fff', borderWidth: 1, paddingHorizontal: 20, paddingVertical: 5, marginTop: 10 }}><Text style={{ color: '#000' }}>{this.state.pickupTime}</Text></Button>
                                    </Item>

                                    {show && <DateTimePicker value={date}
                                        mode={mode}
                                        is24Hour={false}
                                        display="default"
                                        onChange={this.setDate} />
                                    }
                                </View>}
                            <TouchableOpacity style={{ marginTop: 30 }} onPress={this.transferData}><Text style={{ color: '#c1191c', fontWeight: '700' }}>BOOK NOW</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    async getMarker() {
        const snapshot = await this.ref.get();
        this.setState({ driver_loc: [] });
        let markers = snapshot.docs.map(doc => {
            let type = '';

            if (doc.data().user_type !== undefined)
                type = doc.data().user_type;
                      console.log('doc.data', doc.data());
            return {
                coordinate:
                {
                    latitude: doc.data().latitude,
                    longitude: doc.data().longitude,
                    user_type: type.charAt(type.length - 1)
                }
            }
        }).filter(marker => {
            let distance = this.calculateDistance(this.state.current_loc.latitude, this.state.current_loc.longitude, marker.coordinate.latitude, marker.coordinate.longitude);
            return distance <= 2000;
        });
        this.setState({ driver_loc: markers });
        let coor = '';
    }

    async getDirections(startLoc, destinationLoc) {
        try {
            let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&mode=walking&key=AIzaSyBKvD_JyWVGHXqI-Sna7Jnk1wE3zsKyCAU`);

            let respJson = await resp.json();
            let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
            let coords = points.map((point, index) => {
                return {
                    latitude: point[0],
                    longitude: point[1]
                };
            });
            return coords;
        } catch (error) {
            alert(error);
            return error;
        }
    }

    onRegionChange(region, lastLat, lastLong) {
        console.log('onRegionChange', region);
        this.setState({
            mapRegion: region,
            lastLat: lastLat || this.state.lastLat,
            lastLong: lastLong || this.state.lastLong,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121
        });
    }
    componentWillUnmount() {
        this.backHandler.remove();
        // this.watchID != null && Geolocation.clearWatch(this.watchID);
        Geolocation.clearWatch(this.watchID);
        // used only when "providerListener" is enabled
        LocationServicesDialogBox.stopListener(); // Stop the "locationProviderStatusChange" listener
    }

    calculateDistance(origLat, origLon, markerLat, markerLon) {
        return geolib.getDistance(
            { latitude: origLat, longitude: origLon },
            { latitude: markerLat, longitude: markerLon }
        );
    }


    render() {
        _locs_ = this.state.computation_for_location;
        _destination_locs = this.state.destination_locsss;
        _curr_locs_ = this.state.curr_locsss;
        if (this.state.loggingout === true) {
            return (
                <View style={s.container}>
                    <Spinner type="WanderingCubes" color="#c1191c" size={80} />
                </View>
            );
        } else {
            return (
                <Container style={{ flex: 1 }}>
                    <Header style={{ backgroundColor: '#A31510' }} transparent>
                        <Left>
                            <Button transparent>
                                <TouchableOpacity onPress={() => Actions.drawerOpen()}>
                                    <Icon name='menu' style={{ color: 'white', marginLeft: 10 }} />
                                </TouchableOpacity>
                            </Button>
                        </Left>
                        <Right>
                            <TouchableOpacity onPress={this.logout}>
                                <Text style={{ color: "#fff", marginRight: 10 }}>Log Out</Text>
                            </TouchableOpacity>

                        </Right>
                    </Header>
                    <View style={s.content}>
                     
                      <MapViewsMarker />
                       
                      {/*
                        <BottomDrawer
                            containerHeight={Math.round(Dimensions.get('window').height)}
                            offset={TAB_BAR_HEIGHT + HEADER_HEIGHT}
                            onExpanded={() => { console.log('expanded') }}
                            onCollapsed={() => { console.log('collapsed') }}
                            startUp={false}
                            downDisplay={CONTAINER_HEIGHT / 1.35}
                        >
                            <ScrollView>
                                {this.renderContent(this.state.address_form_map)}
                            </ScrollView>
                        </BottomDrawer>
                            */}
                    </View>
                </Container>
            );
        }

    }
}


const mapStateToProps = (state) => {
  
    return {
        fetchData: state.fetchData,
        RiderReducer: state.RiderReducer
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        set_Destination: set_Destination,
        set_calculate_destination: set_calculate_destination,
        setData: setData,
        set_TRUE_FALSE: set_TRUE_FALSE,
    }, dispatch)
}


export default connect(mapStateToProps, matchDispatchToProps)(Dashboard);



// {
//     this.props.fetchData.directions.length !== 0 &&
//     this.props.fetchData.directions[0].latitude !== undefined &&
//     this.props.fetchData.directions[0].longitude !== undefined &&
//     this.props.fetchData.directions.map((coordinate, index) =>
//         <MapView.Marker key={`coordinate_${index}`} coordinate={coordinate} pinColor={index == 0 ? 'blue' : 'red'}>
//             <MapView.Callout tooltip={true}
//                 style={{ backgroundColor: '#c1191c' }}
//                 onPress={() => this.reverseGeocode(coordinate.latitude, coordinate.longitude)}
//             >
//                 <TouchableOpacity>
//                     <Text style={{ color: '#fff', padding: 10 }}>Bookmark location</Text>
//                 </TouchableOpacity>
//             </MapView.Callout>
//         </MapView.Marker>
//     )
// }

// {/*


//                                      {this.props.RiderReducer.driver_loc.length!==0 &&  this.props.RiderReducer.driver_loc.map((coord, index) => {
//                         if (coord.coordinate.user_type === '2') {
//                             return <MapView.Marker key={index} coordinate={{ latitude: coord.coordinate.latitude, longitude: coord.coordinate.longitude }}>
//                                 <Icon type="FontAwesome" name="car" style={{ fontSize: 20, color: '#c1191c', marginLeft: 30, marginRight: 10 }} />
//                             </MapView.Marker>
//                         }
//                     })}

//                         */}


// {
//     this.props.fetchData.pinned_location && this.props.fetchData.pinned_location.length > 0 &&
//     <MapView.Marker coordinate={{ latitude: parseFloat(this.props.fetchData.pinned_location[0].latitude), longitude: parseFloat(this.props.fetchData.pinned_location[0].longitude) }} pinColor='#45A163'>
//         <MapView.Callout tooltip={true}
//             style={{ backgroundColor: '#45A163' }}
//         >
//             <TouchableOpacity>
//                 <Text style={{ color: '#fff', padding: 10 }}>{this.props.fetchData.pinned_location[0].addressname}</Text>
//             </TouchableOpacity>
//         </MapView.Callout>
//     </MapView.Marker>
// }
// {
//     this.props.fetchData.directions.length >= 2 && (
//         <MapViewDirections
//             origin={this.props.fetchData.directions[0]}
//             waypoints={(this.props.fetchData.directions.length > 2) ? this.props.fetchData.directions.slice(1, -1) : null}
//             destination={this.props.fetchData.directions[this.props.fetchData.directions.length - 1]}
//             apikey={GOOGLE_MAPS_APIKEY}
//             strokeWidth={5}
//             optimizeWaypoints={true}
//             strokeColor="hotpink"
//         />
//     )
// }
