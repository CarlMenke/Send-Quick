import React, { useEffect, useState } from 'react'
import { connect } from "react-redux"
import { loadResetMessagesArray, loadFriendRequestResponse, loadMessages, loadUpdateSocketId, loadSocketFromName, loadSendFriendRequest,loadUserDetails} from "../store/actions/MessageActions"
import Chatbox from './Chatbox'

const mapStatetoProps = ({ state })  =>{
   return { state }
}

const mapDispatchToProps = (dispatch) =>{
   return{
      fetchSendFriendRequest: (senderId,recieverName) => dispatch(loadSendFriendRequest(senderId,recieverName)),
      fetchMessageByUser: (userId) => dispatch(loadMessages(userId)),
      fetchUpdateUserSocket: (name,socket) => dispatch(loadUpdateSocketId(name,socket)),
      fetchSocketFromName: (name) => dispatch(loadSocketFromName(name)),
      fetchUserDetails: (userId) => dispatch(loadUserDetails(userId)),
      fetchFriendRequestResponse: (userId, friendId, choice) => dispatch(loadFriendRequestResponse(userId, friendId, choice)),
      fetchSetMessageArray: (primaryId, foreignId) => dispatch(loadMessages(primaryId, foreignId))
   }
}

const Conversations = (props) =>{
   const { socket } = props.state
   const [currentMessage, setCurrentMessage] = useState('') 
   const [currentMessageRecipient, setCurrentMessageRecipient] = useState('') 
   const [currentFriendReqRecipient, setCurrentFriendReqRecipient] = useState('') 
   const [primaryUser, setPrimaryUser] = useState(null)
   const [foreignUser, setForeignUser] = useState(null)
   const [openChat , setOpenChat] = useState(false)
   const [recievedMessage, setRecievedMessage] = useState('')

   useEffect(()=>{
      socket.on("recieve private message", (data) => {
         setRecievedMessage(data)
      })
      socket.on('recieve reload',() =>{
         props.fetchUserDetails(props.state.loggedUser.id)
      })
      props.fetchUserDetails(props.state.loggedUser.id)
      socket.emit("send reload", props.state.currentRecipientSocket)
   },[socket])
   useEffect(()=>{
      socket.emit("send reload", props.state.currentRecipientSocket)
   },[props.state.currentRecipientSocket])
   useEffect(()=>{
      if(primaryUser && foreignUser){
         props.fetchSetMessageArray(primaryUser.id, foreignUser.id)
      }
   },[primaryUser,foreignUser])
   const sendPrivateMessage = async (e) => {
      e.preventDefault()
      await props.fetchSocketFromName(currentMessageRecipient)
      const data = {
         message:currentMessage,
         recipientId:props.state.currentRecipientSocket
      }
      socket.emit("send private message",data)
   }
   const sendFriendRequest = async (e) => {
      e.preventDefault()
      await props.fetchSendFriendRequest(props.state.loggedUser.id,currentFriendReqRecipient)
      await props.fetchSocketFromName(currentFriendReqRecipient)
      socket.emit("send reload", props.state.currentRecipientSocket)
   }
   const handleChoice = async (user, choice) =>{
      props.fetchFriendRequestResponse(
         user.UserFriendRequests.userId,
         user.UserFriendRequests.friendId,
         choice)
         await props.fetchSocketFromName(user.name)
         await props.fetchUserDetails(props.state.loggedUser.id)
   }

   return(
      <div>
         <div>Chat</div>
         <form onSubmit = {(e) =>{sendFriendRequest(e)}}>
            <input onChange = {(e) => {setCurrentFriendReqRecipient(e.target.value)}} placeholder = "Recipient's Name"/>
            <button type = 'submit'>Send Friend Request</button> 
         </form>
         <div>
            {props.state.loggedUser.friendrequestrecieved.map((user,index) => {
               return (
                  <div className = 'row-nowrap' key = {index}>
                     <div>Requst from {user.name}</div>
                     <button onClick = { async ()=>{ await handleChoice(user,true) }}>✅
                        </button>
                     <button onClick = { async ()=>{ await handleChoice(user,false) }}>❌
                        </button>
                  </div>
               )
            })}
         </div>
         <form onSubmit = {(e) =>{sendPrivateMessage(e)}}>
            <input onChange = {(e) => {setCurrentMessageRecipient(e.target.value)}} placeholder = "Friends's Name"/>
            <input onChange = {(e) => {setCurrentMessage(e.target.value)}} placeholder = "Message..."/>
            <button type = 'submit'>Send Message</button> 
         </form>
         <div>
         <div>Your Friends</div>
            {props.state.loggedUser.friend.map((user,index) =>{
               return (
                     <div className = 'row-nowrap' key = {index}>
                        <div>{user.name}</div>
                        <button onClick = { ()=>{ 
                           setOpenChat(true)
                           setForeignUser(user)
                           setPrimaryUser(props.state.loggedUser)
                           }}>Send Message</button>
                     </div>
               )
            })}
         </div>
         {openChat?<Chatbox primaryUser = {primaryUser} foreignUser = {foreignUser}/> :null}
      </div>
   )
}

export default connect(mapStatetoProps, mapDispatchToProps)(Conversations)