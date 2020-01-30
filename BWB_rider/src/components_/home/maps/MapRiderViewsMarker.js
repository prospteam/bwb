import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Button } from 'native-base';
import { StyleSheet, Dimensions, PermissionsAndroid, Image, TouchableOpacity, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import s from "../style";
import { setData, settruefalse, geocode } from '../../../actions/Actions';
import Geolocation from 'react-native-geolocation-service';
//  import Geolocation from '@react-native-community/geolocation';
import { bindActionCreators } from 'redux';
import MapViewDirections from 'react-native-maps-directions';
import MapDriverLocationMarker from "./MapDriverLocationMarker.js";
import { CONSTANT } from '../../helpers/Helper';
import Geocoder from 'react-native-geocoding';

const CONTAINER_HEIGHT = Math.round(Dimensions.get('window').height);
const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const delta_latitude = 0.059;
const delta_longitude = delta_latitude * ASPECT_RATIO;

class MapRiderViewsMarker extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
            ],
            distance_kilometer: 0,
            region: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: delta_latitude,
                longitudeDelta: delta_longitude
            },
            mapviewEventsregion: {
                latitude: 0,
                longitude: 0,
            },
            mapviewEventsregionLocation: '',
        }
    }
    componentDidMount() {
        this.currentLocation();
    }

    getmarkerLocation = (eventsmarker) => {
        const slef = this;
        this.setState({ mapviewEventsregionLocation: '' });
        this.setState({ mapviewEventsregion: eventsmarker });
        Geocoder.from(eventsmarker.latitude, eventsmarker.longitude)
            .then(json => {
                let addressComponent_ = json.results[0].formatted_address;
                slef.setState({ mapviewEventsregionLocation: addressComponent_ });
            });
    }

    currentLocation() {
        const self = this;
        let region, formatted;
        Geolocation.getCurrentPosition(position => {
            region = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: delta_latitude,
                longitudeDelta: Dimensions.get("window").width / Dimensions.get("window").height * delta_latitude
            }
            let location = this.state.location;
            location[0] = {
                latitude: region.latitude,
                longitude: region.longitude,
            }
            formatted = {
                latitude: region.latitude,
                longitude: region.longitude
            }
            self.setState({ location: location });
            self.setState({ region: region });
            self.props.setData('SET_DATA_REGION', data = { state: 'directionRegions', value: location });
            self.props.settruefalse('SET_REGION_TRUE_FALSE', data = { state: 'findingCurrent' });
            self.props.geocode('SET_FORMATTED_ASDDRESS', data = { state: 'directionFormattedAddress', value: formatted, idx: 0 });
            this.mapView.animateToRegion(region, 10);
        },
            (error) => {
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 0, distanceFilter: 1 }
        );
    }

    render() {
        let eventsmarker = this.state.mapviewEventsregion;
        const origin = this.props.RegionReducer.directionRegions;
        return (

            <MapView ref={(map) => { this.mapView = map; }} showsTraffic={false} style={{ flex: 1, ...StyleSheet.absoluteFillObject, height: CONTAINER_HEIGHT }} showsMyLocationButton={true} followUserLocation={true} provider={PROVIDER_GOOGLE} initialRegion={this.state.region} showsUserLocation={true} zoomEnabled={true}
                mapType="standard"
                onPress={(e) => { this.getmarkerLocation(e.nativeEvent.coordinate) }}
                onPanDrag={(e) => { return '' }}
                onLongPress={(e) => { this.getmarkerLocation(e.nativeEvent.coordinate) }}
            >
                {/* onPanDrag={(e) => { this.getmarkerLocation(e.nativeEvent.coordinate) }}*/}
                {origin.length >= 2 && (
                    <MapViewDirections
                        origin={origin[0]}
                        waypoints={(origin.length > 2) ? origin.slice(1, -1) : null}
                        destination={origin[origin.length - 1]}
                        apikey={CONSTANT.api_key}
                        strokeWidth={5}
                        optimizeWaypoints={true}
                        strokeColor="red"
                        mode="DRIVING"
                        onReady={result => {
                            const distance_kilometer = result.distance;
                            this.setState({ distance_kilometer });
                        }}
                    />
                )}
                <MapView.Circle
                    center={origin[0]}
                    radius={2000}
                    strokeWidth={1}
                    strokeColor="#3399ff"

                />
                {origin.map((coordinate, index) =>
                    <MapView.Marker draggable={true} key={`coordinate_${index}`} coordinate={coordinate} pinColor={index == 0 ? 'blue' : 'green'}
                        onDragEnd={(e) => console.log(e.nativeEvent.coordinate)} >
                        <MapView.Callout tooltip={true} onPress={() => { this.props.settruefalse('SET_REGION_TRUE_FALSE', data = { state: 'toggeldrawer' }) }}>
                            <View style={{ backgroundColor: '#fff', width: screen.width / 2.5 }}>
                                <Text style={{ color: 'black', padding: 10 }}>{this.props.RegionReducer.directionFormattedAddress[index]} </Text>
                            </View>
                            <Button
                                style={{ backgroundColor: '#c1191c', width: screen.width / 2.5, marginTop: 10, height: '30%' }}>
                                <Text style={{ color: '#fff', padding: 10, borderRadius: 10 }}>Edit Location</Text>
                            </Button>

                        </MapView.Callout>
                    </MapView.Marker>
                )}

                <MapView.Marker draggable={false} coordinate={eventsmarker} size={30} pinColor='red'>
                    <MapView.Callout tooltip  onPress={() => { console.log('Bookmark location'); }}>
                        <View style={{ backgroundColor: '#fff', width: screen.width / 2.5 }}>
                            <Text style={{ color: 'black', padding: 10 }}>{this.state.mapviewEventsregionLocation} </Text>
                        </View>
                        <Button
                            style={{ backgroundColor: '#c1191c', width: screen.width / 2.5, marginTop: 10, height: '30%' }}>
                            <Text style={{ color: '#fff', padding: 10, borderRadius: 10 }}>Bookmark location</Text>
                        </Button>
                    </MapView.Callout>
                </MapView.Marker>
                {this.props.RegionReducer.findingCurrent === true &&
                    <MapDriverLocationMarker />
                }
            </MapView>
        );
    }
}
function reduxState(state) {
    return {
        RiderReducer: state.RiderReducer,
        RegionReducer: state.RegionReducer,
        fetchData: state.fetchData
    }
}
function disPatchState(dispatch) {
    return bindActionCreators({
        setData: setData,
        settruefalse: settruefalse,
        geocode: geocode
    }, dispatch)
}
export default connect(reduxState, disPatchState)(MapRiderViewsMarker);