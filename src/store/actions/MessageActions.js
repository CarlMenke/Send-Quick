import { getNewMessage, getFriendRequestResponse, getUserDetails, getUpdateSocketId, getMessages, signup, login, getSocketFromName, getSendFriendRequest } from "../../services/MessageServicves";
import { NEW_MESSAGE, FRIEND_REQUEST_RESPONSE, GET_USER_DETAILS, SET_SOCKET, GET_MESSAGES, SIGNUP, SET_DISPLAY_MESSAGE, LOGOUT, LOGIN, UPDATE_SOCKET_ID,GET_SOCKET_FROM_NAME, SEND_FRIEND_REQUEST } from "../types";

export const loadMessages = (primaryId, foreignId) => {
    return async (dispatch) => {
        try{
            console.log('inside load messages')
            const messageArray = await getMessages(primaryId, foreignId)
            await dispatch({
                type:GET_MESSAGES,
                payload:messageArray
            })
        }catch (error){
            throw error
        }
    }
} 
export const loadUpdateSocketId = (name,socket) => {
    return async (dispatch) => {
        try{
            const response = await getUpdateSocketId(name,socket)
            await dispatch({
                type:UPDATE_SOCKET_ID,
                payload:response
            })
        }catch (error){
            throw error
        }
    }
} 
export const loadSignup = (name, password) => {
    return async (dispatch) => {
        try{
            const response = await signup(name,password)
            await dispatch({
                type:SIGNUP,
                payload:response
            })
        }catch(error){
            throw error
        }
    }
}
export const loadLogin = (name, password) => {
    return async (dispatch) => {
        try{
            const response = await login(name,password)
            await dispatch({
                type:LOGIN,
                payload:response
            })
        }catch(error){
            throw error
        }
    }
}
export const loadSetDisplayMessage = (message) => {
    return async (dispatch) => {
        try{
            await dispatch({
                type:SET_DISPLAY_MESSAGE,
                payload:message
            })
        }catch(error){
            throw error
        }
    }
}
export const loadLogout = () => {
    return async (dispatch) => {
        try{
            await dispatch({
                type:LOGOUT,
            })
        }catch(error){
            throw error
        }
    }
}
export const loadSocketFromName = (name) => {
    return async (dispatch) => {
        try{
            const response = await getSocketFromName(name)
            await dispatch({
                type:GET_SOCKET_FROM_NAME,
                payload:response
            })
        }catch(error){
            throw error
        }
    }
}
export const loadSetSocket = (socket) => {
    return async (dispatch) => {
        try{
            await dispatch({
                type:SET_SOCKET,
                payload:socket
            })
        }catch(error){
            throw error
        }
    }   
}
export const loadSendFriendRequest = (senderId, recieverName) => {
    return async (dispatch) => {
        try{
            const response = await getSendFriendRequest(senderId, recieverName)
            await dispatch({
                type:SEND_FRIEND_REQUEST,
                payload:response
            })
        }catch(error){
            throw error
        }
    }   
}
export const loadUserDetails = (userId) => {
    return async (dispatch) => {
        try{
            const response = await getUserDetails(userId)
            console.log(response)
            await dispatch({
                type:GET_USER_DETAILS,
                payload:response
            })
        }catch(error){
            throw error
        }
    }   
}
export const loadFriendRequestResponse = (userId, friendId, choice) =>{
    return async (dispatch) => {
        try{
            const response = await getFriendRequestResponse(userId, friendId, choice)
            await dispatch({
                type:FRIEND_REQUEST_RESPONSE,
                payload:response
            })
        }catch(error){
            throw error
        }
    }   
}
export const loadNewMessage = (content, primaryUser, foreignUser) => {
    return async (dispatch) => {
        try{
            const response = await getNewMessage(content, primaryUser, foreignUser)
            await dispatch({
                type:NEW_MESSAGE,
                payload:response
            })
        }catch(error){
            throw error
        }
    }
}


