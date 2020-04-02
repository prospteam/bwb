const initState_ = {
    driver_location:0,
    booking_list_refresh:false,
}

export default function (state =initState_, action ){
    switch (action.type) {
        case 'BOOKING_LIST_REFRESH_CHANGE':
            return{
                ...state,
                booking_list_refresh:action.payload
            }
        case 'DRIVER_LOCATION_CHANGE':
            return{
                ...state,
                driver_location:action.payload
            }
        default:
            return state;
    }
}