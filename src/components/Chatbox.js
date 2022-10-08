import { connect } from "react-redux"
import { useState, useEffect, useRef } from "react"
import { loadNewMessage, loadMessages,loadTyping,  loadUpdateSocketId, loadSocketFromName, loadUserDetails} from "../store/actions/MessageActions"
import bubble from '../styles/bubble.gif'

const mapStatetoProps = ({ state })  =>{
    return { state }
 }
 
 const mapDispatchToProps = (dispatch) =>{
    return{
        fetchMessagesByUsers: (primaryId, foreignId) => dispatch(loadMessages(primaryId, foreignId)),
        fetchUpdateUserSocket: (name,socket) => dispatch(loadUpdateSocketId(name,socket)),
        fetchSocketFromName: (name) => dispatch(loadSocketFromName(name)),
        fetchUserDetails: (userId) => dispatch(loadUserDetails(userId)),
        fetchNewMessage: (content, primaryUser, foreignUser) => dispatch(loadNewMessage(content, primaryUser, foreignUser)),
        fetchTyping: (choice) => dispatch(loadTyping(choice))
    }
 }
const Chatbox = (props) =>{
    const { socket, foreignUser, primaryUser } = props.state
    const [message, setMessage] = useState('')
    const messagesEndRef = useRef(null)

    useEffect(()=>{
        socket.on("recieve reload", (data)=>{
            console.log('props.state.primaryUser', props.state.primaryUser)
            console.log('props.state.foreignUser', props.state.foreignUser)
            //console.log('pre if check:', data.UserFriends.friendId, primaryUser.id , data.UserFriends.userId , foreignUser.id)
            console.log('socket.io recieved data:',data)
            //this if must compare the data's sender and check if it is the same as the currnent open chat box
            if(data.UserFriends.friendId === primaryUser.id && data.UserFriends.userId === foreignUser.id){
                console.log('inside if')
                props.fetchMessagesByUsers(primaryUser.id, foreignUser.id)
            }                   
        })
        socket.on('recieve typing start', () => {
            props.fetchTyping(true)
        })
        socket.on('recieve typing end', () => {
            props.fetchTyping(false)
        })
    },[socket])
    useEffect(()=>{
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    },[props.state.messageArray])
    useEffect(()=>{
        if(message === ''){
            socket.emit('send typing end', foreignUser.socket)
        }
    },[message])

    const handleNewMessage = async (content, primaryUser, foreignUser, e) =>{
        e.preventDefault()
        socket.emit('send typing end', foreignUser.socket)
        await props.fetchNewMessage(content, primaryUser, foreignUser)
        await props.fetchMessagesByUsers(primaryUser.id, foreignUser.id)
        const data = {
            reciever: foreignUser,
            sender: primaryUser
        }
        socket.emit('send reload', foreignUser)
        e.target[0].value = ''
    }
    const handleMessageType = async (e) =>{
        setMessage(e.target.value)
        if(!props.state.typing){
            socket.emit('send typing start', foreignUser.socket)
        }
    }

    return (
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
            <form onSubmit={(e) => {handleNewMessage(message, primaryUser, foreignUser,e)}}>
                <input placeholder = "..." onChange = {(e)=>{handleMessageType(e)}}/>
                <button type = 'submit'>Send</button>
            </form>
        </div>
    )
}

export default connect(mapStatetoProps, mapDispatchToProps)(Chatbox)