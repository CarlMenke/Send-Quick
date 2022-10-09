import React, { useEffect, useState } from 'react'
import { connect } from "react-redux"
import { loadOpenChat, loadFriendRequestResponse, loadMessages, loadUpdateSocketId, loadSocketFromName, loadSendFriendRequest,loadUserDetails} from "../store/actions/MessageActions"
import Chatbox from './Chatbox'

const mapStatetoProps = ({ state })  =>{
   return { state }
}

const mapDispatchToProps = (dispatch) =>{
   return{
      fetchSendFriendRequest: (senderId,recieverName) => dispatch(loadSendFriendRequest(senderId,recieverName)),
      fetchSetMessageArray: (primaryId, foreignId) => dispatch(loadMessages(primaryId, foreignId)),
      fetchUpdateUserSocket: (name,socket) => dispatch(loadUpdateSocketId(name,socket)),
      fetchSocketFromName: (name) => dispatch(loadSocketFromName(name)),
      fetchUserDetails: (userId) => dispatch(loadUserDetails(userId)),
      fetchFriendRequestResponse: (userId, friendId, choice) => dispatch(loadFriendRequestResponse(userId, friendId, choice)),
      fetchOpenChat: (reciever,sender) => dispatch(loadOpenChat(reciever,sender))
   }
}

const Conversations = (props) =>{
   const { socket, foreignUser, primaryUser } = props.state
   const [currentFriendReqRecipient, setCurrentFriendReqRecipient] = useState('') 
   const [openChat , setOpenChat] = useState(false)
   const [requestSocket, setRequestSocket] = useState(null)
   const [chatBox, setChatBox] = useState(false)

   
   useEffect(()=>{
      socket.on('disconnect', ()=>{console.log('disconnected')})
      socket.on('recieve reload',(data) =>{
         props.fetchUserDetails(props.state.loggedUser.id)
      })
   },[socket])

   useEffect(()=>{
      if(primaryUser && foreignUser){
         props.fetchSetMessageArray(primaryUser.id, foreignUser.id)
      }
   },[primaryUser,foreignUser])

   useEffect(()=>{
      if(props.state.currentRecipientSocket){
         console.log(props.state.currentRecipientSocket)
         const data = {socket:props.state.currentRecipientSocket}
         socket.emit('send reload', data)
      }
   },[props.state.currentRecipientSocket])

      useEffect(()  =>{
         console.log(chatBox)
   },[chatBox])
   const sendFriendRequest = async (e) => {
      e.preventDefault()
      await props.fetchSendFriendRequest(props.state.loggedUser.id,currentFriendReqRecipient)
      await props.fetchSocketFromName(currentFriendReqRecipient)
   }

   const handleChoice = async (user, choice) => {
      props.fetchFriendRequestResponse(
         user.UserFriendRequests.userId,
         user.UserFriendRequests.friendId,
         choice)
      await props.fetchSocketFromName(user.name)
      await props.fetchUserDetails(props.state.loggedUser.id)
   }

   const handleOpenChatBox = async (reciever, sender) => {
      setOpenChat(true)
      setChatBox(!chatBox)
      props.fetchOpenChat(reciever, sender)
      console.log(chatBox)
   }

   return(
      <div >
         <div  className='dropdown'>
            <div className={`conversations-container-${!chatBox}`}>
               <div>
               <div>Conversations</div>
                  {props.state.loggedUser.friend.map((user,index) =>{
                     return (
                           <div onClick = {()=>{handleOpenChatBox(user, props.state.loggedUser)}}className = 'conversation-card' key = {index}>
                              <div className = 'conversation-card-name'>{user.name}</div>
                              <div className = 'conversation-card-message' >most recent message</div>
                           </div>
                     )
                  })}
               </div>
               <div>
                  {props.state.loggedUser.friendrequestrecieved.map((user,index) => {
                     return (
                        <div className = 'row-nowrap' key = {index}>
                           <div>Requst from {user.name}</div>
                           <button className="button"onClick = { async ()=>{ await handleChoice(user,true) }}>✅
                              </button>
                           <button className="button" onClick = { async ()=>{ await handleChoice(user,false) }}>❌
                              </button>
                        </div>
                     )
                  })}
               </div>
               <form onSubmit = {(e) =>{sendFriendRequest(e)}}>
                  <input  className="input" onChange = {(e) => {setCurrentFriendReqRecipient(e.target.value)}} placeholder = "Recipient's Name"/>
                  <button className="button" type = 'submit'>Send Friend Request</button> 
               </form>
            </div>
            <div className = {`chatbox-container-${chatBox}`}>
               {openChat?<Chatbox chatBox = {chatBox} setChatBox = {setChatBox}/> :null}
            </div>
         </div>
      </div>
   )
}

export default connect(mapStatetoProps, mapDispatchToProps)(Conversations)