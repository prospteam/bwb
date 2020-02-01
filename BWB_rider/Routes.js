import React from 'react';
import { createStore, combineReducers } from 'redux';
import { connect } from 'react-redux';
import { Scene, Actions, Router } from 'react-native-router-flux';
import { reduxifyNavigator, createReactNavigationReduxMiddleware, createNavigationReducer } from 'react-navigation-redux-helpers';

// Pages
//import Home from './home';
//import Page from './page';
//import reducer from './a-reducer';
import Counter from './screens/Counter';


const AppNavigator = Actions.create(
  <Scene key="root" hideNavBar>
    <Scene key="counter" component={Counter} />
  </Scene>,
);

// default nav reducer
const initialState = AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams('home'));
const navReducer = (state = initialState, action) => {
  const nextState = AppNavigator.router.getStateForAction(action, state);
  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
};

const appReducer = combineReducers({
  nav: navReducer,
  reducer,
});

const middleware = createReactNavigationReduxMiddleware('root', state => state.nav);
const ReduxNavigator = reduxifyNavigator(AppNavigator, 'root');
const mapStateToProps = state => ({
  state: state.nav,
});
const ReduxRouter = connect(mapStateToProps)(Routes);
const store = createStore(appReducer, applyMiddleware(middleware));

export default class Routes extends React.Component {
  render() {
    return (
        <ReduxRouter navigator={ReduxNavigator} />
    );
  }
}
