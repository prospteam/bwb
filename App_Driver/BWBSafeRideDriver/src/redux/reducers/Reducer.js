const initState = {
    locations_destination   :[],
    locations_location      :[],
    pinned_location         :[],
    directions              :[]
}

export default function (state =initState, action ){
    switch (action.type) {
        case 'Destination':
            return{
                ...state,
                locations_destination:action.payload
            }
        case 'Location':
            return{
                ...state,
                locations_location:action.payload
            }
        case 'PinnedLocations':
            return{
                ...state,
                pinned_location:action.payload
            }
        case 'DIRECTIONS':
            return{
                ...state,
                directions:action.payload
            }
        default:
        return state;

    }
}
