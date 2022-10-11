import { connect } from "react-redux"
import { useState, useEffect, useRef } from "react"
import { loadSendMessage, loadNewMessage, loadMessages,loadTyping,  loadUpdateSocketId, loadSocketFromName, loadUserDetails, loadCloseChat} from "../store/actions/MessageActions"
import bubble from '../styles/bubble.gif'

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

    useEffect(()=>{
        props.state.socket.on("recieved message", async (data)=>{
            await props.fetchMessagesByUsers(data.recieverId, data.senderId,)          
        })
        props.state.socket.on('recieve typing start', async () => {
            console.log()
            await props.fetchTyping(true)
        })
        props.state.socket.on('recieve typing end', async () => {
            await props.fetchTyping(false)
        })
    },[props.state.socket])
    useEffect(()=>{
        if(props.state.foreignUser){
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        }
    },[props.state.messageArray, props.state.foreignUser])
    useEffect(()=>{
        if(message === ''){
            props.state.socket.emit('send typing end',props.state.foreignUser.socket, props.state.primaryUser.name)
        }
    },[message])
    useEffect(()=>{
        props.state.socket.emit('send message', props.state.foreignUser.socket, props.state.primaryUser.name)
    },[props.state.sendMessage])

    const handleNewMessage = async (content, e) =>{
        e.preventDefault()
        props.state.socket.emit('send typing end', props.state.foreignUser.socket, props.state.primaryUser.name)
        await props.fetchSendMessage(content, props.state.primaryUser, props.state.foreignUser)
        await props.fetchMessagesByUsers(props.state.primaryUser.id, props.state.foreignUser.id)
        e.target[0].value = ''
    }
    const handleMessageType = async (e) =>{
        setMessage(e.target.value)
        if(!props.state.typing){
            console.log(props.state.foreignUser.socket, props.state.primaryUser.name)
            props.state.socket.emit('send typing start', props.state.foreignUser.socket, props.state.primaryUser.name)
        }
    }
    useEffect(()=>{
        if(!props.state.typing){
            if(message === ''){
                props.state.socket.emit('send typing end',props.state.foreignUser.socket, props.state.primaryUser.name)
            }
        }
    },[message])
    const handleBack = async () =>{
        await props.setChatBox(false)
        await props.fetchCloseChat(props.state.loggedUser)
    }

    return (
        <div className = {`chatbox-container-${props.chatBox}`}>
         <button onClick = {()=>{handleBack()}}>Back</button>
            <div className="column-nowrap">
                <div>{props.state.foreignUser?props.state.foreignUser.name:null}</div>
                <div className="chatbox">
                    {props.state.messageArray.map((message, index)=>{
                        return(
                            <div className = {`chatbox-${message.config}`} key = {index}>{message.content}</div>
                        )
                    })}
                    <img className = {`typing-bubble-${props.state.typing}`} src={bubble} alt='...'/>
                    <div ref={messagesEndRef}/>
                </div>
                <form className='message-form' onSubmit={(e) => {handleNewMessage(message,e)}}>
                    <input className="input" placeholder = "..." onChange = {(e)=>{handleMessageType(e)}}/>
                    <button className="button" type = 'submit'>Send</button>
                </form>
            </div>
        </div>
    )
}

export default connect(mapStatetoProps, mapDispatchToProps)(Chatbox)