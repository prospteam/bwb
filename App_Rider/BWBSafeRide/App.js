/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

// DEPENDENCIES
import React, {Component} from 'react';
import {YellowBox, Platform, StyleSheet, Text, View, ImageBackground, Image, Alert} from 'react-native';
import { Container, Content, StyleProvider } from 'native-base';
import { createDrawerNavigator, createAppContainer, DrawerItems, DrawerNavigation } from 'react-navigation';
import AsyncStorage, { useAsyncStorage } from '@react-native-community/async-storage';


// My Imports
import getTheme from './native-base-theme/components';
import material from './native-base-theme/variables/material';
import LoginView from './src/components/LoginView';
import RegisterView from './src/components/RegisterView';
import Dashboard from './src/components/Dashboard';
import DriverDashboard from './src/components/DriverDashboard';
import Profile from './src/components/Profile';
import TripHistory from './src/components/TripHistory';
import SavedRoutes from './src/components/SavedRoutes';
import Payment from './src/components/Payment';
import Routes from './src/components/Routes';
import DriverProfile from './src/components/DriverProfile';
import Bookings from './src/components/Bookings';
import PinnedLocations from './src/components/PinnedLocations';
import Sample from './src/components/Sample';
// import * as TripHistory from './src/components/Bookings';
import companyLogosm from './src/assets/images/main_logo-sm.png';

// REDUX DEPENDENCIES
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

// MY IMPORTS
// import Routes from './Routes';
import allReducers from './src/redux/reducers/index.js';

// THESE IS FOR FIREBASE TESTINGS
  // import firebase from './src/components/common/Firebase';
  // firebase.firestore()
  // .collection('watch_new_pending').doc('last_pending').onSnapshot(docSnapshot => {
    //   console.log("dara2");
    // console.log(docSnapshot.data());
    // }, err => {
      //   console.log("error_lagi2");
      //   console.log(err);
      // });
// THESE IS FOR FIREBASE TESTINGS



YellowBox.ignoreWarnings([
  'Warning: componentWillUpdate is deprecated',
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps is deprecated',
  'Warning: isMounted(...) is deprecated',
  'Warning: ...',
  'Warning: MapViewDirections',
  'Setting a timer'
]);

// import firebase from './src/components/common/Firebase';
// import AutoStart from 'react-native-autostart';
//
// if(AutoStart.isCustomAndroid()) {
//     AutoStart.startAutostartSettings();
// }

var Spinner = require('react-native-spinkit');

console.disableYellowBox = true;
console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed'];

// var PushNotification = require("react-native-push-notification"); // PUSH NOTIFICATION TEMPLATE

// PushNotification.localNotification({
//       foreground: false, // BOOLEAN: If the notification was received in foreground or not
//       userInteraction: false, // BOOLEAN: If the notification was opened by the user from the notification area or not
//       message: 'My Notification Message', // STRING: The notification message
//       data: {}, // OBJECT: The push data
// });

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const destroySession = async () => {
  await AsyncStorage.removeItem('userData');
  // Actions.dashboard();
  // PAGE REDIRECTION HERE
}

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

const MyDrawerNavigator = createDrawerNavigator(
  {
    Dashboard:{
      screen: Dashboard,
    },
    Profile: {
      screen: Profile,
    },
    DriverProfile: {
      screen: DriverProfile,
    },
    TripHistory: {
      screen: TripHistory,
    },
    // Bookings: {
    //   screen: Bookings,
    // },
    Payment: {
      screen: (props) => <Payment {...props} test='test' />,
      navigationOptions: ({navigation}) => {
          return {
              drawerLabel: () => null,
          }
      }
    },
    Logout: {
      screen: Routes,
      navigationOptions: ({navigation}) => {
          return {
              drawerLabel: () => null,
          }
      }
      // screen: () => {
      //   AsyncStorage.removeItem('userData');
      //   return <Routes />;
      //   },
      // navigationOptions: ({navigation}) => {
      //     return {
      //         drawerLabel: () => null,
      //     }
      // }
    }
  },
  {
    contentComponent: DrawerContent,
  }
);

const MyDrawerNavigatorDriver = createDrawerNavigator(
  {
    Dashboard:{
      screen: Dashboard,
    },
    // DriverDashboard:{
    //   screen: DriverDashboard,
    // },
    DriverProfile: {
      screen: DriverProfile,
    },
    // Profile: {
    //   screen: Profile,
    // },
    TripHistory: {
      screen: TripHistory,
    },
    Payment: {
      screen: (props) => <Payment {...props} test='test' />,
      navigationOptions: ({navigation}) => {
        return {
            drawerLabel: () => null,
        }
      }
    },
    // Bookings: {
    //   screen: Bookings,
    // },
    Logout: {
      screen: Routes,
      navigationOptions: ({navigation}) => {
          return {
              drawerLabel: () => null,
          }
      }
      // screen: () => {
      //   AsyncStorage.removeItem('userData');
      //   return <Routes />;
      //   },
      // navigationOptions: ({navigation}) => {
      //     return {
      //         drawerLabel: () => null,
      //     }
      // }
    }
  },
  {
    contentComponent: DrawerContent,
  }
);

const MyDrawerNavigatorRider = createDrawerNavigator(
    {
      Dashboard:{
        screen: Dashboard,
      },
      Profile: {
        screen: Profile,
      },
      TripHistory: {
        screen: TripHistory,
      },
      SavedRoutes: {
        screen: SavedRoutes,
      },
      PinnedLocations: {
        screen: PinnedLocations,
      },
      // Bookings: {
      //   screen: Bookings,
      //   navigationOptions: ({navigation}) => {
      //       return {
      //           drawerLabel: () => "Bookings",
      //       }
      //   }
      // },
      Payment: {
        screen: (props) => <Payment {...props} test='test' />,
        navigationOptions: ({navigation}) => {
            return {
                drawerLabel: () => null,
            }
        }
      },
      Logout: {
        screen: Routes,
        navigationOptions: ({navigation}) => {
            return {
                drawerLabel: () => null,
            }
        }
        // screen: () => {
        //   AsyncStorage.removeItem('userData');
        //   return <Routes />;
        //   },
        // navigationOptions: ({navigation}) => {
        //     return {
        //         drawerLabel: () => null,
        //     }
        // }
      }
    },
    {
      contentComponent: DrawerContent,
    }
);

// const destroySession = async () => {
//   await AsyncStorage.removeItem('userData');
//   // Actions.dashboard();
//   // PAGE REDIRECTION HERE
// }

const MyApp = createAppContainer(MyDrawerNavigator);

const MyAppRider = createAppContainer(MyDrawerNavigatorRider);
const MyAppDriver = createAppContainer(MyDrawerNavigatorDriver);
// const MyApp = () => createAppContainewr((true)?MyDrawerNavigator:MyDrawerNavigatorRider);

type Props = {};

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['reduxState'], 
  // ALOW EVERY THING LANG SA, comment sa
  timeout: null
}

const persistedReducer = persistReducer(persistConfig, allReducers);
const store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);

const loader = 
<View style={{
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  width: undefined,
  height: undefined
}}>
  {/* <Spinner type="WanderingCubes" color="black" size={80} /> */}
</View>

// export default class App extends Component {
//   constructor(props) {
//     super(props);
//   }
//   render() {
//     return (
//       <Provider store={store}>
//         <PersistGate loading={loader} persistor={persistor}>
//           <Routes />
//         </PersistGate>
//       </Provider>
//     )
//   }
// }
export default class App extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
        isLoading: true,
        isLogged: false,
        userType:"rider",
      }
      // this.ref = firebase.firestore().collection('books');
      // this.Save = this.Save.bind(this);
  }

  componentDidMount() {
    // this.ref.onSnapshot(this.onCollectionsListener);
    // console.log('going to get');
    this.checkSession();
    // this.getUserType();
    // firebase.messaging().hasPermission().then(hasPermission => {
    //        if (hasPermission) {
    //            this.subscribeToNotificationListeners()
    //        } else {
    //            firebase.messaging().requestPermission().then(() => {
    //                this.subscribeToNotificationListeners()
    //            }).catch(error => {
    //                console.error(error);
    //
    //            })
    //        }
    //    })
  }

  // onCollectionsListener = (querySnapShot) => {
  //   const books = [];
  //   // console.log("FAYR");
  //   // console.log(querySnapShot);
  //   querySnapShot.forEach((doc) =>{

  //     // console.log("ITEM");
  //     // console.log(doc);
  //     // const { name } = doc.data();
  //     // books.push({
  //     //   key:doc.id,
  //     //   doc,
  //     //   name
  //     // });
  //   });
  //   this.setState({
  //     books
  //   });
  // }
    // componentWillUnmount() {
        // this.notificationListener();
    // }

  // if(TRUE){
  // // if(isLoading){
  // // console.log('CAME HERE');
  //   return (
  //       <View style={styles.container}>
  //         <Spinner type="9CubeGrid" color="#d3a04c" />
  //       </View>
  //     );
  // }

  checkSession = async () => {
    let varUserType ="";

    if(await AsyncStorage.getItem('userData')){
        this.setState({
          isLogged: true,
        });
        console.log('LOGGED USER');
        console.log(await AsyncStorage.getItem('userData'));
        console.log('LOGGED USER');
    }

    // if(await AsyncStorage.getItem('userData')){
    //   this.setState({
    //     isLogged: true,
    //     });
    // }

    // console.log('gettingUserType!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    // console.log(await AsyncStorage.getItem('userData'));
    let userData = JSON.parse(await AsyncStorage.getItem('userData'));

    // console.log(userData);
    // console.log('getting single');
    // console.log(userData.login_id);
    // if (true) {
    if (userData.user_type_id) {
      // if (true) {
      if (userData.user_type_id==3) {
        varUserType = "driver";
          console.log('I AMA DRIVER');
      }else if (userData.user_type_id==2) {
        varUserType = "rider";
          console.log('I AMA RIDER');
      }else if (userData.user_type_id==1) {
        varUserType = "admin";
          console.log('I AMA ADMIN');
      }else {
        console.log('I AMA Not in the list');
        varUserType = "rider";
      }
      // console.log(this.state);
    }else{
      varUserType = "rider";
    }
    setTimeout(() => {
      this.setState({
        userType: varUserType,
        isLoading: false,
        });
      }, 1000);
  }

  // getUserType = async () => {
  // }

  destroySession = async () => {
    await AsyncStorage.removeItem('userData');
    this.setState({
      isLogged: false,
      });
  }

  createSession = async () => {
    await AsyncStorage.setItem('userData', true);

    this.setState({
      isLogged: true,
      });
  }

  render() {
    // return (
    //   <Sample></Sample>
    // )
    // console.log('APP STATE BEFORE RENDER');
    // console.log(this.state);
    // console.log(AsyncStorage.setItem('userData', true));
    const { isLogged, isLoading } = this.state;

    // if(isLoading){
    //   return (
    //     <View style={styles.container}>
    //       <Spinner type="9CubeGrid" color="#d3a04c" />
    //     </View>
    //     );
    // }

    // if(isLogged === false){
      // return (
      //   <StyleProvider style={getTheme(material)}>
      //     <Routes />
      //   </StyleProvider>
      // );
    // }else{
    //
    // this.state.userType?<MyApp />:<MyAppRider />;
    // <MyApp />

      return (
        <Provider store={store}>
          <PersistGate loading={loader} persistor={persistor}>
            <StyleProvider style={getTheme(material)}>
				<MyAppRider />
              {
                // this.state.userType=="rider"?
                // (<MyAppRider />)
                // :this.state.userType=="driver"?
                // (<MyAppDriver />)
                // :(<MyApp />)
              }
            </StyleProvider>
          </PersistGate>
        </Provider>
      )
    // }
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
