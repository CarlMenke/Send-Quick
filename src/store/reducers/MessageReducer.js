import {GET_MESSAGES } from "../types";

const initialState = {

}

const MessageReducer = (state = initialState, action) => {
    switch (action.type){
        case GET_MESSAGES:
            return { ...state }

        default: 
        return {...state}
    }
}

export default MessageReducer