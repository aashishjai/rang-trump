import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { useEffect, useState } from "react";
import MessageBox from "./message-box";
import CardArea from "./CardArea";
import GamePlayerName from "./GamePlayerNames";
import Hand from "./Hand";
import SelectRang from "./SelectRang";
// import './rang.css'
// import './playing-cards.css'


//create an interface for the props that you want to pass to this component
interface MyGameProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>; //this is the type for sockets
  //you can always add more functions/objects that you would like as props for this component
//   setUserFunction: any;
}
interface Card {
  suit: string;
  rank: string;
  number: number;
}

// ...

function MyGame({ socket }: MyGameProps) {
  const [message, setMessage] = useState<string>("");
  const [cards, setCards] = useState<any[]>([]);
  const [isWinner, setIsWinner] = useState(false);
  const [usernames, setUsernames] = useState<string[]>([]);
  const sock = socket;
  const [gameOver, setGameOver] = useState(false);
  const [isTurn , setIsTurn] = useState(true)
  const [roundSuit, setRoundSuit] = useState("");
  // const [playedCards, setPlayedCards] = useState<string[]>([])
  const [playedCards, setPlayedCards] = useState<any[]>([])
  const [msg, setmsg] = useState("Please wait...");
  // const playedCards = [
  //   { suit: 'hearts', rank: 'a', number: 1 },
  //   { suit: 'hearts', rank: '2', number: 2 },
  //   { suit: 'hearts', rank: '3', number: 3 },
  //   { suit: 'hearts', rank: '4', number: 4 }
  // ]

  //click handler
  const handleClick = (socket: Socket) => {
    console.log("Socket ID:", socket.id);
    // Do something with the socket object, such as emit an event
    // socket.emit('myEvent', { data: 'Hello, world!' });
    socket.emit("username", { data: message });
  };

  useEffect(() => {
    sock.on("toss", (data) => {
      console.log("hereererere", data);
    });
    // console.log("here" , cards)
  }, [sock]);

  // in a use effect, ping the server to send the usernames of the players
  // useEffect(() => {
  //   sock.emit("get-usernames");

  //   sock.on("get-usernames", (data) => {
  //     setUsernames(data);
  //   });

  //   sock.on("cards", (data: { pattey: any[]; isRangger: boolean }) => {
  //     console.log("cards recieved" , data)
  //     setCards(data.pattey);
  //     setIsWinner(data.isRangger);
  //     // console.log(data.pattey)
  //   });


  // }, [sock]);

  useEffect(() => {
    sock.emit("get-usernames");

    sock.on("get-usernames", (data) => {
      console.log("getting username")
      setUsernames(data);
    });
    
    sock.on("cards", (data) => {
      console.log("cards received", data)
      setCards(data.pattey);
      setIsWinner(data.isRangger);
    });

    sock.on("game-over", (msg) => {
      setGameOver(true);
      setmsg(msg);
    })

    sock.on("msg" , (data:any)=>
    {
      setmsg(data);
    })

    sock.on("cards-round-2" , (data)=>{
      setmsg("The round has started!");
      console.log("got second round of cards" , data)
      setCards(prevCards => [...prevCards, ...data.pattey.filter((card:any) => !prevCards.includes(card))]);
      console.log("these are the cards after second receiving: " ,cards)
      setIsTurn(data.isTurn)

      if (data.isTurn)
      {
        setmsg("Start the round!");
        setRoundSuit("starting");
      }
    })
    
    // sock.on("card-clicked-server", (data:any)=>{
      //   console.log("card clicked in server game.tsx component" , data)
      //   sock.on("card-clicked-server", (data:any)=>{
        //     // console.log("card clicked in server game.tsx component" , data.card.suit)
        //     setCards(prevCards => prevCards.filter((card:any) => card.rank !== data.card.rank || card.suit !== data.card.suit));
        //     let thrown_card = {suit: data.suit , rank: data.rank , number: data.number}
        //     setIsTurn(data.isTurn)
        //   })
        // })
        
        
        // sock.on("card-clicked-server", (data: any) => {
          //   console.log("card clicked in server game.tsx component", data);
    //   setCards((prevCards) =>
    //     prevCards.filter(
    //       (card: any) =>
    //         card.rank !== data.card.rank || card.suit !== data.card.suit
    //     )
    //   );
    //   let thrown_card = { suit: data.suit, rank: data.rank, number: data.number };
    //   setIsTurn(usernames.indexOf(myData) === data.current_turn);
    // });
    
    

  },[cards]);

  useEffect(() => {
    sock.on("card-clicked-server", (data: any) => {
      // console.log("card clicked in server game.tsx component", data);
      setCards((prevCards) =>
        prevCards.filter(
          (card: any) =>
            card.rank !== data.card.rank || card.suit !== data.card.suit
        )
      );
      // let thrown_card = { suit: data.suit, rank: data.rank, number: data.number };
      setIsTurn(data.isTurn);
      setRoundSuit(data.roundSuit);
      // setPlayedCards(prevCards => [...prevCards, ...data.tableCards.filter((card:any) => !prevCards.includes(card))]);
      setPlayedCards(data.tableCards)
      // console.log("Played card:", playedCards)
      
    });
  }, []);

  useEffect(() => {
    sock.on("new-round", (data: any) => {
      console.log("in new round", data);
      setCards((prevCards) =>
        prevCards.filter(
          (card: any) =>
            card.rank !== data.card.rank || card.suit !== data.card.suit
        )
      );
      setIsTurn(data.isTurn);
      setPlayedCards(data.tableCards)

      if (data.isTurn === true)
      {
        setRoundSuit("starting");
      }
    })
  },[])


  


  return (
    <>
      <head>
        <title>Rang</title>

      </head>
      <body>
        <div className="main-container playingCards">
          <div className="game-container">
            <div className="heading-container">
              <h1>Rang</h1>
            </div>
            <div className="game-table-container">
              <div className="game-table">
                <CardArea socket={socket} cards={playedCards}/>
                {usernames && usernames.length === 4 && <GamePlayerName socket={socket} playerName1={usernames[0]} playerName2={usernames[1]} playerName3={usernames[2]} playerName4={usernames[3]} />}

              </div>
            </div>
            <div className="select-rang-container">
            {isWinner && <SelectRang socket={socket}></SelectRang>}
            </div>
          </div>
          <div className="messages-and-cards-container">
            <MessageBox socket={socket} msg={msg}/>
            <div className="right-side-container my-cards-container">
              <h1>My Cards</h1>
              <div className="my-cards-inner-container">
                {/* <Hand socket={socket} cards={cards}/> */}
                {isTurn && <Hand socket={socket} cards={cards} setCards={setCards} isTurn={isTurn} roundSuit={roundSuit} gameOver={gameOver}/>}
              </div>
            </div>
          </div>
        </div>
      </body>
    </>
  );
}
export default MyGame;
