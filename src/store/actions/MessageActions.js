import { getMessages } from "../../services/MessageServicves";
import { GET_MESSAGES } from "../types";

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

