const initState_ = {
    count:0,
}

export default function (state =initState_, action ){
    switch (action.type) {
        case 'COUNTER_CHANGE':
            return{
                ...state,
                count:action.payload
            }
        default:
        return state;
    }
}