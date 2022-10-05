import { Link } from "react-router-dom"
import LoginAndSignup from "./LoginAndSignup"

const Nav = () =>{
    return(
        <div className="row-nowrap-sb">
            <div>
                <Link to="/">Home</Link>
                <Link to="/conversations">Your Conversations</Link>
            </div>
            <LoginAndSignup/>

        </div>
    )
}

export default Nav