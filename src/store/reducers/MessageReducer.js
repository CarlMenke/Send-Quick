import { FRIEND_REQUEST_RESPONSE, GET_USER_DETAILS, GET_MESSAGES, SET_DISPLAY_MESSAGE, SIGNUP,LOGOUT, LOGIN, UPDATE_SOCKET_ID,GET_SOCKET_FROM_NAME, SET_SOCKET } from "../types";

const initialState = {
    logged:false,
    loggedUser:null,
    displayMessage:'Login / Sign Up',
    currentRecipientSocket:'',
    socket:null,
    messageArray:[]
}

const MessageReducer = (state = initialState, action) => {
    switch (action.type){
        case GET_MESSAGES:
            return { ...state , messageArray:action.payload }
        case SIGNUP:
            return { ...state, logged:action.payload.login, loggedUser:action.payload.user, displayMessage:action.payload.message }
        case SET_DISPLAY_MESSAGE:
            return { ...state, displayMessage:action.payload }
        case LOGOUT:
            return { ...state, logged:false, loggedUser:null, currentRecipientSocket:''}
        case LOGIN:
            return { ...state, logged:action.payload.login, loggedUser:action.payload.user, displayMessage:action.payload.message }
        case GET_SOCKET_FROM_NAME:
            return { ...state, currentRecipientSocket:action.payload}
        case SET_SOCKET:
            return { ...state, socket:action.payload}
        case UPDATE_SOCKET_ID:
        case GET_USER_DETAILS:
            return { ...state, loggedUser:action.payload,currentRecipientSocket:'' }
        case FRIEND_REQUEST_RESPONSE:
            return { ...state, loggedUser:action.payload.user}
        default: 
            return { ...state}
    }
}

export default MessageReducer