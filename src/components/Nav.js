import { Link } from "react-router-dom"

const Nav = () =>{
    return(
        <div className="row-nowrap-sb">
            <Link to="/">Home</Link>
            <Link to="/conversations">Your Conversations</Link>
        </div>
    )
}

export default Nav