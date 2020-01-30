import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Icon, Text, Spinner, Button, Content, Container } from 'native-base';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import mapstyles from "./style";
import mapstyles2 from "./style2";
import s from "../style";

import { CONSTANT } from '../../helpers/Helper';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { settruefalse, setData, geocode } from '../../../actions/Actions';

class AutocompletePlaces extends Component {
    constructor(props) {
        super(props);
        this.state = {
            findingCurrent: false,
            inputplacecounter: 2,
            location: [
                {
                    latitude: 0,
                    longitude: 0,
                    speed: 0,
                },
                {
                    latitude: 0,
                    longitude: 0,
                    speed: 0,
                }
            ]
        }
    }
    handleupdateLocation = (i, data, formattedaddress, initRegions) => {
        let initlocs = initRegions;
        initlocs[i] = data;
        this.setState({ location: initlocs });
        this.updateLocation(i, formattedaddress);
    }

    updateLocation = (index, formattedaddress) => {
        let formatted = {
            state: 'directionFormattedAddress',
            value: formattedaddress,
            idx: index
        }
       
        this.props.setData('SET_FORMATTED_ASDDRESS', data = formatted);
        if (this.props.RegionReducer.directionRegions.length == 2) {
            this.props.setData('SET_DATA_REGION', data = { state: 'directionRegions', value: this.state.location });
            this.props.settruefalse('SET_REGION_TRUE_FALSE', data = { state: 'toggeldrawer' });
        }
    }

    submitmultipleDestination = () => {
        let counter = 0;
        let filter_inputs = this.props.RegionReducer.directionRegions;
        filter_inputs.map((data, i) => {
            if (data.latitude === 0) {
                counter += 1;
            }
        });
        if (counter === 0) {
            let loc ;
            if (this.state.location[0].latitude===0) {
                loc = this.props.RegionReducer.directionRegions;
            }else{
                loc = this.state.location;
            }
            this.props.setData('SET_DATA_REGION', data = { state: 'directionRegions', value: loc });
            this.props.settruefalse('SET_REGION_TRUE_FALSE', data = { state: 'toggeldrawer' });
        }
    }
    addDestination = () => {
        if (this.props.RegionReducer.directionRegions.length < 3) {
            let current_state_loc = this.props.RegionReducer.directionRegions;
            let current_state_formatted = this.props.RegionReducer.directionFormattedAddress;
            current_state_loc[this.props.RegionReducer.directionRegions.length] = {
                latitude: 0,
                longitude: 0,
                speed: 0
            }
            current_state_formatted[this.props.RegionReducer.directionFormattedAddress.length] = '';
            this.props.setData('SET_DATA_REGION', data = { state: 'directionRegions', value: current_state_loc });
            this.props.setData('SET_DATA_REGION', data = { state: 'directionFormattedAddress', value: current_state_formatted });
        }
    }
    removeInput = (idx) => {
        let current_state_loc = this.props.RegionReducer.directionRegions.filter((data, i) => { return i !== idx; });
        let current_state_formatted = this.props.RegionReducer.directionFormattedAddress.filter((data2, i2) => { return i2 !== idx; });
        this.props.setData('SET_DATA_REGION', data = { state: 'directionRegions', value: current_state_loc });
        this.props.setData('SET_DATA_REGION', data = { state: 'directionFormattedAddress', value: current_state_formatted });
    }

    render() {
        if (this.props.RegionReducer.directionFormattedAddress[0] !== '') {
            inputPlaces = this.props.RegionReducer.directionRegions.map((data, i) => {
                let loader, palceholder, inputPlaces, color_;
                let defaultval = '';
                if (i === 0) {
                    loader = <Icon type="FontAwesome" name='car' style={{ fontSize: 15, color: '#fff', marginLeft: 10, marginRight: 10 }} />
                    defaultval = this.props.RegionReducer.directionFormattedAddress[0];
                } else {
                    if (this.props.RegionReducer.directionFormattedAddress[i]!==undefined) {
                        defaultval= this.props.RegionReducer.directionFormattedAddress[i];
                    
                    }
                    let destinationmarker_color, typemarker, marginRight;
                    if (i == this.props.RegionReducer.directionRegions.length - 1) {
                        destinationmarker_color = '#f1c40f'; typemarker = 'FontAwesome'; marginRight = 15;
                        loader = <Icon type={typemarker} name='map-pin' style={{ fontSize: 25, color: destinationmarker_color, marginLeft: 10, marginRight: marginRight }} />
                        palceholder = "Destination";
                    } else {
                        destinationmarker_color = '#3498db'; typemarker = 'Entypo'; marginRight = 5;
                        if (this.props.RegionReducer.toggeldrawer === true) {
                            loader = <Icon type={typemarker} name='dots-three-vertical' style={{ fontSize: 25, color: destinationmarker_color, marginLeft: 10, marginRight: marginRight }} />
                            palceholder = "waypoints";
                        } else {
                            if (i == 1 && this.props.RegionReducer.directionRegions.length > 2) {
                                loader = <Icon type={typemarker} name='dot-single' style={{ fontSize: 35, color: destinationmarker_color, marginLeft: 10, marginRight: marginRight, marginBottom: -6 }} />
                            }
                        }
                    }
                }
                return (
                    <View style={this.props.RegionReducer.directionRegions.length >= 3 && this.props.RegionReducer.toggeldrawer === false ? s.parentview2 : s.parentview1} key={i}>
                        {loader}
                        <GooglePlacesAutocomplete
                        
                            placeholder={i == 0 ? palceholder : (i == this.props.RegionReducer.directionRegions.length - 1) ? 'Last Destination' : 'Waypoints'}
                            minLength={2}
                            autoFocus={false}
                            returnKeyType={'search'}
                            listViewDisplayed='false'
                            fetchDetails={true}
                            renderDescription={row => row.description || row.formatted_address || row.name}
                            textInputProps={{
                                onFocus: () => { this.props.settruefalse('SET_REGION_TRUE_FALSE_FROM_INPUT', data = { state: 'toggeldrawer' }) }
                            }}
                            onPress={(data, details = null) => {
                                let regiondata = {
                                    latitude: details.geometry.location.lat,
                                    longitude: details.geometry.location.lng
                                }
                                this.handleupdateLocation(i, regiondata, details.formatted_address, this.props.RegionReducer.directionRegions);
                            }}
                            getDefaultValue={() => { return defaultval }}
                            query={{
                                key: CONSTANT.api_key,
                                language: 'en', // language of the results
                                types: 'geocode', // default: 'geocode'
                                components: 'country:PH'
                            }}
                            styles={i !== this.props.RegionReducer.directionRegions.length - 1 && i !== 0 && this.props.RegionReducer.toggeldrawer === false ? StyleSheet.create({ textInputContainer: { display: 'none' } }) : (i !== 0 && i !== 1 ? (this.props.RegionReducer.toggeldrawer === false ? mapstyles : mapstyles2) : mapstyles)}
                            currentLocation={false}
                            currentLocationLabel="Current location"
                            nearbyPlacesAPI='GooglePlacesSearch'
                            GoogleReverseGeocodingQuery={{
                            }}
                            GooglePlacesSearchQuery={{

                                rankby: 'distance',
                                types: 'postal_code'
                            }}
                            filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
                            debounce={200}
                        />

                        {i !== 0 && i !== 1 && this.props.RegionReducer.toggeldrawer === true &&
                            <TouchableOpacity onPress={() => { this.removeInput(i) }}>
                                <Icon type="FontAwesome" name="times-circle" style={{ fontSize: 18, color: '#f1c40f', padding: 0, marginRight: '5%' }} />
                            </TouchableOpacity>
                        }
                    </View>
                )
            });
        } else {
            inputPlaces = <Spinner color='yellow' size={50} style={{ marginBottom: 0 }} />
        }
        return (
            <View >
                <Content>
                    {inputPlaces}
                    {this.props.RegionReducer.toggeldrawer === true && this.props.RegionReducer.directionRegions.length < 3 &&
                        <View style={s.adddestinationView}>
                            <TouchableOpacity style={s.adddestinationTouchableOpacity}>
                                <Icon type="FontAwesome" name="plus-circle" style={s.adddestinationIcon} />
                                <Text style={{ fontSize: 15, color: 'white' }} onPress={this.addDestination}>Add destination</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </Content>
                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: "center" }}>
                    {this.props.RegionReducer.directionRegions[1].latitude !== 0 && this.props.RegionReducer.toggeldrawer !== true &&
                        <View style={s.infocircleView}>
                        <TouchableOpacity style={s.infocircleTouchableOpacity} onPress={() =>{ 
                            this.props.settruefalse('SET_REGION_TRUE_FALSE', data = { state: 'showbookingdetails' });
                            this.props.settruefalse('SET_REGION_TRUE_FALSE', data = { state: 'toggeldrawer' });
                        } }>
                                <Text style={{ color: '#A31510', fontWeight: 'bold' }}> Book Now </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                            onPress={() => {
                                this.props.settruefalse('SET_REGION_TRUE_FALSE', data = { state: 'showbookingdetails' });
                                this.props.settruefalse('SET_REGION_TRUE_FALSE', data = { state: 'toggeldrawer' });
                            }} >
                                <Icon type="FontAwesome" name="info-circle" style={{ fontSize: 20, color: '#fff', marginLeft: '15%' }} />
                            </TouchableOpacity>
                        </View>
                    }
                    {this.props.RegionReducer.directionRegions.length >= 3 && this.props.RegionReducer.toggeldrawer === true
                        &&
                        <TouchableOpacity style={{
                            flexDirection: 'row', backgroundColor: '#fff', color: '#A31510', width: '80%', borderRadius: 5, height: 50, marginTop: 200, marginBottom: 10, alignItems: 'center', justifyContent: "center"
                        }} onPress={this.submitmultipleDestination}>
                            <Text style={{ fontWeight: 'bold', color: '#A31510' }}> Done </Text>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        );
    }
}
function reduxState(state) {
    console.log(state.RegionReducer);
    return {
        RegionReducer: state.RegionReducer
    }
}
function disPatchState(dispatch) {
    return bindActionCreators({
        settruefalse: settruefalse,
        setData: setData,
        geocode: geocode
    }, dispatch);
}
export default connect(reduxState, disPatchState)(AutocompletePlaces);