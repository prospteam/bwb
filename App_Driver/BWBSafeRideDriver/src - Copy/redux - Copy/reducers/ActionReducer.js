const initState_ = {
    ridetype        :[],
    calculations   :[],
}

export default function (state =initState_, action ){
    switch (action.type) {
        case 'RIDETYPE':
            return{
                ...state,
                ridetype:action.payload
            }
        case 'CALCULATIONS':
            return{
                ...state,
                calculations:action.payload
            }
        default:
        return state;

    }
}
