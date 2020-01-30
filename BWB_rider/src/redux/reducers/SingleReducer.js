const initstate = {
    singledata : '',
    findDriver : '',
    foundDriver : []
}

export default function (state=initstate,action){
    switch (action.type) {
        case "SINGLE_DATA":
        return{
            ...state,
              singledata :action.payload
          }

        case "FIND_DRIVER_DATA":
        return{
            ...state,
              findDriver :action.payload
        }
        case "FOUND_DRIVER_DATA":
        return{
            ...state,
              foundDriver :action.payload
        }
        break;
    }
    return state;
}
