import { connect } from "react-redux"
import { useState, useEffect } from "react"
import { loadNewMessage, loadMessages, loadUpdateSocketId, loadSocketFromName, loadUserDetails} from "../store/actions/MessageActions"



const mapStatetoProps = ({ state })  =>{
    return { state }
 }
 
 const mapDispatchToProps = (dispatch) =>{
    return{
        fetchMessagesByUsers: (primaryId, foreignId) => dispatch(loadMessages(primaryId, foreignId)),
        fetchUpdateUserSocket: (name,socket) => dispatch(loadUpdateSocketId(name,socket)),
        fetchSocketFromName: (name) => dispatch(loadSocketFromName(name)),
        fetchUserDetails: (userId) => dispatch(loadUserDetails(userId)),
        fetchNewMessage: (content, primaryUser, foreignUser) => dispatch(loadNewMessage(content, primaryUser, foreignUser))
    }
 }
const Chatbox = (props) =>{
    const { foreignUser, primaryUser } = props
    const { socket } = props.state

    const [message, setMessage] = useState('')

    useEffect(()=>{
        props.fetchMessagesByUsers(primaryUser.id, foreignUser.id)
        socket.on("recieve reload", ()=>{
            props.fetchMessagesByUsers(primaryUser.id, foreignUser.id)
        })
    },[socket])

    const handleNewMessage = async (content, primaryUser, foreignUser,e) =>{
        console.log(content, primaryUser, foreignUser)
        e.preventDefault()
        await props.fetchNewMessage(content, primaryUser, foreignUser)
        socket.emit('send reload', foreignUser.socket)
    }

    //add lofic to get all messages between these 2 useres and add them to an array
    return (
        <div className="column-nowrap">
            <div>{foreignUser.name}</div>
            <div className="chatbox">
                {props.state.messageArray.map((message, index)=>{
                    return(
                        <div className = {`chatbox-${message.config}`} key = {index}>{message.content}</div>
                    )
                })}
            </div>
            <form onSubmit={(e) => {handleNewMessage(message, primaryUser, foreignUser,e)}}>
                <input placeholder = "..." onChange = {(e)=>{setMessage(e.target.value)}}/>
                <button type = 'submit'>Send</button>
            </form>
        </div>
    )
}

export default connect(mapStatetoProps, mapDispatchToProps)(Chatbox)