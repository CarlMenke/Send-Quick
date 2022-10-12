import { useEffect, useState} from "react"
import { useNavigate } from "react-router-dom"
import { connect } from "react-redux"
import { loadSignup , loadSetDisplayMessage, loadLogout, loadLogin} from "../store/actions/MessageActions"
import { deleteAccount } from "../services/MessageServicves"

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
    const { showMenu , handleDropDown} = props
    const [name, setName] = useState(null)
    const [password, setPassword] = useState(null)
    const [newName, setNewName] = useState(null)
    const navigate = useNavigate()


    useEffect(()=>{
        if(props.state.logged){
            navigate('/conversations')
            handleDropDown()
        }
    },[props.state.logged])

    if(!props.state.logged){
        return(
            <div >
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
            <div className='login-card'>
                <div className={`login-content-${showMenu}`}>
                    <div className="display-message">{props.state.displayMessage}</div>
                    <button 
                        className="button"
                        onClick = {async() => {
                            await props.fetchLogout(props.state.loggedUser)
                            await props.fetchSetDisplayMessage("Login / Sign Up")
                            handleDropDown()
                        }}>
                        Logout
                    </button>
                    <button onClick={
                        async ()=>{
                            await props.fetchLogout(props.state.loggedUser)
                            await props.fetchSetDisplayMessage("Login / Sign Up")
                            await deleteAccount(props.state.loggedUser)
                            handleDropDown()
                        }} className='button'>Delete Account</button>
                </div>
            </div>
        )
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)(LoginAndSignup)