import './styles/App.css';
import React from 'react';
import {Route, Routes, useNavigate, useParams} from 'react-router-dom'
import Nav from './components/Nav';
import Conversations from './components/Conversations';
import Home from './components/Home';

function App() {
  return (
    <div className="App">
      <Nav/>
      <Routes>
        <Route path = "/" element={<Home/>}/>
        <Route path = "/Conversations" element={<Conversations/>}/>
      </Routes>
    </div>
  );
}

export default App;
