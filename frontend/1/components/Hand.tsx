import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { useState } from "react";
import MessageBox from "./message-box";
// import './rang.css'
// import './playing-cards.css'


//create an interface for the props that you want to pass to this component
interface HandProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>; //this is the type for sockets
  cards: any[]
  setCards: any
  isTurn: Boolean
  roundSuit: string
  gameOver:Boolean
  //you can always add more functions/objects that you would like as props for this component
//   setUserFunction: any;
}

function Hand({ socket, cards, setCards, isTurn, roundSuit, gameOver}: HandProps) {
  const [message, setMessage] = useState<string>("");
  //click handler
  const handleClick = (socket: Socket) => {
    console.log("Socket ID:", socket.id);
    // Do something with the socket object, such as emit an event
    // socket.emit('myEvent', { data: 'Hello, world!' });
    socket.emit("username", { data: message });
  };
  console.log("cards got in hand:" , cards)

  function noSuit() {
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].suit === roundSuit) {
        return false;
      }
    }
    return true;
  }


  return (
    <>
      <ul className="hand">
        {cards.map((card, index) => (
          <li key={index}>
            <button style={{all: 'unset'}} onClick={(e)=>{
              console.log("card clicked" , card)
              e.preventDefault();
              try {
                if ((isTurn) && (!gameOver)) {

                  if (roundSuit === "starting")
                  {
                    socket.emit("card-clicked", { card: card, round:"start" });
                    setCards((prevCards:any) => prevCards.filter((prevCard:any) => prevCard !== card));
                  }
                  else if ((roundSuit === card.suit) || (noSuit()))
                  {
                    socket.emit("card-clicked", { card: card, round:"" });
                    setCards((prevCards:any) => prevCards.filter((prevCard:any) => prevCard !== card));
                  }
                  else
                  {
                    console.log("Invalid move. Choose the right suite.");
                  }
                } else {
                  console.log("not your turn");
                }
              } catch (err) {
                console.log("error in card clicked", err);
              }
              console.log("after card clicked is called")
            }}>
            <a className={`card rank-${card.rank} ${card.suit}`} >
              <span className="rank">{card.rank}</span>
              <span className="suit" dangerouslySetInnerHTML={{__html: `&${card.suit};`}}></span>
            </a>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
export default Hand;
