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
    const [message, setMessage] = useState('')
    const messagesEndRef = useRef(null)
    const [typingHelper, setTypingHelper] = useState(false)

    useEffect(()=>{
        props.state.socket.on("recieved message", async (data)=>{
            await props.fetchMessagesByUsers(data.recieverId, data.senderId)       
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })   
        })
        props.state.socket.on('recieve typing start', async () => {
            await props.fetchTyping(true)
            if(!typingHelper){  
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
                setTypingHelper(true)
                setTimeout(()=>{setTypingHelper(false)},2000)
            }
        })
        props.state.socket.on('recieve typing end', async () => {
            await props.fetchTyping(false)
        })
    },[props.state.socket])
    useEffect(()=>{
        props.state.socket.emit('send message', props.state.foreignUser.socket, props.state.primaryUser.name)
    },[props.state.sendMessage])
    useEffect(()=>{
        if(message === ''){
            props.state.socket.emit('send typing end',props.state.foreignUser.socket, props.state.primaryUser.name)
        }
        if(!props.state.typing){
            if(message === ''){
                props.state.socket.emit('send typing end',props.state.foreignUser.socket, props.state.primaryUser.name)
            }
        }
    },[message])

    const handleNewMessage = async (content, e) =>{
        e.preventDefault()
        props.state.socket.emit('send typing end', props.state.foreignUser.socket, props.state.primaryUser.name)
        await props.fetchSendMessage(content, props.state.primaryUser, props.state.foreignUser)
        await props.fetchMessagesByUsers(props.state.primaryUser.id, props.state.foreignUser.id)
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })   
        e.target[0].value = ''
    }
    const handleMessageType = async (e) =>{
        setMessage(e.target.value)
        if(!props.state.typing){
            console.log(props.state.foreignUser.socket, props.state.primaryUser.name)
            props.state.socket.emit('send typing start', props.state.foreignUser.socket, props.state.primaryUser.name)
        }
    }
    const handleBack = async () =>{
        await props.setChatBox(false)
        await props.fetchCloseChat(props.state.loggedUser)
    }

    return (
        <div className = {`chatbox-container-${props.chatBox}`}>
            <div className="name-back">
                <img src ={back} onClick = {()=>{handleBack()}} className = 'back-icon'/>
                <div className = "contact-name">{props.state.foreignUser?props.state.foreignUser.name:null}</div>
            </div>
            <div className="chatbox">
                {props.state.messageArray.map((message, index)=>{
                    return(
                        <div className = {`chatbox-${message.config}`} key = {index}>{message.content}</div>
                    )
                })}
                <div className="bubble-chat">
                    <img className = {`typing-bubble-${props.state.typing}`} src={bubble} alt='...'/>
                </div>
                <div ref={messagesEndRef}/>
            </div>
            <form className='message-form' onSubmit={(e) => {handleNewMessage(message,e)}}>
                <input className="input" placeholder = "..." onChange = {(e)=>{handleMessageType(e)}}/>
                <button className="button" type = 'submit'>Send</button>
            </form>
        </div>
    )
}

export default connect(mapStatetoProps, mapDispatchToProps)(Chatbox)