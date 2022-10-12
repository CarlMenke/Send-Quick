import { useEffect, useState} from "react"
import { useNavigate } from "react-router-dom"
import { connect } from "react-redux"
import { loadSignup , loadSetDisplayMessage, loadLogout, loadLogin} from "../store/actions/MessageActions"

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
    const {logged, displayMessage, loggedUser} = props.state
    const { showMenu , handleDropDown} = props
    const [name, setName] = useState(null)
    const [password, setPassword] = useState(null)
    const navigate = useNavigate()

    useEffect(()=>{
        if(logged){
            navigate('/conversations')
            handleDropDown()
        }
    },[logged])

    if(!logged){
        return(
            <div >
                <div className={`login-content-${showMenu}`}>
                    <div className = 'column-nowrap'>
                        <div className="display-message">{displayMessage}</div>
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
            <div className='login-card'>
                <div className={`login-content-${showMenu}`}>
                    <div className="display-message">{displayMessage}</div>
                    <button 
                        className="button"
                        onClick = {async() => {
                            await props.fetchLogout(loggedUser)
                            await props.fetchSetDisplayMessage("Login / Sign Up")
                            handleDropDown()
                        }}>
                        Logout
                    </button>
                </div>
            </div>
        )
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)(LoginAndSignup)