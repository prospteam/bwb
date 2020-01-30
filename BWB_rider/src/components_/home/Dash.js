import React, { Component } from 'react';
import { View, TouchableOpacity, Dimensions, ScrollView, Animated, TouchableHighlight, StyleSheet, Image } from 'react-native';
import { Container, Header, Content, Button, Left, Right, Icon, Text } from 'native-base';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import s from "./style";
import AsyncStorage from '@react-native-community/async-storage';
import { bindActionCreators } from 'redux';
import MapRiderViewsMarker from "./maps/MapRiderViewsMarker.js";
import AutocompletePlaces from "./maps/AutocompletePlaces.js";
import BottomDrawer from 'rn-bottom-drawer';
import line from '../../assets/images/drawer-line.png';
import BookingDetails from '../booking/BookingDetails';
import { settruefalse, setData, geocode } from '../../actions/Actions';

const CONTAINER_HEIGHT_ANIMATED1 = Math.round(Dimensions.get('window').height) / 3.7;//3.8  3.3
const CONTAINER_HEIGHT_ANIMATED2 = Math.round(Dimensions.get('window').height) / 3.8;//3.8  3.3
const CONTAINER_HEIGHT_DRAWER = Math.round(Dimensions.get('window').height) / 1.8;
const CONTAINER_HEIGHT_DRAWER_UP = Math.round(Dimensions.get('window').height) / 10;
const CONTAINER_HEIGHT_ANIMATED_UP = Math.round(Dimensions.get('window').height) / 1.37;
const CONTAINER_HEIGHT = Math.round(Dimensions.get('window').height);
const CONTAINER_WIDTH = Math.round(Dimensions.get('window').width);
const TAB_BAR_HEIGHT = 0;
const HEADER_HEIGHT = 0;
var isHidden = true;

class Dash extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
    }
    render() {
        let bounceValue, toggledrawer;
        if (this.props.RegionReducer.toggeldrawer === true) {
            toggledrawer = CONTAINER_HEIGHT_ANIMATED_UP;
            bounceValue = new Animated.Value(CONTAINER_HEIGHT_DRAWER_UP);
        } else {
            if (this.props.RegionReducer.directionRegions[1].latitude !== 0) {
                toggledrawer = CONTAINER_HEIGHT_ANIMATED1;
            } else {
                toggledrawer = CONTAINER_HEIGHT_ANIMATED2;
            }

            bounceValue = new Animated.Value(CONTAINER_HEIGHT_DRAWER);
        }
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
                        <TouchableOpacity >
                            <Text style={{ color: "#fff", marginRight: 10 }}>Log Out</Text>
                        </TouchableOpacity>

                    </Right>
                </Header>
                <View>
                    <MapRiderViewsMarker />
                    <Animated.View style={[{ transform: [{ translateY: bounceValue }] }, s.animated, { height: toggledrawer, marginBottom: 40 }]}>
                        <ScrollView style={[s.contentContainer, { width: '90%', backgroundColor: '#A31510', borderRadius: 10, height: 'auto', marginTop: 0 }]}>

                            <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
                                {this.props.RegionReducer.showbookingdetails === false &&
                                    <TouchableOpacity onPress={() => {
                                        this.props.settruefalse('SET_REGION_TRUE_FALSE', data = { state: 'toggeldrawer' });
                                    }}>
                                        <Image source={line} style={{ width: 50, height: 30 }} />
                                    </TouchableOpacity>
                                }
                                {this.props.RegionReducer.showbookingdetails === true &&
                                    <TouchableOpacity onPress={() => {
                                        this.props.settruefalse('SET_REGION_TRUE_FALSE', data = { state: 'showbookingdetails' });
                                    this.props.settruefalse('SET_REGION_TRUE_FALSE_FROM_INPUT_FALSE', data = { state: 'toggeldrawer' })
                                    }}>
                                        <Image source={line} style={{ width: 50, height: 30 }} />
                                    </TouchableOpacity>
                                }

                                <Text style={s.bookingHeader}>{this.props.RegionReducer.directionFormattedAddress[0] === '' ? 'Searching your current location' : (this.props.RegionReducer.showbookingdetails === false ? 'Where are you going?' : 'Booking Details')}</Text>
                            </View>
                            {this.props.RegionReducer.showbookingdetails === false &&
                                < AutocompletePlaces />
                            }
                            {this.props.RegionReducer.showbookingdetails === true &&
                                < BookingDetails />
                            }

                        </ScrollView>
                    </Animated.View>
                </View>

            </Container>
        );
    }
}

function reduxState(state) {
    console.log(state.RegionReducer);

    return {
        RiderReducer: state.RiderReducer,
        fetchData: state.fetchData,
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
export default connect(reduxState, disPatchState)(Dash);