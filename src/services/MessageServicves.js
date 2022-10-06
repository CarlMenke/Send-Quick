import client from "./";

export const getMessages = async (page) => {
  try{
    const res = await client.get(`localhost something`)
    return res.data
  }catch(error){
    throw error
  }
}

export const getUpdateSocketId = async (name,socket) => {
  try{
    const res = await client.put('users/update/socket/id',{name:name, socket:socket})
    return res.data
  }catch(error){
    throw error
  }
}

export const signup = async (name, password) => {
  try{
    const res = await client.post('users/signup',{name:name, password:password})
    localStorage.setItem('token', res.data.token)
    return res.data
  }catch(error){
    throw error
  }
}

export const login = async (name, password) => {
  try{
    const res = await client.post('users/login',{name:name, password:password})
    localStorage.setItem('token', res.data.token)
    return res.data
  }catch(error){
    throw error
  }
}
export const getSocketFromName = async (name) => {
  try{
    const res = await client.post('users/getsocket',{name:name})
    return res.data
  }catch(error){
    throw error
  }
}
export const getUserDetails = async (userId) => {
  try{
    const res = await client.post('users/details',{userId:userId})
    return res.data
  }catch(error){
    throw error
  }
}
export const getSendFriendRequest = async (senderId, recieverName) => {
  try{
    const res = await client.post('users/friendrequest',{senderId:senderId,recieverName:recieverName})
    return res.data
  }catch(error){
    throw error
  }
}
export const getFriendRequestResponse = async (userId, friendId, choice) => {
  try{
    const res = await client.post('users/friendrequestresponse',{userId:userId, friendId:friendId, choice:choice})
    return res.data
  }catch(error){
    throw error
  }
}

