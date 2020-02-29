const initState_ = {
    driver_location:0,
}

export default function (state =initState_, action ){
    switch (action.type) {
        case 'DRIVER_LOCATION_CHANGE':
            return{
                ...state,
                driver_location:action.payload
            }
        default:
        return state;
    }
}