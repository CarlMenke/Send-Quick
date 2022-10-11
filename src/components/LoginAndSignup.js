import { useEffect, useState} from "react"
import { useNavigate } from "react-router-dom"
import { connect } from "react-redux"
import { loadSignup , loadSetDisplayMessage, loadLogout, loadLogin} from "../store/actions/MessageActions"
import dropdown from '../styles/login.png'

const mapStatetoProps = ({state}) => {
    return {state}
}
 
const mapDispatchToProps = (dispatch) => {
    return{
        fetchSignup:(name,password) => dispatch(loadSignup(name,password)),
        fetchLogin:(name,password) => dispatch(loadLogin(name,password)),
        fetchSetDisplayMessage:(message) => dispatch(loadSetDisplayMessage(message)),
        fetchLogout:(user) => dispatch(loadLogout(user)),
    }
}

const LoginAndSignup = (props) => {
    const [showMenu, setShowMenu] = useState(false)
    const [name, setName] = useState(null)
    const [password, setPassword] = useState(null)
    const navigate = useNavigate()

    const handleDropDown = () =>{
        setShowMenu(!showMenu)
    }

    useEffect(()=>{
        if(props.state.logged){
            navigate('/conversations')
        }
    },[props.state.logged])
    if(!props.state.logged){
        return(
            <div className="dropdown">
                <img src = {dropdown} className='login-icon' onClick = {()=>{handleDropDown()}}/>
                <div className={`login-content-${showMenu}`}>
                    <div className = 'column-nowrap'>
                        <div className="display-message">{props.state.displayMessage}</div>
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
            <div className="row-nowrap">
                <div className="display-message">{props.state.displayMessage}</div>
                <button 
                    className="button"
                    onClick = {async() => {
                        await props.fetchLogout(props.state.loggedUser)
                        await props.fetchSetDisplayMessage("Login / Sign Up")
                    }}>
                    Logout
                </button>
            </div>
        )
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)(LoginAndSignup)