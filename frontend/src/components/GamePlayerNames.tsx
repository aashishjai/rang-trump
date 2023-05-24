import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { useState } from "react";
import MessageBox from "./message-box";
// import './rang.css'
// import './playing-cards.css'


//create an interface for the props that you want to pass to this component
interface GamePlayerNameProps {
    socket: Socket<DefaultEventsMap, DefaultEventsMap>; //this is the type for sockets
    playerName1: String
    playerName2: String 
    playerName3: String
    playerName4: String

  //you can always add more functions/objects that you would like as props for this component
//   setUserFunction: any;
}

function GamePlayerName({ socket, playerName1, playerName2, playerName3, playerName4}: GamePlayerNameProps) {
  const [message, setMessage] = useState<string>("");
  //click handler
  const handleClick = (socket: Socket) => {
    console.log("Socket ID:", socket.id);
    // Do something with the socket object, such as emit an event
    // socket.emit('myEvent', { data: 'Hello, world!' });
    socket.emit("username", { data: message });
  };

  return (
    <>
        <div className="game-players-container">
            <div className="player-tag player-one">{playerName1}</div>
        </div>

        <div className="game-players-container">
            <div className="player-tag player-two">{playerName2}</div>
        </div>

        <div className="game-players-container">
            <div className="player-tag player-three">{playerName3}</div>
        </div>

        <div className="game-players-container">
            <div className="player-tag player-four">{playerName4}</div>
        </div>
    </>
  );
}
export default GamePlayerName;
