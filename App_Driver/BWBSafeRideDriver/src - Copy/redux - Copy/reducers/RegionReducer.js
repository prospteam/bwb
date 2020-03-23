const initstate = {
    directionRegions: [
        {
            latitude: 0,
            longitude: 0,
            speed: 0,
        },
        {
            latitude: 0,
            longitude: 0,
            speed: 0,
        }
    ],
    directionFormattedAddress: ['', ''],
    driver_loc: {},
    findingCurrent: false,
    toggeldrawer: false,
    showbookingdetails: false
}

export default function (state = initstate, action) {
    switch (action.type) {
        case "SET_REGION_TRUE_FALSE":
            return {
                ...state,
                [action.payload.state]: !state[action.payload.state]
            }
        case "SET_REGION_TRUE_FALSE_FROM_INPUT":
            return {
                ...state,
                [action.payload.state]: true
            }
        case "SET_REGION_TRUE_FALSE_FROM_INPUT_FALSE":
            return {
                ...state,
                [action.payload.state]: false
            }
        case "SET_DATA_REGION":
            return {
                ...state,
                [action.payload.state]: action.payload.value
            }
        case "SET_FORMATTED_ASDDRESS":
            let initformated = state.directionFormattedAddress;
            initformated[action.payload.idx] = action.payload.value;
            return {
                ...state,
                [action.payload.state]: initformated
            }

        default:
            return state;
    }
}

