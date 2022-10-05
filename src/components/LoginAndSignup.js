import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { loadSignup , loadSetDisplayMessage, loadLogout} from "../store/actions/MessageActions"

const mapStatetoProps = ({ state }) =>{
    return { state }
 }
 
 const mapDispatchToProps = (dispatch) =>{
    return{
        fetchSignup: (name,password) => dispatch(loadSignup(name,password)),
        fetchSetDisplayMessage: (message) => dispatch(loadSetDisplayMessage(message)),
        fetchLogout: () => dispatch(loadLogout())
    }
 }

const LoginAndSignup = (props) => {

    const [hovered, setHovered] = useState(false)
    const [name, setName] = useState(null)
    const [password, setPassword] = useState(null)

useEffect (()=>{
    if(props.state.logged){
        setHovered(false)
    }
},[props.state.logged])

    if(!props.state.logged){
        if(hovered){
            return(
                <div onMouseLeave={() => {
                    setHovered(false)
                    props.fetchSetDisplayMessage("Login / Sign Up")
                    }}>
                    <div className = 'column-nowrap'>
                        <div>{props.state.displayMessage}</div>
                            <input onChange={(e)=>{setName(e.target.value)}} placeholder="Name..."/>
                            <input onChange={(e)=>{setPassword(e.target.value)}} placeholder="Password..."/>
                            <div>
                                <button type = 'click'>Login</button>
                                <button type = 'click' onClick = {async ()=>{
                                    await props.fetchSignup(name,password)
                                    }}>
                                    Sign up
                                </button>
                            </div>
                    </div>
                </div>
            )
        }else{
            return(
                <div onMouseEnter={() => {setHovered(true)}} >
                    <div >{props.state.displayMessage}</div>
                </div>
            )
        }
    }else{
        return(
            <div>
                <div>{props.state.displayMessage}</div>
                <button onClick = {async()=>{
                    await props.fetchLogout()
                    await props.fetchSetDisplayMessage("Login / Sign Up")
                    }}>Logout</button>
            </div>
        )
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)(LoginAndSignup)