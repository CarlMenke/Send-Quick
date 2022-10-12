import { connect } from "react-redux"
import { useState, useEffect, useRef } from "react"
import { loadSendMessage, loadNewMessage, loadMessages,loadTyping,  loadUpdateSocketId, loadSocketFromName, loadUserDetails, loadCloseChat} from "../store/actions/MessageActions"
import bubble from '../styles/bubble.gif'
import back from '../styles/back.png'

const mapStatetoProps = ({ state })  =>{
    return { state }
 }
 const mapDispatchToProps = (dispatch) =>{
    return{
        fetchUpdateUserSocket: (name,socket) => dispatch(loadUpdateSocketId(name,socket)),
        fetchSocketFromName: (name) => dispatch(loadSocketFromName(name)),
        fetchUserDetails: (userId) => dispatch(loadUserDetails(userId)),
        fetchNewMessage: (content, primaryUser, foreignUser) => dispatch(loadNewMessage(content, primaryUser, foreignUser)),
        fetchMessagesByUsers: (primaryId, foreignId) => dispatch(loadMessages(primaryId, foreignId)),
        fetchTyping: (choice) => dispatch(loadTyping(choice)),
        fetchSendMessage: (content, primaryUser, foreignUser) => dispatch(loadSendMessage(content, primaryUser, foreignUser)),
        fetchCloseChat: (sender) => dispatch(loadCloseChat(sender)),
    }
 }

const Chatbox = (props) =>{
    const { socket , sendMessage, messageArray, typing, foreignUser, primaryUser, loggedUser} = props.state
    const [message, setMessage] = useState('')
    const messagesEndRef = useRef(null)
    const [typingHelper, setTypingHelper] = useState(false)

    useEffect(()=>{
        socket.on("recieved message", async (data)=>{
            await props.fetchMessagesByUsers(data.recieverId, data.senderId)       
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })   
        })
        socket.on('recieve typing start', async () => {
            await props.fetchTyping(true)
            if(!typingHelper){  
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
                setTypingHelper(true)
                setTimeout(()=>{setTypingHelper(false)},2000)
            }
        })
        socket.on('recieve typing end', async () => {
            await props.fetchTyping(false)
        })
    },[socket])
    useEffect(()=>{
        socket.emit('send message', foreignUser.socket, primaryUser.name)
    },[sendMessage])
    useEffect(()=>{
        if(message === ''){
            socket.emit('send typing end',foreignUser.socket, primaryUser.name)
        }
        if(!typing){
            if(message === ''){
                socket.emit('send typing end',foreignUser.socket, primaryUser.name)
            }
        }
    },[message])
    useEffect(()=>{
        messageArray.length>0?messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }):console.log()
    },[messageArray])

    const handleNewMessage = async (content, e) =>{
        e.preventDefault()
        socket.emit('send typing end', foreignUser.socket, primaryUser.name)
        await props.fetchSendMessage(content, primaryUser, foreignUser)
        await props.fetchMessagesByUsers(primaryUser.id, foreignUser.id)
        e.target[0].value = ''
    }
    const handleMessageType = async (e) =>{
        setMessage(e.target.value)
        if(!typing){
            socket.emit('send typing start', foreignUser.socket, primaryUser.name)
        }
    }
    const handleBack = async () =>{
        await props.setChatBox(false)
        await props.fetchCloseChat(loggedUser)
    }

    return (
        <div className = {`chatbox-container-${props.chatBox}`}>
            <div className="name-back">
                <img src ={back} onClick = {()=>{handleBack()}} className = 'back-icon'/>
                <div className = "contact-name">{foreignUser?foreignUser.name:null}</div>
            </div>
            <div className="chatbox">
                {messageArray.map((message, index)=>{
                    return(<div className = {`chatbox-${message.config}`} key = {index}>{message.content}</div>)
                })}
                <div className="bubble-chat">
                    <img className = {`typing-bubble-${typing}`} src={bubble} alt='...'/>
                </div>
                <div ref={messagesEndRef}/>
            </div>
            <form className='message-form' onSubmit={(e) => {handleNewMessage(message,e)}}>
                <input className="message-input" placeholder = "..." onChange = {(e)=>{handleMessageType(e)}}/>
                <button className="send" type = 'submit'>Send</button>
            </form>
        </div>
    )
}

export default connect(mapStatetoProps, mapDispatchToProps)(Chatbox)