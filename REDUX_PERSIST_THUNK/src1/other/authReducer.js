// Initial state
const initialState = {
    loggedIn: false,

};

// Reducers (Modifiesthe state and returns a new state)
const authReducer = (state = initialState, action ) => {
    switch(action.type){
        case 'LOGIN': {
            return {
                ...state,
                loggedIn:action.trueFalse,
            }
        }
        default: {
            return state;
        }        
    }
};

export default authReducer;


