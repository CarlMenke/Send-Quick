import { SET_RECENT_MESSAGES_ARRAY, CLOSE_CHAT, SET_SOCKET, SEND_MESSAGE, SEND_FRIEND_REQUEST, OPEN_CHAT, FRIEND_REQUEST_RESPONSE, GET_USER_DETAILS, GET_MESSAGES, SET_DISPLAY_MESSAGE, SIGNUP,LOGOUT, LOGIN, UPDATE_SOCKET_ID,GET_SOCKET_FROM_NAME, SET_TYPING } from "../types";

const initialState = {
    logged:false,
    loggedUser:null,
    displayMessage:'Login / Sign Up',
    currentRecipientSocket:null,
    socket:null,
    messageArray:[],
    typing:false,
    foreignUser:null,
    primaryUser:null,
    sendMessage:false,
    recentMessagesArray:[]
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
            return { ...state, logged:false, loggedUser:null, currentRecipientSocket:null}
        case LOGIN:
            return { ...state, logged:action.payload.login, loggedUser:action.payload.user, displayMessage:action.payload.message }
        case GET_SOCKET_FROM_NAME:
            return { ...state, currentRecipientSocket:action.payload}
        case SET_SOCKET:
            return { ...state, socket:action.payload}
        case UPDATE_SOCKET_ID:
        case GET_USER_DETAILS:
            return { ...state, loggedUser:action.payload}
        case FRIEND_REQUEST_RESPONSE:
            return {...state, update: !state.update}
        case SEND_FRIEND_REQUEST:
            return { ...state, loggedUser:action.payload.user}
        case SET_TYPING: 
            return { ...state, typing:action.payload}
        case OPEN_CHAT:
            return { ...state, foreignUser:action.payload.reciever, primaryUser:action.payload.sender,  messageArray:action.payload.messageArray}
        case CLOSE_CHAT:
            return { ...state, foreignUser:null, primaryUser:null,  messageArray:[]}
        case SEND_MESSAGE:
            return { ...state, foreignUser:action.payload.reciever, primaryUser:action.payload.sender, sendMessage:!state.sendMessage}
        case SET_RECENT_MESSAGES_ARRAY:
            console.log(action.payload)
            return { ...state, recentMessagesArray:action.payload}
        default: 
            return { ...state}
    }
}

export default MessageReducer