import { useEffect } from "react"
import { connect } from "react-redux"
import { loadMessages } from "../store/actions/MessageActions"


const mapStatetoProps = ({ state }) =>{
   return { state }
}

const mapDispatchToProps = (dispatch) =>{
   return{
       fetchMessageByUser: (userId) => dispatch(loadMessages(userId)),
   }
}

const Conversations = (props) =>{

   // useEffect(()=>{
   //    props.fetchMessageByUser(props.messageState.loggedUser.id)
   // },[])

   return(
      <div>
         <div>Conversations</div> 
      </div>
   )
}

export default connect(mapStatetoProps, mapDispatchToProps)(Conversations)