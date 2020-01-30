// Dependencies
import React from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { View, Text } from 'react-native';
import { Provider, connect } from 'react-redux';
import { Scene, Actions, Router } from 'react-native-router-flux';
import { reduxifyNavigator,createReduxContainer, createReactNavigationReduxMiddleware, createNavigationReducer } from 'react-navigation-redux-helpers';
import AsyncStorage from '@react-native-community/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/es/integration/react'

//Screens
import Home from './screens/Home';
import Page from './screens/Page';

//Reducer
import userSessionReducer from './reducers/userSessionReducer.js';
//import other_reducer from './reducers/other_reducer.js';


const mapStateToProps = state => ({
  state: state.nav,
});

// Navigation
const AppNavigator = Actions.create(
		<Scene key="root" hideNavBar>
			<Scene key="home" component={Home} />
			<Scene key="page" component={Page} />
		</Scene>,
);

// Preparing Navigator
const ReduxNavigator = createReduxContainer(AppNavigator, 'root');

// default nav reducer
const initialState = AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams('home'));
const navReducer = (state = initialState, action) => {
  const nextState = AppNavigator.router.getStateForAction(action, state);
  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
};

// COMBINE REDUCERES
const appReducer = combineReducers({
  nav: navReducer,
  userSessionReducer,
  //other_reducer,
});

//Middleware: Redux Persist Config
const persistConfig = {
    // Root?
    key: 'root',
    // Storage Method (React Native)
    storage: AsyncStorage,
    // Whitelist (Save Specific Reducers)
    //whitelist: [
    //    'user_session_reducer',
    //],
    // Blacklist (Don't Save Specific Reducers)
    //blacklist: [
    //    'counterReducer',
    //],
};

// Middleware redux persist persited reducer
const persistedReducer = persistReducer(persistConfig, appReducer);


// 
const middleware = createReactNavigationReduxMiddleware(state => state.nav);

// Prepare STORE
const store = createStore(persistedReducer, applyMiddleware(middleware));

// Prepare for Persist Gate
let persistor = persistStore(store);

// XD
const ReduxRouter = connect(mapStateToProps)(Router);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
		<PersistGate 
		loading={null} 
		persistor={persistor}
		>
			<ReduxRouter navigator={ReduxNavigator} />
		</PersistGate>
      </Provider>
    );
  }
}
