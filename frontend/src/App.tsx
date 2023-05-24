import React, { useState } from 'react';
import logo from './logo.svg';
import HomePage from './components/Home/Home';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import {io} from "socket.io-client"
// import InHand from './components/inhand';
// import Table from './components/table';
import MyGame from './components/game';
import LoadingPage from './components/LoadingPage';
const socket = io('http://localhost:3001',{ transports: ["websocket"] });
socket.connect()

function App() {

  const [users, setUsers] = useState(0)
  const [username, setUsername] = useState<string>("")
  console.log(users)
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage socket={socket} setUserFunction={setUsername} addUserFunction={setUsers} users={users}/>} />

          <Route path="/rang" element={<MyGame socket={socket}/>} />
          <Route path="/loading" element={<LoadingPage socket={socket} />} />

        </Routes>
      </Router>

    </div>
  );
}

export default App;
