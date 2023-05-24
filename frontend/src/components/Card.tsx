import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { useState } from "react";

//create an interface for the props that you want to pass to this component

interface CardProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>; //this is the type for sockets
  //you can always add more functions/objects that you would like as props for this component
//   setUserFunction: any;
    suit: string
    rank: string
}

function Card({socket, rank , suit}: CardProps) {
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
      <div className={`card rank-${rank} ${suit}`}>
          <span className="rank">{rank.toUpperCase()}</span>
          <span className="suit" dangerouslySetInnerHTML={{__html: `&${suit};`}}></span>
      </div>
    </>
  );
}
export default Card;
