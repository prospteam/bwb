// Dependendcies
import AsyncStorage from '@react-native-community/async-storage';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';

//Redux
import rootReducer from '../reducers/index';

//Middleware: Redux Persist Config
const persistConfig = {
    // Root?
    key: 'root',
    // Storage Method (React Native)
    storage: AsyncStorage,
    // Whitelist (Save Specific Reducers)
    whitelist: [
        'authReducer',
    ],
    // Blacklist (Don't Save Specific Reducers)
    blacklist: [
        'counterReducer',
    ],
};

// Middleware redux persist persited reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

//Redux: Store 
const store = createStore(
    persistedReducer,
    applyMiddleware(
        createLogger(),
    ),
);

let persistor = persistStore(store);

export {
    store,
    persistor,
};