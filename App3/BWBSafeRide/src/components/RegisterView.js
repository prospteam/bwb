import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import Form from './Form';

import backgroundImg from '../assets/images/mobile-bg.jpg';

export default class RegisterView extends Component {

    goBack() {
        Actions.pop()
    }

    render() {
        return(
            <ScrollView>
                <ImageBackground style={styles.container} source={backgroundImg}>
                    <Text>{'\n'}</Text>
                    <Text style={{color: '#fff'}}>{'Intro text goes here...'}</Text>
                    <Form {...this.props} type="Register" />
                    <View style={styles.signupTextCont}>
                        <Text style={styles.signupText}>Already have an account? </Text>
                        <TouchableOpacity onPress={this.goBack}><Text style={styles.signupButton}>Sign in</Text></TouchableOpacity>
                    </View>
                </ImageBackground>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
    },
    signupTextCont: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingVertical: 16,
      flexDirection: 'row'
    },
    signupText: {
      color: '#d3a04c',
      fontSize:16
    },
    signupButton: {
        color: '#d3a04c',
        fontSize:16,
        fontWeight: '500',
        textDecorationLine: "underline"
    }
});
