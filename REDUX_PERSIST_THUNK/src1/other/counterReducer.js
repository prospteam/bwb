// Initial state
const initialState = {
    counter: 0,
};

// Reducers (Modifiesthe state and returns a new state)
const counterReducer = (state = initialState, action ) => {
    switch(action.type){
        case 'INCREASE_COUNTER': {
            return {
                ...state,
                counter:state.counter+1,
            }
        }
        case 'DECREASE_COUNTER': {
            return {
                ...state,
                counter:state.counter+1,
            }
        }
        default: {
            return state;
        }        
    }
};

export default counterReducer;