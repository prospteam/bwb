import React, { Component } from 'react';

import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';

export default class Storage extends Component {
    constructor() {

    }

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
}
