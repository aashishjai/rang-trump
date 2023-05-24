import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { useState } from "react";
import Card from "./Card";
import MessageBox from "./message-box";
// import './rang.css'
// import './playing-cards.css'

//create an interface for the props that you want to pass to this component
interface CardAreaProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>; //this is the type for sockets
  //you can always add more functions/objects that you would like as props for this component
  //   setUserFunction: any;
  cards: any[]
}

function CardArea({ socket, cards}: CardAreaProps) {
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
      <div className="card-area">
        <div className="card-area-rows output-row-one">
          {cards.length >= 3 && <Card socket={socket} rank={cards[2].rank} suit={cards[2].suit} />} {/* this is for player 3 */}
        </div>
        <div className="card-area-rows output-row-two">
          {cards.length >= 2 && <Card socket={socket} rank={cards[1].rank} suit={cards[1].suit} />} {/* This is for player 2 */}
          {cards.length >= 4 && <Card socket={socket} rank={cards[3].rank} suit={cards[3].suit} />} {/* this is for player 4 */}
        </div>
        <div className="card-area-rows output-row-three">
          {cards.length >= 1 && <Card socket={socket} rank={cards[0].rank} suit={cards[0].suit} />} {/* this is for player 1 */}
        </div>
      </div>
    </>
  );
}
export default CardArea;
