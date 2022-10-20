import { getRecentMessage, updateUserOpenChatWith, getNewMessage, getFriendRequestResponse, getUserDetails, getUpdateSocketId, getMessages, signup, login, getSocketFromName, getSendFriendRequest } from "../../services/MessageServicves";
import { SET_RECENT_MESSAGES_ARRAY, CLOSE_CHAT, SET_TYPING, NEW_MESSAGE, FRIEND_REQUEST_RESPONSE, GET_USER_DETAILS, SET_SOCKET, GET_MESSAGES, SIGNUP, SET_DISPLAY_MESSAGE, LOGOUT, LOGIN, UPDATE_SOCKET_ID,GET_SOCKET_FROM_NAME, SEND_FRIEND_REQUEST, OPEN_CHAT, SEND_MESSAGE } from "../types";

export const loadRecentMessage = (user1,user2) => {
    return async (dispatch) => {
        try{
            const messageArray = await getRecentMessage(user1,user2)
            await dispatch({
                type:GET_MESSAGES,
                payload:messageArray
            })
        }catch (error){
            throw error
        }
    }
}
export const setRecentMessagesArray = (array) =>{
    return async (dispatch) => {
        try{
            await dispatch({
                type:SET_RECENT_MESSAGES_ARRAY,
                payload:array
            })
        }catch (error){
            throw error
        }
    }
}
export const loadMessages = (primaryId, foreignId) => {
    return async (dispatch) => {
        try{
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
export const loadResetMessagesArray =  () => {
    return async (dispatch) => {
        try{
            await dispatch({
                type:GET_MESSAGES,
                payload:[]
            })
        }catch(error){
            throw error
        }
    }
}
export const loadTyping = (choice) => {
    return async (dispatch) => {
        try{
            await dispatch({
                type:SET_TYPING,
                payload:choice
            })
        }catch (error){
            throw error
        }
    }
}
export const loadOpenChat = (reciever,sender) =>{
    return async (dispatch) => {
        try{
            const messageArray = await getMessages(sender.id, reciever.id)
            await updateUserOpenChatWith(sender.id, reciever.name)
            const data = {
                reciever: await getUserDetails(reciever.id),
                sender: await getUserDetails(sender.id),
                messageArray: messageArray
            }
            await dispatch({
                type:OPEN_CHAT,
                payload:data
            })
        }catch (error){
            throw error
        }
    }
}
export const loadCloseChat = (sender) =>{
    return async (dispatch) => {
        try{
            await updateUserOpenChatWith(sender.id, '')
            await dispatch({
                type:CLOSE_CHAT,
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
            console.log(response)
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
export const loadLogout = (user) => {
    return async (dispatch) => {
        await updateUserOpenChatWith(user.id, '')
        try{
            await dispatch({
                type:LOGOUT,
            })
        }catch(error){
            throw error
        }
    }
}
export const loadResetChatWith = (user) => {
    return async (dispatch) => {
        try{
            const response = await updateUserOpenChatWith(user.id, '')
            await dispatch({
                
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
export const loadSendMessage = (content, primaryUser, foreignUser) => {
    return async (dispatch) => {
        try{
            await getNewMessage(content, primaryUser, foreignUser)
            const data = {
                reciever: await getUserDetails(foreignUser.id),
                sender: await getUserDetails(primaryUser.id)
            }
            await dispatch({
                type:SEND_MESSAGE,
                payload:data
            })
        }catch(error){
            throw error
        }
    }
}



