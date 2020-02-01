const initstate = {
    isLoggedIn: false,
    loggedinData: {},
    onlinestatus: '',
    directions: [],
    mapRegion: {},
    current_loc: {},
    driver_loc: {}
    
}

export default function (state = initstate, action){
    switch (action.type) {
        case "SET_TRUE_FALSE":
        
            return {
                ...state,
                [action.payload.state]: !state[action.payload.state]
            }
        case "SET_DATA":

            return {
                ...state,
                [action.payload.state]: action.payload.value
            }

        default:
        return state;
    }
}

