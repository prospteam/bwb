import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

export default class MySession extends Component {

  // constructor(props) {
  //   super(props);
  // }

  // componentDidMount(){
  //    this.getData();
  // }

  // register() {
  //     Actions.register();
  // }

  set = async (name, value) => {
    try {
      // if (await AsyncStorage.getItem(name) == null) {
        await AsyncStorage.setItem(name, value);
        return true;
      // }else {
        // console.log('Already logged');
      // }
    } catch (e) {
      // console.log('err XXX');
      return false;
    }
  }

  get = async (name) => {
    // return "APPLE";
    try {
      if (await AsyncStorage.getItem(name) == null) {
        // await AsyncStorage.setItem(name, 'asddd');
        // console.log('session if');
        return "false";
      }else {
        // console.log('session else');
        // console.log(await AsyncStorage.getItem(name));
        return await AsyncStorage.getItem(name);
      }
    } catch (e) {
      // console.log('err XXX');
      return "false";
    }
  }

/// _____________ OLD FUNCTIONS

  unset = async (name) => {
    try {
      if (await AsyncStorage.getItem(name) != null) {
        await AsyncStorage.removeItem(name);
      }
      return true;
    } catch (e) {
      console.log('err XXX');
      return false;
    }
  }

  storeData = async (asd) => {
    try {
      if (await AsyncStorage.getItem('@storage_Key') == null) {
        await AsyncStorage.setItem('@storage_Key', asd);
        console.log('Success Login');
      }else {
        console.log('Already logged');
      }
    } catch (e) {
      console.log('err XXX');
    }
  }

  removeData = async () => {
    console.log('going out');
    try {
      if (await AsyncStorage.getItem('@storage_Key') != null) {
        await AsyncStorage.removeItem('@storage_Key');
        console.log('Success Logout');
      }else {
        console.log('Already Logged Out');
      }
    } catch (e) {
      console.log('err XXX');
    }
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_Key')
      if(value !== null) {
        return "trueddd";
      }
    } catch(e) {
      return "error Some";
      // error reading value
    }
  }
}
