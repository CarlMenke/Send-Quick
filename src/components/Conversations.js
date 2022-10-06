import React, { useEffect, useState } from 'react'
import { connect } from "react-redux"
import { loadMessages, loadUpdateSocketId, loadSocketFromName} from "../store/actions/MessageActions"
import io from 'socket.io-client'

const mapStatetoProps = ({ state })  =>{
   return { state }
}

const mapDispatchToProps = (dispatch) =>{
   return{
       fetchMessageByUser: (userId) => dispatch(loadMessages(userId)),
       fetchUpdateUserSocket: (name,socket) => dispatch(loadUpdateSocketId(name,socket)),
       fetchSocketFromName: (name) => dispatch(loadSocketFromName(name))
   }
}

const Conversations = (props) =>{

   const [currentMessage, setCurrentMessage] = useState('') 
   const [currentRecipient, setCurrentRecipient] = useState('') 
   const [recievedMessage, setRecievedMessage] = useState('')
   const { socket } = props.state

   useEffect(()=>{
      socket.on("recieve private message", (data) => {
         setRecievedMessage(data)
      })
   },[socket])

   const sendPrivateMessage = async (e) =>{
      e.preventDefault()
      await props.fetchSocketFromName(currentRecipient)

      const data = {
         message:currentMessage,
         recipientId:props.state.currentRecipientSocket
      }
      socket.emit("send private message",data)
   }

   return(
      <div>
         <div>Conversations</div>
         <form onSubmit = {(e) =>{sendPrivateMessage(e)}}>
            <input onChange = {(e) => {setCurrentRecipient(e.target.value)}} placeholder = "Recipient's Name"/>
            <input onChange = {(e) => {setCurrentMessage(e.target.value)}} placeholder = "Message..."/>
            <button type = 'submit'>Send Message</button> 
         </form>
         <div>{recievedMessage}</div>
      </div>
   )
}

export default connect(mapStatetoProps, mapDispatchToProps)(Conversations)