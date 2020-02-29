import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Image,
  Alert,
  Button,
  ImageBackground
} from 'react-native';

import {
  SCLAlert,
  SCLAlertButton
} from 'react-native-scl-alert'

import {Actions} from 'react-native-router-flux';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';

import usernameIcon from '../assets/images/icons8-username-filled-50.png';
import passwordIcon from '../assets/images/icons8-lock-filled-50.png';
import companyLogo from '../assets/images/main_logo.png';
import backgroundImg from '../assets/images/mobile-bg.jpg';

export default class LoginView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      show: false,
      theme: '',
      title: '',
      subtitle: ''
    }
  }

  handleOpen = () => {
    this.setState({ show: true })
  }
 
  handleClose = () => {
    this.setState({ show: false })
  }

  componentDidMount(){
     this.getData();
  }

  register() {
      Actions.register();
  }

  onClickListener = (viewId) => {
      const { username }  = this.state;
      const { password }  = this.state;
      this.setState({ show: true })
    {/*Alert.alert("Alert", "Button pressed: "+viewId);*/}

    if(viewId == "LoginSubmit"){
        fetch('http://web2.proweaverlinks.com/tech/bwbsafe/backend_web_api/api/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({

        username: username,
        password: password

      })
    }).then((response) => response.json())
      .then((responseJson) => {

       if(responseJson.response === 'success')
        {
            this.setData(responseJson.data);
            console.log('CAME XDXD');
            // Actions.dashboard();
            this.props.navigation.navigate('Dashboard');
        }
        else{
          console.log('SCL alert');
          const subtitle_value = JSON.stringify(responseJson.msg);
          console.log(subtitle_value);
          this.setState({ subtitle: subtitle_value });
          //Alert.alert(JSON.stringify(responseJson.msg));
        }

      }).catch((error) => {
        console.error(error);
      });

    }
  }

  // createSession = async () => {
  //   await AsyncStorage.setItem('userId', true);
  //
  //   this.setState({
  //     isLogged: true,
  //     });
  // }

  async setData(responseJson) {
    try {

       await AsyncStorage.setItem('userData', JSON.stringify(responseJson));
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }
  async getData(responseJson) {
    try {
      let userData = await AsyncStorage.getItem("userData");
      let data = JSON.parse(userData);
      console.log(data);
      if(data.login_id !== null){
          Actions.profile();
      }
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }

  render() {
    return (
      <ImageBackground style={styles.container} source={backgroundImg}>
        <Image style={styles.compLogo} source={companyLogo} accessibilityLabel="company logo" />
        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={usernameIcon} />
          <TextInput style={styles.inputs}
              placeholder="Username"
              keyboardType="default"
              underlineColorAndroid='transparent'
              onChangeText={(username) => this.setState({username})}/>
        </View>

        <View>
        {/* <Button title="Show" onPress={this.handleOpen} /> */}
        <SCLAlert
          show={this.state.show}
          onRequestClose={this.handleClose}
          theme="warning"
          title="asdf"
          subtitle="asdfff"
          
        >
          <SCLAlertButton theme="info" onPress={this.handleClose}>Done</SCLAlertButton>
          <SCLAlertButton theme="default" onPress={this.handleClose}>Cancel</SCLAlertButton>
        </SCLAlert>
      </View>

        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={passwordIcon}/>
          <TextInput style={styles.inputs}
              placeholder="Password"
              secureTextEntry={true}
              underlineColorAndroid='transparent'
              onChangeText={(password) => this.setState({password})}/>
        </View>

        <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.onClickListener('LoginSubmit')}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableHighlight>

        {/*<TouchableHighlight style={styles.buttonContainer} onPress={() => this.onClickListener('restore_password')}>
            <Text style={styles.textStyles}>Forgot your password?</Text>
        </TouchableHighlight>*/}

        <TouchableHighlight style={styles.buttonContainer} onPress={this.register}>
            <Text style={styles.textStyles1}>Register</Text>
        </TouchableHighlight>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
    compLogo: {
        width: 162,
        height: 90,
        marginBottom: 50
    },
    textStyles: {
        color: '#fff'
    },
    textStyles1: {
        color: "#d3a04c"
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff'
    },
    inputContainer: {
        borderBottomColor: '#F5FCFF',
        backgroundColor: '#fff',
        borderRadius:30,
        borderBottomWidth: 1,
        width: 250,
        height: 45,
        marginBottom:20,
        flexDirection: 'row',
        alignItems:'center'
    },
    inputs:{
        height:45,
        marginLeft:16,
        borderBottomColor: '#FFFFFF',
        flex:1,
    },
    inputIcon:{
        width: 30,
        height: 30,
        marginLeft:15,
        justifyContent: 'center'
    },
    buttonContainer: {
        height:45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:20,
        width:250,
        borderRadius:30,
    },
    loginButton: {
        backgroundColor: '#d3a04c'
    },
    loginText: {
        color: 'white',
    }
});
