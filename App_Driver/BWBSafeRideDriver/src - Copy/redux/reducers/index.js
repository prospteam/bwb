import {combineReducers} from 'redux';
import MyReducer from './MyReducer.js';
// import Fetch_Data_Reducer from './Reducer.js';
// import Fetch_Single_Data_Reducer from './SingleReducer.js';
// import RiderReducers from './Rider_Reducer.js';
// import RegionReducer from './RegionReducer.js';
// import ApiData_ from './ActionReducer.js';

const allReducers = combineReducers({
    // fetchData    : Fetch_Data_Reducer,
    // singleData   : Fetch_Single_Data_Reducer,
    // ApiData      : ApiData_,
    // RiderReducer: RiderReducers,
    // RegionReducer: RegionReducer
    driver_location: MyReducer
});

export default allReducers;
