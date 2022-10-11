import React, { useEffect, useState } from 'react'
import { connect } from "react-redux"
import { loadResetChatWith, loadOpenChat, loadSetSocket, loadFriendRequestResponse, loadMessages, loadUpdateSocketId, loadSocketFromName, loadSendFriendRequest,loadUserDetails} from "../store/actions/MessageActions"
import Chatbox from './Chatbox'
import io from 'socket.io-client'

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
      fetchResetChatWith: (user) => dispatch((loadResetChatWith(user)))
   }
}

const Conversations = (props) =>{
   const { socket, foreignUser, primaryUser } = props.state
   const [currentFriendReqRecipient, setCurrentFriendReqRecipient] = useState('') 
   const [openChat , setOpenChat] = useState(false)
   const [chatBox, setChatBox] = useState(false)

   useEffect(()=>{
      const socket = io.connect("http://localhost:3002")
      props.fetchSetSocket(socket)
   },[])
   useEffect (() => {
      if(socket){
      socket.on("connect", async () =>{
         console.log('socketid for this instance', socket.id)
         await props.fetchUpdateUserSocket(props.state.loggedUser.name,socket.id)
         await props.fetchSetSocket(socket)
      })
      socket.on('recieve friend request', async ()=>{
         await props.fetchUserDetails(props.state.loggedUser.id)
      })
   }
  },[socket])
  useEffect(()=>{
   if(props.state.currentRecipientSocket){
      socket.emit('send friend request', props.state.currentRecipientSocket)
   }
  },[props.state.currentRecipientSocket])

   const sendFriendRequest = async (e) => {
      e.preventDefault()
      await props.fetchSendFriendRequest(props.state.loggedUser.id,currentFriendReqRecipient)
      await props.fetchSetRecieverSocket(currentFriendReqRecipient)
   }
   const handleChoice = async (user, choice) => {
      await props.fetchFriendRequestResponse(
         user.UserFriendRequests.userId,
         user.UserFriendRequests.friendId,
         choice)
      await props.fetchSetRecieverSocket(user.name)
      await props.fetchUserDetails(props.state.loggedUser.id)
   }
   const handleOpenChatBox = async (reciever, sender) => {
      await props.fetchOpenChat(reciever, sender)
      setOpenChat(true)
      setChatBox(!chatBox)
   }

   return(
      <div >
         <div  className='conversations'>
            <div className={`conversations-container-${!chatBox}`}>
               <div>
               <div>Conversations</div>
               <div className ='conversations-list'>
                  {props.state.loggedUser.friend?props.state.loggedUser.friend.map((user,index) =>{
                     return (
                           <div onClick = {()=>{handleOpenChatBox(user, props.state.loggedUser)}}className = 'conversation-card' key = {index}>
                              <div className = 'conversation-card-name'>{user.name}</div>
                              <div className = 'conversation-card-message'>most recent message</div>
                           </div>
                     )
                  }):null}
               </div>
               </div>
               <div>
                  {props.state.loggedUser.friendrequestrecieved?props.state.loggedUser.friendrequestrecieved.map((user,index) => {
                     return (
                        <div className = 'row-nowrap' key = {index}>
                           <div>Requst from {user.name}</div>
                           <button className="button"onClick = { async ()=>{ await handleChoice(user,true) }}>✅
                              </button>
                           <button className="button" onClick = { async ()=>{ await handleChoice(user,false) }}>❌
                              </button>
                        </div>
                     )
                  }):null}
               </div>
               <form className='add-friends' onSubmit = {(e) =>{sendFriendRequest(e)}}>
                  <input  className="input" onChange = {(e) => {setCurrentFriendReqRecipient(e.target.value)}} placeholder = "Recipient's Name"/>
                  <button className="add-friends-button" type = 'submit'>+</button> 
               </form>
            </div>
            {openChat?<Chatbox chatBox = {chatBox} setChatBox = {setChatBox} foreignUser = {foreignUser} primaryUser = {primaryUser}/> :null}
         </div>
      </div>
   )
}

export default connect(mapStatetoProps, mapDispatchToProps)(Conversations)