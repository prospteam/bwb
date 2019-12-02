import React, { Component } from 'react';
import {Router, Stack, Scene, Actions} from 'react-native-router-flux';
import { Container, Content, Header, Left, Body, Icon, View } from 'native-base';
import { createDrawerNavigator, createAppContainer, DrawerItems } from 'react-navigation';

import LoginView from './LoginView';
import RegisterView from './RegisterView';
import Dashboard from './Dashboard';
import Profile from './Profile';
import History from './History';
import Payment from './Payment';
import SideBarMenu from './SideBarMenu';
import App from '../../App';
import companyLogosm from '../assets/images/main_logo-sm.png';

const DrawerContent = (props) => (
  <View>
    <View
      style={{
        backgroundColor: '#1c1b22',
        height: 140,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image style={{aspectRatio: 88 / 49}} source={companyLogosm} />
    </View>
    <DrawerItems {...props} activeTintColor='#1c1b22' activeBackgroundColor='#e3e3e3' inactiveTintColor='#1c1b22' inactiveBackgroundColor='transparent' />
  </View>
);

const MyDrawerNavigator = createDrawerNavigator({
      Dashboard:{
          screen: Dashboard,
      },
      Profile: {
          screen: Profile,
      },
      History: {
          screen: History,
      },
      Payment: {
          screen: Payment,
      }
    },
    {
      contentComponent: DrawerContent,
    }
);

const MyApp = createAppContainer(MyDrawerNavigator);

export default class Navigation extends Component {

    render() {
        return (
          <MyApp />
        );
    }
}

const styles = {
    barButtonIconStyle: {
        tintColor: 'white'
    }
}
