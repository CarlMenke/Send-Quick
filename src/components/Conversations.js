import React, { useEffect, useState } from 'react'
import { connect } from "react-redux"
import { loadFriendRequestResponse, loadMessages, loadUpdateSocketId, loadSocketFromName, loadSendFriendRequest,loadUserDetails} from "../store/actions/MessageActions"

const mapStatetoProps = ({ state })  =>{
   return { state }
}

const mapDispatchToProps = (dispatch) =>{
   return{
       fetchMessageByUser: (userId) => dispatch(loadMessages(userId)),
       fetchUpdateUserSocket: (name,socket) => dispatch(loadUpdateSocketId(name,socket)),
       fetchSocketFromName: (name) => dispatch(loadSocketFromName(name)),
       fetchSendFriendRequest: (senderId,recieverName) => dispatch(loadSendFriendRequest(senderId,recieverName)),
       fetchUserDetails: (userId) => dispatch(loadUserDetails(userId)),
       fetchFriendRequestResponse: (userId, friendId, choice) => dispatch(loadFriendRequestResponse(userId, friendId, choice))
   }
}

const Conversations = (props) =>{
   const [currentMessage, setCurrentMessage] = useState('') 
   const [currentMessageRecipient, setCurrentMessageRecipient] = useState('') 
   const [currentFriendReqRecipient, setCurrentFriendReqRecipient] = useState('') 
   const [recievedMessage, setRecievedMessage] = useState('')
   const { socket } = props.state

   useEffect(()=>{
      socket.on("recieve private message", (data) => {
         setRecievedMessage(data)
      })
      socket.on('recieve reload',() =>{
         console.log('running recieve reload event')
         props.fetchUserDetails(props.state.loggedUser.id)
      })
   },[socket])

   useEffect(()=>{
      props.fetchUserDetails(props.state.loggedUser.id)
      socket.emit("send reload", props.state.currentRecipientSocket)
   },[socket])

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
   useEffect(()=>{
      socket.emit("send reload", props.state.currentRecipientSocket)
   },[props.state.currentRecipientSocket])

   return(
      <div>
         <div>Chat</div>
         <form onSubmit = {(e) =>{sendFriendRequest(e)}}>
            <input onChange = {(e) => {setCurrentFriendReqRecipient(e.target.value)}} placeholder = "Recipient's Name"/>
            <button type = 'submit'>Send Friend Request</button> 
         </form>
         <div>
            {props.state.loggedUser.friendrequestrecieved.map((user,index) =>{
               return (
                  <div className = 'row-nowrap' key = {index}>
                     <div>Requst from {user.name}</div>
                     <button onClick = { async ()=>{
                        props.fetchFriendRequestResponse(
                           user.UserFriendRequests.userId,
                           user.UserFriendRequests.friendId,
                           true)
                           await props.fetchSocketFromName(user.name)
                           await props.fetchUserDetails(props.state.loggedUser.id)
                        }}>✅
                        </button>
                     <button onClick = { async ()=>{props.fetchFriendRequestResponse(
                           user.UserFriendRequests.userId,
                           user.UserFriendRequests.friendId,
                           false)
                           await props.fetchSocketFromName(user.name)
                           await props.fetchUserDetails(props.state.loggedUser.id)
                           }}>❌
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
                     </div>
               )
            })}
         </div>
         <div>{recievedMessage}</div>
      </div>
   )
}

export default connect(mapStatetoProps, mapDispatchToProps)(Conversations)