import client from "./";

export const getMessages = async (primaryId, foreignId) => {
  try{
    const res = await client.post(`messages/conversation`, {primaryId:primaryId, foreignId:foreignId})
    let {recievedMessages, sentMessages} = res.data
    for(let i = 0; i < recievedMessages.length; i++){
      recievedMessages[i].config = 'recieved'
    }
    for(let i = 0; i < sentMessages.length; i++){
      sentMessages[i].config = 'sent'
    }
    let sendArray = [...sentMessages, ...recievedMessages]
    sendArray.sort((a,b)=>{ return a.id - b.id })

    if(sendArray.length > 99){
      let finalArray = []
      for(let i = sendArray.length-100 ; i < sendArray.length; i++){
        finalArray.push(sendArray[i])
      }
      return finalArray
    }
    return sendArray
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
export const updateUserOpenChatWith = async (userId, chatterName) => {
  try{
    const res = await client.post('users/update/openchatwith', {userId:userId, chatterName:chatterName })
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
export const getNewMessage = async (content, primaryUser, foreignUser) =>{
  try{
    const res = await client.post('messages/create',{content:content, primaryUser:primaryUser, foreignUser:foreignUser})
    return res.data
  }catch(error){
    throw error
  }
}
export const getRecentMessage = async (user1, user2) =>{
  try{
    const res = await client.post('messages/getRecent',{user1:user1, user2:user2})
    return res.data
  }catch(error){
    throw error
  }
}

