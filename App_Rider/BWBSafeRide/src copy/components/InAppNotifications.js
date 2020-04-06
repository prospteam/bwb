import React, { Component } from 'react';
import { View, Text, TouchableHighlight, Alert } from 'react-native';
import { withInAppNotification } from 'react-native-in-app-notification';

export default class InAppNotifications extends Component {

    constructor(props){
        super(props);
    }

    showNotification(){
        Alert.alert(this.props.showNotification);
    }

  render() {
    return (
      <View>
        <Text>This is my app</Text>
        <TouchableHighlight
          onPress={this.showNotification}
        >
          <Text>Click me to trigger a notification</Text>
        </TouchableHighlight>
      </View>
    );
  }
}
