import { getMessages, signup, login } from "../../services/MessageServicves";
import { GET_MESSAGES, SIGNUP, SET_DISPLAY_MESSAGE, LOGOUT, LOGIN } from "../types";

export const loadMessages = (userId) =>{
    return async (dispatch) =>{
        try{
            const messages = await getMessages(userId)
            dispatch({
                type:GET_MESSAGES,
                payload:messages
            })
        }catch (error){
            throw error
        }
    }
} 
export const loadSignup = (name, password) =>{
    return async (dispatch) =>{
        try{
            const response = await signup(name,password)
            console.log(response)
            dispatch({
                type:SIGNUP,
                payload:response
            })
        }catch (error){
            throw error
        }
    }
}
export const loadSetDisplayMessage = (message) =>{
    return async (dispatch) =>{
        try{
            dispatch({
                type:SET_DISPLAY_MESSAGE,
                payload:message
            })
        }catch (error){
            throw error
        }
    }
}
export const loadLogout = () =>{
    return async (dispatch) =>{
        try{
            dispatch({
                type:LOGOUT,
            })
        }catch (error){
            throw error
        }
    }
}
export const loadLogin = (name, password) =>{
    return async (dispatch) =>{
        try{
            const response = await login(name,password)
            console.log(response)
            dispatch({
                type:LOGIN,
                payload:response
            })
        }catch (error){
            throw error
        }
    }
}

