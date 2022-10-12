import React, { useEffect, useState } from 'react'
import { connect } from "react-redux"
import { setRecentMessagesArray, loadResetChatWith, loadOpenChat, loadSetSocket, loadFriendRequestResponse, loadMessages, loadUpdateSocketId, loadSocketFromName, loadSendFriendRequest,loadUserDetails} from "../store/actions/MessageActions"
import { getRecentMessage } from '../services/MessageServicves'
import Chatbox from './Chatbox'
import io from 'socket.io-client'
import add from '../styles/add.png'
import accept from '../styles/accept.png'
import deny from '../styles/deny.png'

const mapStatetoProps = ({ state })  =>{
   return { state }
}
const mapDispatchToProps = (dispatch) =>{
   return{
      fetchSendFriendRequest: (senderId,recieverName) => dispatch(loadSendFriendRequest(senderId,recieverName)),
      fetchUpdateUserSocket: (name,socket) => dispatch(loadUpdateSocketId(name,socket)),
      fetchSetRecieverSocket: (name) => dispatch(loadSocketFromName(name)),
      fetchUserDetails: (userId) => dispatch(loadUserDetails(userId)),
      fetchFriendRequestResponse: (userId, friendId, choice) => dispatch(loadFriendRequestResponse(userId, friendId, choice)),
      fetchOpenChat: (reciever,sender) => dispatch(loadOpenChat(reciever,sender)),
      fetchUpdateUserSocket: (name,socket) => dispatch(loadUpdateSocketId(name,socket)),
      fetchSetSocket: (socket) => dispatch((loadSetSocket(socket))),
      fetchResetChatWith: (user) => dispatch((loadResetChatWith(user))),
      fetchRecentMesagesArray: (array) => dispatch((setRecentMessagesArray(array)))
   }
}

const Conversations = (props) =>{
   const { socket, foreignUser, primaryUser, recentMessagesArray, loggedUser,currentRecipientSocket } = props.state
   const [currentFriendReqRecipient, setCurrentFriendReqRecipient] = useState('') 
   const [openChat , setOpenChat] = useState(false)
   const [chatBox, setChatBox] = useState(false)

   const sendFriendRequest = async (e) => {
      e.preventDefault()
      await props.fetchSendFriendRequest(loggedUser.id,currentFriendReqRecipient)
      await props.fetchSetRecieverSocket(currentFriendReqRecipient)
   }
   const handleChoice = async (user, choice) => {
      await props.fetchFriendRequestResponse(
         user.UserFriendRequests.userId,
         user.UserFriendRequests.friendId,
         choice)
      await props.fetchSetRecieverSocket(user.name)
      await props.fetchUserDetails(loggedUser.id)
   }
   const handleOpenChatBox = async (reciever, sender) => {
      await props.fetchOpenChat(reciever, sender)
      setOpenChat(true)
      setChatBox(!chatBox)
   }
   const getRecentMessageInline = async ()=>{
      const array = []
      for(let i = 0; i < await loggedUser.friend.length; i++){
         const message = await getRecentMessage(loggedUser.friend[i],loggedUser)
         array.push(message.message?message.message.content:"")
      }
      return array
   }

   useEffect(()=>{
      const socket = io.connect("https://sendfast.herokuapp.com")
      props.fetchSetSocket(socket)
   },[])
   useEffect (() => {
      if(socket){
      socket.on("connect", async () =>{ 
         console.log('socketid for this instance', socket.id)
         await props.fetchUpdateUserSocket(loggedUser.name,socket.id)
         await props.fetchSetSocket(socket)
      })
      socket.on('recieve friend request', async ()=>{
         await props.fetchUserDetails(loggedUser.id)
      })
   }
  },[socket])
  useEffect(()=>{
   if(currentRecipientSocket){
      socket.emit('send friend request', currentRecipientSocket)
   }
  },[currentRecipientSocket])
  useEffect(()=>{
   const helper = async () =>{
      await props.fetchRecentMesagesArray(await getRecentMessageInline())
   }
   helper()
  },[loggedUser.friend])

   return(
      <div >
         <div  className='conversations'>
            <div className={`conversations-container-${!chatBox}`}>
               <div className = 'your-conversations'>Your Contacts</div>
               <div className ='conversations-list'>
                  {loggedUser.friend&&recentMessagesArray?loggedUser.friend.map((user,index) =>{
                     return (
                           <div onClick = {()=>{handleOpenChatBox(user, loggedUser)}} className = 'conversation-card' key = {index}>
                              <div className = 'conversation-card-name'>{user.name}</div>
                              <div className = 'conversation-card-message'>{recentMessagesArray[index]}</div>
                           </div>
                     )
                  }):null}
                  {loggedUser.friendrequestrecieved?loggedUser.friendrequestrecieved.map((user,index) => {
                     return (
                        <div className = 'request-card' key = {index}>
                           <div>Requst from {user.name}</div>
                           <img src={accept} className="options" onClick = { async ()=>{ await handleChoice(user,true) }}/>
                           <img src={deny} className="options" onClick = { async ()=>{ await handleChoice(user,false) }}/>
                        </div>
                     )
                  }):null}
               <form className='add-friends' onSubmit = {(e) =>{sendFriendRequest(e)}}>
                  <input  className="add-input" onChange = {(e) => {setCurrentFriendReqRecipient(e.target.value)}} placeholder = "  Add Friends"/>
                  <button className='add-input' type ='submit'>Send</button>
                  <img src = {add} className="add-friends-button" type = 'submit'/>
               </form>
               </div>
            </div>
            {openChat?<Chatbox chatBox = {chatBox} setChatBox = {setChatBox} foreignUser = {foreignUser} primaryUser = {primaryUser}/> :null}
         </div>
      </div>
   )
}

export default connect(mapStatetoProps, mapDispatchToProps)(Conversations)