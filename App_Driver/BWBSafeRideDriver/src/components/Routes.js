import React, { Component } from 'react';
import {Router, Stack, Scene, Actions} from 'react-native-router-flux';
import { Container, Content, Header, Left, Body, Icon, View } from 'native-base';

import LoginView from './LoginView';
import RegisterView from './RegisterView';
import SideBarMenu from './SideBarMenu';
import App from '../../App';
import companyLogosm from '../assets/images/main_logo-sm.png';
// import AsyncStorage from '@react-native-community/async-storage';

export default class Routes extends Component {

      // checkSession = async () => {
      //   console.log('here');
      //   if(await AsyncStorage.getItem('userData')){
      //     // this.setState({
      //     //   isLogged: true,
      //     //   });
      //     console.log('naa');
      //     console.log(await AsyncStorage.getItem('userData'));
      //   }else{
      //       this.props.navigation.navigate('Logout');
      //   }
      //   // setTimeout(() => {
      //   //   this.setState({
      //   //     isLoading: false,
      //   //     });
      //   //   }, 1000);
      // }

    render() {
      // console.log("calling");
      // console.log(this.props);
      // this.checkSession();

        return (
          <Router barButtonIconStyle ={styles.barButtonIconStyle}
                hideNavBar={false}
                navigationBarStyle={{backgroundColor: '#1c1b22',}}
                titleStyle={{color: '#d3a04c',}}
            >
            <Scene>
                <Stack key="root">
                    {/* loader or Splash screen here*/}
                    <Scene hideNavBar={true} key="login" component={sceneProps => <LoginView  {...this.props} />} title="Login"/>
                    <Scene hideNavBar={true} key="register" component={sceneProps => <RegisterView  {...this.props} />} title="Register"/>
                </Stack>
           </Scene>
          </Router>
        );
    }
}

const styles = {
    barButtonIconStyle: {
        tintColor: 'white'
    }
}
