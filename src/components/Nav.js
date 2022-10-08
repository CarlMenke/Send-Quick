import { Link } from "react-router-dom"
import LoginAndSignup from "./LoginAndSignup"
import dropdown from '../styles/dropdown.png'
import { useState } from "react"

const Nav = () => {

    const [showMenu, setShowMenu] = useState(false)

    const handleDropDown = () =>{
        setShowMenu(!showMenu)
    }
    return(
        <div className="nav-bar">
            <div className="dropdown">
                <img src = {dropdown} onClick ={()=>handleDropDown()} className = 'dropdown-icon'/>
                <div className={`dropdown-content-${showMenu}`}>
                    <Link className="nav-link" to="/">Home</Link>
                    <Link className="nav-link" to="/conversations">Conversations</Link>
                    <Link className="nav-link" >Games</Link>
                </div>
            </div>
            <LoginAndSignup/>
        </div>
    )
}

export default Nav