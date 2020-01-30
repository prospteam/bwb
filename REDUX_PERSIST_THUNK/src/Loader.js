import React, { Component } from 'react';
import { Alert, TextInput, View, StyleSheet } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';
var Spinner = require('react-native-spinkit');
import { Actions } from 'react-native-router-flux';

export default class Loader extends Component {
    constructor(props) {
      super(props);
      this.state = {
          isLoading: true
      }
    }

    componentDidMount(){
            Actions.Dashboard();
    //    this.getData();
        console.log('mounted loader');
    }

    componentWillReceiveProps(){
        Actions.Dashboard();
    }
    async getData(responseJson) {
        try {
            console.log('isMounted');
            let userData = await AsyncStorage.getItem("userData");
            let data = JSON.parse(userData);
            if(userData === null){
                Actions.Dashboard();

            }
        } catch (error) {
            console.log("Something went wrong", error);
        }
    }

    render() {

          return (
            <View style={styles.container}>
              <Spinner type="WanderingCubes" color="#c1191c" size={50} />
            </View>
            );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: undefined,
    height: undefined
  }
});
