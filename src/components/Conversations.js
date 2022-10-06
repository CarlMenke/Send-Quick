import React, { useEffect, useState } from 'react'
import { connect } from "react-redux"
import { loadMessages, loadUpdateSocketId, loadSocketFromName, loadSendFriendRequest,loadUserDetails} from "../store/actions/MessageActions"
import io from 'socket.io-client'

const mapStatetoProps = ({ state })  =>{
   return { state }
}

const mapDispatchToProps = (dispatch) =>{
   return{
       fetchMessageByUser: (userId) => dispatch(loadMessages(userId)),
       fetchUpdateUserSocket: (name,socket) => dispatch(loadUpdateSocketId(name,socket)),
       fetchSocketFromName: (name) => dispatch(loadSocketFromName(name)),
       fetchSendFriendRequest: (senderId,recieverName) => dispatch(loadSendFriendRequest(senderId,recieverName)),
       fetchUserDetails: (userId) => dispatch(loadUserDetails(userId))
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
   },[socket])

   useEffect(()=>{
      props.fetchUserDetails(props.state.loggedUser.id)
   },[])
   const sendPrivateMessage = async (e) => {
      e.preventDefault()
      await props.fetchSocketFromName(currentMessageRecipient)
      const data = {
         message:currentMessage,
         recipientId:props.state.currentRecipientSocket
      }
      socket.emit("send private message",data)
   }

   // IN THE PROCESS OF ADDING SEND FRIEND REQUEST START HERE
   const sendFriendRequest = async (e) => {
      e.preventDefault()

      await props.fetchSendFriendRequest(props.state.loggedUser.id,currentFriendReqRecipient)
   }

   return(
      <div>
         <div>Chat</div>
         <form onSubmit = {(e) =>{sendFriendRequest(e)}}>
            <input onChange = {(e) => {setCurrentFriendReqRecipient(e.target.value)}} placeholder = "Recipient's Name"/>
            <button type = 'submit'>Send Friend Request</button> 
         </form>
         <div>
            {props.state.loggedUser.friendrequestrecieved.map((user) =>{
               return (
                  <div className = 'row-nowrap'>
                     <div>Requst from {user.name}</div>
                     <button>Accept</button>
                     <button>Reject</button>
                  </div>
               )
            })}
         </div>
         <form onSubmit = {(e) =>{sendPrivateMessage(e)}}>
            <input onChange = {(e) => {setCurrentMessageRecipient(e.target.value)}} placeholder = "Friends's Name"/>
            <input onChange = {(e) => {setCurrentMessage(e.target.value)}} placeholder = "Message..."/>
            <button type = 'submit'>Send Message</button> 
         </form>
         <div>{recievedMessage}</div>
      </div>
   )
}

export default connect(mapStatetoProps, mapDispatchToProps)(Conversations)