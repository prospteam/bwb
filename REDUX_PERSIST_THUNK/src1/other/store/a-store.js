// Dependendcies
import AsyncStorage from '@react-native-community/async-storage';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';

//Redux
//import rootReducer from '../reducers/index';

//Middleware: Redux Persist Config
//const persistConfig = {
//    // Root?
//    key: 'root',
//    // Storage Method (React Native)
//    storage: AsyncStorage,
//    // Whitelist (Save Specific Reducers)
//    whitelist: [
//        'authReducer',
//    ],
 //   // Blacklist (Don't Save Specific Reducers)
 //   blacklist: [
 //       'counterReducer',
 //   ],
//};

// Middleware redux persist persited reducer
//const persistedReducer = persistReducer(persistConfig, rootReducer);


//Middleware: Redux Persist Config
const persistConfig = {
    // Root?
    key: 'root',
    // Storage Method (React Native)
    storage: AsyncStorage,
    // Whitelist (Save Specific Reducers)
    whitelist: [
        'reducer',
    ],
    // Blacklist (Don't Save Specific Reducers)
    //blacklist: [
    //    'counterReducer',
    //],
};

// Middleware redux persist persited reducer
const prepare_persistedReducer = (navReducer) => { 
	return persistReducer(
		persistConfig, 
		combineReducers({
						  nav: navReducer,
						  reducer,
						})
		);
}


//Redux: Store 

const prepare_store = (middleware) =>  {
	return createStore(
				persistedReducer,
				applyMiddleware(middleware),
			);
}

const prepare_persistor = (prepared_store) =>  {
	return persistStore(prepared_store);
}

// Persistor
//let persistor = persistStore(prepare_store);


export {
 //   store,
//    persistor,
    prepare_persistedReducer,
    prepare_persistor,
	prepare_store,
};