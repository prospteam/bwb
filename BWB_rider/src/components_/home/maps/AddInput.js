import React, { Component } from 'react';
import { Alert, View, StyleSheet, Switch, TouchableOpacity, Image ,BackHandler, ScrollView, TextInput, Dimensions } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Form, Item, Input, Label, DatePicker } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Actions } from 'react-native-router-flux';
import BottomDrawer from 'rn-bottom-drawer';
import line from '../../../assets/images/drawer-line.png';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geolocation from '@react-native-community/geolocation';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view';
import Polyline from '@mapbox/polyline';
import getDirections from 'react-native-google-maps-directions';
import MapViewDirections from 'react-native-maps-directions';
import {url} from '../../helpers/Helper';
import axios from 'axios';
import {connect} from 'react-redux';

class AddInput extends Component {
    constructor(props) {
        super(props);
    }
    render(){
        return(
            renderContent = () => {
                const { show, date, mode } = this.state;
                return (
                    <View style={s.contentContainer}>
                        <View>
                            <View style={{ flexDirection: 'column', marginTop: 5, marginBottom: 30 }}>
                                <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 5, marginBottom: 28 }}>
                                    <Image source={line} style={{width: 50, height: 30}} />
                                    <Text style={s.bookingHeader}>Where are you going?</Text>
                                </View>

                                <View>

                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Icon type="FontAwesome" name="circle" style={{fontSize: 12, color: 'red', marginLeft: 30, marginRight: 10 }} />
                                        <GooglePlacesAutocomplete
                                             placeholder='My current location'
                                             minLength={2} // minimum length of text to search
                                             autoFocus={false}
                                             returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                                             listViewDisplayed='false'    // true/false/undefined
                                             fetchDetails={true}
                                             renderDescription={row => row.description || row.formatted_address || row.name} // custom description render
                                             onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                                               // console.log(data, details);
                                               this.setState({
                                                   mapRegion: {
                                                       latitude: details.geometry.location.lat,
                                                       longitude: details.geometry.location.lng,
                                                       latitudeDelta:  0.015,
                                                       longitudeDelta: 0.0121
                                                   },
                                                   location: [{
                                                       latitude: details.geometry.location.lat,
                                                       longitude: details.geometry.location.lng
                                                   }],
                                                   curr_locsss:[details.formatted_address] ,
                                                   lastLat: details.geometry.location.lat,
                                                   lastLong: details.geometry.location.lng,
                                                   latitudeDelta:  0.015,
                                                   longitudeDelta: 0.0121
                                               });
                                                  this.props.BookingCurrLocation();
                                                  this.props.BookingCurrLocation2();
                                             }}

                                             getDefaultValue={() => ''}

                                             query={{
                                               // available options: https://developers.google.com/places/web-service/autocomplete
                                               key: GOOGLE_MAPS_APIKEY,
                                               language: 'en', // language of the results
                                               types: 'geocode' // default: 'geocode'
                                             }}

                                             styles={{
                                               textInputContainer: {
                                                 backgroundColor: 'white',
                                                 borderTopWidth: 0,
                                                 borderColor: 'red',
                                                 borderBottomWidth: 2,
                                                 width: '90%'
                                               },
                                               padding: { padding: 20 },
                                               textInput: {
                                                 borderRadius: 0,
                                                 paddingLeft:10,
                                                 paddingVertical: 10,
                                               },
                                               description: {
                                                 fontWeight: 'bold'
                                               },
                                               predefinedPlacesDescription: {
                                                 color: 'red'
                                               },
                                               listView: {}
                                             }}

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
                                             // predefinedPlaces={[homePlace, workPlace]}

                                             debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                                            />
                                        </View>
                                        {/*<Label style={{paddingLeft: 30, marginTop: 15, fontSize: 14}}>Drop-Off</Label>*/}
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            {this.state.showInput == false && <Icon type="FontAwesome" name="map-marker" style={{fontSize: 14, color: 'blue', marginLeft: 30, marginRight: 10 }} />}
                                            {this.state.showInput == true && <Icon type="FontAwesome" name="circle" style={{fontSize: 12, color: 'blue', marginLeft: 30, marginRight: 10 }} />}
                                            <GooglePlacesAutocomplete
                                                 placeholder="I'm going to..."
                                                 minLength={2} // minimum length of text to search
                                                 autoFocus={false}
                                                 returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                                                 listViewDisplayed='true'    // true/false/undefined
                                                 fetchDetails={true}
                                                 renderDescription={row => row.description} // custom description render
                                                 onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                                                   console.log(details);
                                                   this.setState({
                                                       mapRegion: {
                                                           latitude: details.geometry.location.lat,
                                                           longitude: details.geometry.location.lng,
                                                           latitudeDelta:  0.015,
                                                           longitudeDelta: 0.0121
                                                       },
                                                       location: [
                                                           ...this.state.location,
                                                           {
                                                           latitude: details.geometry.location.lat,
                                                           longitude: details.geometry.location.lng
                                                           }
                                                       ],
                                                      destination_locsss: [...this.state.destination_locsss,details.formatted_address],
                                                       lastLat: details.geometry.location.lat,
                                                       lastLong: details.geometry.location.lng,
                                                       latitudeDelta:  0.015,
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

                                                 styles={{
                                                   textInputContainer: {
                                                     backgroundColor: 'white',
                                                     borderTopWidth: 0,
                                                     borderColor: 'red',
                                                     borderBottomWidth: 2,
                                                     width: '90%'
                                                   },
                                                   padding: { padding: 20 },
                                                   textInput: {
                                                     borderRadius: 0,
                                                     paddingLeft:10,
                                                     paddingVertical: 10,
                                                   },
                                                   description: {
                                                     fontWeight: 'bold'
                                                   },
                                                   predefinedPlacesDescription: {
                                                     color: 'red'
                                                   },
                                                   listView: {}
                                                 }}

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

                                            {this.state.showInput == true &&
                                                <View>
                                                <Label style={{paddingLeft: 30, marginTop: 15, fontSize: 14}}>Drop-Off</Label>
                                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                    <Icon type="FontAwesome" name="map-marker" style={{fontSize: 14, color: 'blue', marginLeft: 30, marginRight: 10 }} />
                                                    <GooglePlacesAutocomplete
                                                         placeholder="I'm going to..."
                                                         minLength={2} // minimum length of text to search
                                                         autoFocus={false}
                                                         returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                                                         listViewDisplayed='true'    // true/false/undefined
                                                         fetchDetails={true}
                                                         renderDescription={row => row.description} // custom description render
                                                         onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                                                           // console.error(data, details);
                                                           this.setState({
                                                               mapRegion: {
                                                                   latitude: details.geometry.location.lat,
                                                                   longitude: details.geometry.location.lng,
                                                                   latitudeDelta:  0.015,
                                                                   longitudeDelta: 0.0121
                                                               },
                                                               location: [
                                                                   ...this.state.location,
                                                                   {
                                                                   latitude: details.geometry.location.lat,
                                                                   longitude: details.geometry.location.lng
                                                                   }
                                                               ],
                                                              destination_locsss: [...this.state.destination_locsss,details.formatted_address],
                                                               lastLat: details.geometry.location.lat,
                                                               lastLong: details.geometry.location.lng,
                                                               latitudeDelta:  0.015,
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

                                                         styles={{
                                                           textInputContainer: {
                                                             backgroundColor: 'white',
                                                             borderTopWidth: 0,
                                                             borderColor: 'red',
                                                             borderBottomWidth: 2,
                                                             width: '90%'
                                                           },
                                                           padding: { padding: 20 },
                                                           textInput: {
                                                             borderRadius: 0,
                                                             paddingLeft:10,
                                                             paddingVertical: 10,
                                                           },
                                                           description: {
                                                             fontWeight: 'bold'
                                                           },
                                                           predefinedPlacesDescription: {
                                                             color: 'red'
                                                           },
                                                           listView: {}
                                                         }}
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
                                                        <View style={{position: 'absolute', top: 0, left: 0, right: 25, bottom: 15, justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                                                            <Icon type="FontAwesome" name="times" style={{fontSize: 18, color: '#000' }} onPress={() => {this.addDestination(false, this.state.count)}} />
                                                        </View>
                                                    </View>
                                                    </View>
                                            }
                                            {this.state.textInput.map((value, index) => {
                                              return value
                                            })}
                                                <TouchableOpacity style={{marginTop: 30}} onPress={() => this.addTextInput(this.state.count)}>
                                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                        <Icon type="FontAwesome" name="plus-circle" style={{fontSize: 14, color: '#000', marginLeft: 30, marginRight: 10 }} />
                                                        <Text style={{fontSize: 13}}>Add destination</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                {this.state.add == true && this.state.count > 0 &&
                                                <View style={{position: 'absolute', top: 0, left: 0, right: 45, bottom: 15, justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                                                    <Icon type="FontAwesome" name="times-circle" style={{fontSize: 18, color: '#000' }} onPress={() => {this.removeTextInput(this.state.count)}} />
                                                </View>}
                                </View>
                            </View>
                            <View>
                                <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: 30, marginBottom: 40}}>
                                    <View  style={{flexDirection: 'row'}}><Switch onValueChange = {this.toggleSwitch} value={this.state.switchValue} trackColor={{false: '#ddd', true: "#32CD32"}} thumbColor={'#c1191c'} /><Text> Advance Booking</Text></View>
                                </View>
                                <View style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center'}}>
                                {this.state.switchValue == true &&
                                    <Text style={{textAlign: 'left', fontWeight: '600', marginBottom: 20}}>Book a ride</Text>}
                                    {this.state.switchValue == true &&
                                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>

                                            <Item stackedLabel>
                                                <Text style={{color: '#a1a1a1', fontSize: 14}}>PICKUP DATE</Text>
                                                <Button onPress={this.datepicker} style={{borderRadius: 3, borderColor: '#a1a1a1', backgroundColor: '#fff', borderWidth: 1, paddingHorizontal: 20, paddingVertical: 5, marginTop: 10}}><Text style={{color: '#000'}}>{this.pickupDate()}</Text></Button>
                                            </Item>
                                            <Item stackedLabel last>
                                                {/*<Label>PICKUP TIME</Label>*/}
                                                <Text style={{color: '#a1a1a1', fontSize: 14}}>PICKUP TIME</Text>
                                                <Button onPress={this.timepicker} style={{borderRadius: 3, borderColor: '#a1a1a1', backgroundColor: '#fff', borderWidth: 1, paddingHorizontal: 20, paddingVertical: 5, marginTop: 10}}><Text style={{color: '#000'}}>{this.state.pickupTime}</Text></Button>
                                            </Item>

                                            { show && <DateTimePicker value={date}
                                                        mode={mode}
                                                        is24Hour={false}
                                                        display="default"
                                                        onChange={this.setDate} />
                                            }
                                    </View>}
                                    <TouchableOpacity style={{marginTop: 30}} onPress={this.transferData}><Text style={{ color: '#c1191c', fontWeight: '700' }}>BOOK NOW</Text></TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                )
            }
        )
    }
}

const mapStateToProps = (state) => {
        console.log('redux state',state);
    return {
            fetchData    : state.fetchData,
            ApiData      : state.ApiData
    }
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({
        getDatas         : getDatas,
        getDatasThunk    : getDatasThunk,
        getsingleData    : getsingleData,
        getCalculations    : getCalculations
    },dispatch)
}

export default connect(mapStateToProps,matchDispatchToProps)(BookingDetails);
