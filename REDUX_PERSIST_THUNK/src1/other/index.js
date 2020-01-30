//Dependencies
import { combineReducers } from 'redux';

import authReducer from './authReducer';
import counterReducer from './counterReducer';

//Root reducer
const rootReducer = combineReducers({
    authReducer: authReducer,
    counterReducer: counterReducer,
});

export default rootReducer;
