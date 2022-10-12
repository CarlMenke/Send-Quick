import './styles/App.css'
import React from 'react'
import { connect } from 'react-redux'
import { Route, Routes, Navigate } from 'react-router-dom'
import Nav from './components/Nav'
import Conversations from './components/Conversations'
import Home from './components/Home'

const mapStatetoProps = ({ state }) =>{
  return { state }
}
const mapDispatchToProps = (dispatch) =>{
  return{
  }
}

function App(props){
  return (
    <div className="App">
      <Nav />
      <Routes>
        <Route className='homepage' path = "/" element={<Home />}/>
        <Route 
          path = '/conversations'
          element={props.state.loggedUser && props.state.logged ? (
            <Conversations />
          ) : (
            <Navigate replace to = '/'/>
          )}/>
      </Routes>
    </div>
  );
}

export default connect(mapStatetoProps, mapDispatchToProps)(App)
