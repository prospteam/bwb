import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';

import {Actions} from 'react-native-router-flux';
import { SegmentedControls } from 'react-native-radio-buttons';
import ValidationComponent from 'react-native-form-validator';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
import Helpers from '../../Helpers';

export default class Form extends ValidationComponent {

    constructor(props){
        super(props);
        this.state = {
            firstname: '',
            lastname: '',
            username: '',
            password: '',
            confirmpass: '',
            email: '',
            phone: '',
            city: '',
            zip: '',
            // selectedOption: 'Driver'
        }
    }

    onClickListener = (viewId) => {
        const { firstname }  = this.state;
        const { lastname }  = this.state;
        const { username }  = this.state;
        const { password }  = this.state;
        const { email }  = this.state;
        const { phone }  = this.state;
        const { city }  = this.state;
        const { zip }  = this.state;
        const { confirmpass }  = this.state;
        // const { selectedOption } = this.state;

        // Call ValidationComponent validate method
          this.validate({
            firstname: {required: true},
            lastname: {required: true},
            username: {required: true},
            password: {minlength:6, required: true},
            email: {email: true, required: true},
            phone: {required: true},
            city: {required: true},
            zip: {numbers: true, required: true},
            // selectedOption: {required: true}
          });

      if(viewId == "RegisterSubmit"){
          if(this.isFormValid()){
              fetch(Helpers.api_url+'register_rider', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({

              username: username,
              password: password,
              firstname: firstname,
              lastname: lastname,
              email: email,
              phone: phone,
              city: city,
              zip: zip,
              confirmpass: confirmpass,
              user_type: "Rider"

            })

          }).then((response) => response.json())
            .then((responseJson) => {
              console.log(responseJson);
             if(responseJson.response === 'success')
              {
                  Alert.alert('Successfully registered.');
                  // this.login();
                  this.props.navigation.navigate('Logout');
              }else {
                Alert.alert(JSON.stringify(responseJson.msg));
              }

            }).catch((error) => {
              console.error(error);
            });

        }else{
            Alert.alert(this.getErrorMessages());
        }
      }
    }

    render() {
        const options = [
            "Rider",
            "Driver"
        ];

        function setSelectedOption(selectedOption) {
            this.setState({
                selectedOption
            });
        }

        function renderOption(option, selected, onSelect, index){
            const style = selected ? { fontWeight: 'bold'} : {};

            return (
              <TouchableWithoutFeedback onPress={onSelect} key={index}>
                <Text style={style}>{option}</Text>
              </TouchableWithoutFeedback>
            );
          }

          function renderContainer(optionNodes){
            return <View>{optionNodes}</View>;
          }

        return(
            <View style={styles.container}>
                {/*<View style={styles.radioBox}>
                    <SegmentedControls
                    tint={'#d3a04c'}
                    selectedTint= {'white'}
                    backTint= {'#1e2126'}
                    options={ options }
                    allowFontScaling={ false } // default: true
                    onSelection={ setSelectedOption.bind(this) }
                    selectedOption={this.state.selectedOption }
                    optionStyle={{fontFamily: 'AvenirNext-Medium'}}
                    optionContainerStyle={{flex: 1}}
                  />
                  <Text style={styles.textStyle}>You are a {this.state.selectedOption || 'none'}</Text>
                </View>*/}

                <View style={styles.inputWrap}>
                    <TextInput style={styles.inputBox2} placeholder="First Name" onChangeText={(firstname) => this.setState({firstname})} />
                    <TextInput style={styles.inputBox2} placeholder="Last Name" onChangeText={(lastname) => this.setState({lastname})} />
                </View>
                <View style={styles.inputWrap}>
                    <TextInput style={styles.inputBox2} placeholder="Email" keyboardType="email-address" onChangeText={(email) => this.setState({email})} />
                    <TextInput style={styles.inputBox2} placeholder="Phone Number" keyboardType="phone-pad" onChangeText={(phone) => this.setState({phone})} />
                </View>
                <TextInput style={styles.inputBox} placeholder="City" onChangeText={(city) => this.setState({city})} />
                <TextInput style={styles.inputBox} placeholder="ZIP Code" keyboardType="number-pad" onChangeText={(zip) => this.setState({zip})} />
                <TextInput style={styles.inputBox}
                onChangeText={(username) => this.setState({username})}
                placeholder="Username"
                keyboardType="default"
                onSubmitEditing={()=> this.password.focus()}/>

                <TextInput style={styles.inputBox}
                onChangeText={(password) => this.setState({password})}
                underlineColorAndroid='rgba(0,0,0,0)'
                placeholder="Password"
                secureTextEntry={true}
                ref={(input) => this.password = input}
                />

                <TextInput style={styles.inputBox} placeholder="Confirm Password" onChangeText={(confirmpass) => this.setState({confirmpass})} secureTextEntry={true} />
                <Text style={styles.textStyle2}>All fields are required.</Text>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText} onPress={() => this.onClickListener("RegisterSubmit")}>{this.props.type}</Text>
                </TouchableOpacity>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    textStyle: {
        color: '#d3a04c',
        textAlign: 'center',
        marginTop: 20,
    },
    textStyle2: {
        color: '#d60000',
        textAlign: 'left',
        marginTop: 20,
        marginBottom: 30
    },
    inputWrap: {
        flexDirection: 'row'
    },
    radioBox: {
        width: 300,
        backgroundColor: 'transparent',
        fontSize: 14,
        color: '#002f6c',
        marginVertical: 10,
        paddingVertical: 8
    },
    inputBox: {
        width: 300,
        backgroundColor: '#eeeeee',
        borderRadius: 2,
        paddingHorizontal: 16,
        fontSize: 14,
        color: '#002f6c',
        marginVertical: 10,
        paddingVertical: 8
    },
    inputBox2: {
        width: 145,
        backgroundColor: '#eeeeee',
        borderRadius: 2,
        paddingHorizontal: 16,
        fontSize: 14,
        color: '#002f6c',
        marginVertical: 10,
        marginLeft: 5,
        marginRight: 5,
        paddingVertical: 8
    },
    button: {
        width: 300,
        backgroundColor: '#d3a04c',
        borderRadius: 25,
        marginVertical: 10,
        paddingVertical: 12
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'center'
    }
});
