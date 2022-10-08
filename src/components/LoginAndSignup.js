import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { loadSetSocket, loadSignup , loadSetDisplayMessage, loadLogout, loadLogin, loadUpdateSocketId} from "../store/actions/MessageActions"
import io from 'socket.io-client'
import dropdown from '../styles/login.png'

const mapStatetoProps = ({state}) => {
    return {state}
}
 
const mapDispatchToProps = (dispatch) => {
    return{
        fetchSignup:(name,password) => dispatch(loadSignup(name,password)),
        fetchLogin:(name,password) => dispatch(loadLogin(name,password)),
        fetchUpdateUserSocket: (name,socket) => dispatch(loadUpdateSocketId(name,socket)),
        fetchSetDisplayMessage:(message) => dispatch(loadSetDisplayMessage(message)),
        fetchLogout:() => dispatch(loadLogout()),
        fetchSetSocket:(socket) =>dispatch(loadSetSocket(socket))
    }
}

const LoginAndSignup = (props) => {
    const [showMenu, setShowMenu] = useState(false)
    const [name, setName] = useState(null)
    const [password, setPassword] = useState(null)

    const handleDropDown = () =>{
        setShowMenu(!showMenu)
    }

    useEffect (() => {
        if(props.state.logged){
            const socketHelper = async () => {
                const socket = await io.connect("http://localhost:3002")
                await socket.on("connect", () =>{
                   props.fetchUpdateUserSocket(props.state.loggedUser.name,socket.id)
                   props.fetchSetSocket(socket)
                })
            }
            socketHelper()
        }
    },[props.state.logged])
    if(!props.state.logged){
        return(
            <div className="dropdown">
                <img src = {dropdown} className='login-icon' onClick = {()=>{handleDropDown()}}/>
                <div className={`login-content-${showMenu}`}>
                    <div className = 'column-nowrap'>
                        <div>{props.state.displayMessage}</div>
                        <input className='input' onChange={(e) => {setName(e.target.value)}} placeholder="Name..."/>
                        <input className='input' onChange={(e) => {setPassword(e.target.value)}} placeholder="Password..."/>
                        <div>
                            <button 
                                className="button"
                                type = 'click' 
                                onClick = {
                                    async () => {
                                        if(name !== '' && password !== ''){
                                            await props.fetchLogin(name,password)
                                        }
                                }}>
                                Login
                            </button>
                            <button 
                                className="button"
                                type = 'click' 
                                onClick = {
                                    async () => {
                                    await props.fetchSignup(name,password)
                                }}>
                                Sign up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }else{
        return(
            <div>
                <div>{props.state.displayMessage}</div>
                <button 
                    className="button"
                    onClick = {async() => {
                        await props.fetchLogout()
                        await props.fetchSetDisplayMessage("Login / Sign Up")
                    }}>
                    Logout
                </button>
            </div>
        )
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)(LoginAndSignup)