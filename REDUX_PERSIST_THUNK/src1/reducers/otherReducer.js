//import { ActionConst } from 'react-native-router-flux';

const INITIAL_STATE = { other: 0 };

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
//    case ActionConst.FOCUS:
//      console.log('FOCUS event fired with scene parameter: ', routeName);
//      return { ...state, currentScene: routeName };
    case 'other':
      return { ...state, data: payload };
    default:
      return state;
  }
};	