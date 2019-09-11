import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

class MapInput extends React.Component {
//#1c1b22 BLACK BWB
    render() {
        return (

            <GooglePlacesAutocomplete
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
                  },
                  padding: { padding: 20 },
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
                  listView: {}
                }}
            />
        );
    }
}
export default MapInput;
