import { Link } from "react-router-dom"
import LoginAndSignup from "./LoginAndSignup"
import dropdown from '../styles/dropdown.png'
import login from '../styles/login.png'
import { connect } from "react-redux"
import account from '../styles/account.png'
import { useState } from "react"

const mapStatetoProps = ({state}) => {
    return {state}
}
 
const mapDispatchToProps = (dispatch) => {
    return{
    }
}

const Nav = (props) => {
    const [showMenu1, setShowMenu1] = useState(false)
    const [showMenu2, setShowMenu2] = useState(false)

    const handleDropDown1 = () =>{
        setShowMenu1(!showMenu1)
    }
    const handleDropDown2 = () =>{
        setShowMenu2(!showMenu2)
    }
    
    return(
        <div>
            <div className="nav-bar">
                <img src = {dropdown} onClick ={()=>handleDropDown1()} className = 'dropdown-icon'/>
                <h1 className = 'send-quick'>Send Quick</h1>
                <img src = {props.state.logged?account:login} className='login-icon' onClick = {()=>{handleDropDown2()}}/>
            </div>
            <div className={`dropdown-content-${showMenu1}`}>
                <Link onClick = {()=>handleDropDown1()} className="nav-link" to="/">Home</Link>
                <Link onClick = {()=>handleDropDown1()} className="nav-link" to="/conversations">Conversations</Link>
                <Link onClick = {()=>handleDropDown1()} className="nav-link" >Games</Link>
            </div>
            <LoginAndSignup showMenu = {showMenu2} handleDropDown = {handleDropDown2}/>
        </div>
    )
}

export default connect(mapStatetoProps, mapDispatchToProps)(Nav)