import { GET_MESSAGES, SET_DISPLAY_MESSAGE, SIGNUP,LOGOUT, LOGIN } from "../types";

const initialState = {
    logged:false,
    loggedUser:null,
    displayMessage:'Login / Sign Up'
}

const MessageReducer = (state = initialState, action) => {
    switch (action.type){
        case GET_MESSAGES:
            return { ...state }
        case SIGNUP:
            return { ...state, logged:action.payload.login, loggedUser:action.payload.user, displayMessage:action.payload.message }
        case SET_DISPLAY_MESSAGE:
            return { ...state, displayMessage:action.payload }
        case LOGOUT:
            return { ...state, logged:false, loggedUser:null }
        case LOGIN:
            return { ...state, logged:action.payload.login, loggedUser:action.payload.user, displayMessage:action.payload.message }
        default: 
            return { ...state}
    }
}

export default MessageReducer