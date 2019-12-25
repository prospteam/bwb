import React from 'react';
import { KeyboardAvoidingView, Alert  } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const GOOGLE_MAPS_APIKEY = 'AIzaSyC8lpkvXFDua9S2al669zfwz7GSkeVFWs4';

class MapInput extends React.Component {
//#1c1b22 BLACK BWB

    state = {
        set_destination_name: null,
        set_destination_lat: null,
        set_destination_long: null
    }

    constructor(props){
        super(props);
    }

    componentDidMount(){

        // for(var key in this.props.latlong) {
        //     if(this.props.latlong.hasOwnProperty(key)) {
        //         var latitude = this.props.latlong['latitude'];
        //         var longitude = this.props.latlong['longitude'];
        //     }
        // }
        //
        // this.setState({set_destination_lat: latitude, set_destination_long: longitude});
        // this.props.notifyChange({latitude: latitude, longitude: longitude});
        // this.reverseGeocode(this.state.set_destination_lat, this.state.set_destination_long);

        // if(typeof(this.props.latlong) !== 'undefined')
        // this.locationRef.setAddressText(this.props.latlong);
        // console.log('hellllllllllloooooooooooooo');
        // console.log(this.props.latlong);
        // console.log('hellllllllllloooooooooooooo');
    }

    // setLocation(loc){
    //     this.locationRef.setAddressText(loc);
    // }

    reverseGeocode(latitude, longitude){
        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + latitude + ',' + longitude + '&key=' + GOOGLE_MAPS_APIKEY)
            .then((response) => response.json())
            .then((responseJson) => {
                // const data = {
                //     // user_id: this.state.userid,
                //     latitude: latitude,
                //     longitude: longitude,
                //     location_name: responseJson.results[0].formatted_address
                // }

                // this.setState({ set_destination_name: responseJson.results[0].formatted_address },
                //     function(){
                //         console.log(this.state.set_destination_name);
                //     }
                // );

                // this.setState({set_destination_name: responseJson.results[0].formatted_address});
                this.locationRef.setAddressText(responseJson.results[0].formatted_address);
                // this.props.notifyChange({latitude: latitude, longitude: longitude},responseJson.results[0].formatted_address);

               //  const self = this;
               //  const api = url()+'api/save_location';
               //
               //  fetch(api, {
               //   method: 'POST',
               //   headers: {
               //     'Accept': 'application/json',
               //     'Content-Type': 'application/json',
               //   },
               //   body: JSON.stringify(data)
               // }).then((response) => response.json())
               //   .then((res) => {
               //      Alert.alert(res.msg);
               //
               //   }).catch((error) => {
               //     console.error(error);
               //   });

            })
    }

    render() {

        for(var key in this.props.latlong) {
            if(this.props.latlong.hasOwnProperty(key)) {
                var latitude = this.props.latlong['latitude'];
                var longitude = this.props.latlong['longitude'];
            }
        }

        this.reverseGeocode(latitude, longitude);

        return (
          <KeyboardAvoidingView
          behavior="padding"
        >
            <GooglePlacesAutocomplete
                // textInputProps={{
                //     onChangeText: (loc) => this.setState({set_destination_name: loc})
                // }}
                ref={(instance) => this.locationRef = instance }
                placeholder={this.props.placeholder}
                minLength={2}
                autoFocus={false}
                returnKeyType={'search'}
                listViewDisplayed={false}
                fetchDetails={true}
                onPress={(data, details = null) => {
                    //'details' is provided when fetchDetails = true
                    this.props.notifyChange(details.geometry.location,data.description);
                    // console.log(data);
                    // console.log(details);
                    // console.log('what a life');
                  }
                }
                query={{
                    key: 'AIzaSyC8lpkvXFDua9S2al669zfwz7GSkeVFWs4',
                    language: 'en'
                }}
                nearbyPlacesAPI='GooglePlacesSearch'
                debounce={200}
                styles={{
                  textInputContainer: {
                    backgroundColor: 'white',
                    borderTopWidth: 0,
                    borderBottomWidth:0,
                    position: 'relative',
                  },
                  padding: {
                    padding: 20
                  },
                  textInput: {
                    borderRadius: 0,
                    paddingLeft:10,
                  },
                  description: {
                    fontWeight: 'bold'
                  },
                  predefinedPlacesDescription: {
                    color: 'red'
                  },
                  listView: {
                    // backgroundColor: 'white',
                    // position: 'absolute',
                    // bottom: 30,
                    // border:1,
                    // padding:3,
                    // zIndex:9999,
                  }
                }}
            />

         </KeyboardAvoidingView>
        );
    }
}
export default MapInput;
