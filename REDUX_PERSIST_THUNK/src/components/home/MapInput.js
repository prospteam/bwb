import React, { Component } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

class MapInput extends React.Component {
    render() {
        render(
            <GooglePlacesAutocomplete
                placeholder="Search"
                minLength={2}
                autoFocus={true}
                returnKeyType={'search'}
                listViewDisplayed={false}
                fetchDetails={true}
                onPress={(data, detials = null) => {
                    this.props.notifyChange(details.geometry.location);
                }}
                query={{
                    key: 'AIzaSyCsCARtyDaiIeDtGY0r3jz4pT4YwiR41Fw',
                    language: 'en'
                }}
                nearbyPlacesAPI='GooglePlacesSearch'
                debounce={200}
                />
        );
    }
}
