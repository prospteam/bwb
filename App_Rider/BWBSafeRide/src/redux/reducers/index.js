import {combineReducers} from 'redux';
import Fetch_Data_Reducer from './Reducer.js';
import Fetch_Single_Data_Reducer from './SingleReducer.js';
import RiderReducers from './Rider_Reducer.js';
import RegionReducer from './RegionReducer.js';
import ApiData_ from './ActionReducer.js';
import MyReducer from './MyReducer';

const allReducers = combineReducers({
    // fetchData    : Fetch_Data_Reducer,
    // singleData   : Fetch_Single_Data_Reducer,
    // ApiData      : ApiData_,
    // RiderReducer: RiderReducers,
    // RegionReducer: RegionReducer
    reduxState:MyReducer
});

export default allReducers;
