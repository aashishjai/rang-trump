const { Socket } = require( "socket.io");

const express = require("express");
const app = express();
const http = require("http");
const {Server} = require('socket.io')
const cors = require('cors')

app.use(cors())
const server = http.createServer(app)
const io = new Server(
    server,{cors:{
        origin:"http://localhost:3001",
        methods: ["GET", "POST"]
    },
})

interface User
{
    socket: any
    cards: any
    name: any
}
let current_turn = 0;

let team_zero_two: number = 0
let team_one_three: number = 0


let cards = [
    { suit: 'hearts', rank: 'a', number: 14 },
    { suit: 'hearts', rank: '2', number: 2 },
    { suit: 'hearts', rank: '3', number: 3 },
    { suit: 'hearts', rank: '4', number: 4 },
    { suit: 'hearts', rank: '5', number: 5 },
    { suit: 'hearts', rank: '6', number: 6 },
    { suit: 'hearts', rank: '7', number: 7 },
    { suit: 'hearts', rank: '8', number: 8 },
    { suit: 'hearts', rank: '9', number: 9 },
    { suit: 'hearts', rank: '10', number: 10 },
    { suit: 'hearts', rank: 'j', number: 11 },
    { suit: 'hearts', rank: 'q', number: 12 },
    { suit: 'hearts', rank: 'k', number: 13 },
    { suit: 'diams', rank: 'a', number: 14 },
    { suit: 'diams', rank: '2', number: 2 },
    { suit: 'diams', rank: '3', number: 3 },
    { suit: 'diams', rank: '4', number: 4 },
    { suit: 'diams', rank: '5', number: 5 },
    { suit: 'diams', rank: '6', number: 6 },
    { suit: 'diams', rank: '7', number: 7 },
    { suit: 'diams', rank: '8', number: 8 },
    { suit: 'diams', rank: '9', number: 9 },
    { suit: 'diams', rank: '10', number: 10 },
    { suit: 'diams', rank: 'j', number: 11 },
    { suit: 'diams', rank: 'q', number: 12 },
    { suit: 'diams', rank: 'k', number: 13 },
    { suit: 'spades', rank: 'a', number: 14 },
    { suit: 'spades', rank: '2', number: 2 },
    { suit: 'spades', rank: '3', number: 3 },
    { suit: 'spades', rank: '4', number: 4 },
    { suit: 'spades', rank: '5', number: 5 },
    { suit: 'spades', rank: '6', number: 6 },
    { suit: 'spades', rank: '7', number: 7 },
    { suit: 'spades', rank: '8', number: 8 },
    { suit: 'spades', rank: '9', number: 9 },
    { suit: 'spades', rank: '10', number: 10 },
    { suit: 'spades', rank: 'j', number: 11 },
    { suit: 'spades', rank: 'q', number: 12 },
    { suit: 'spades', rank: 'k', number: 13 },
    { suit: 'clubs', rank: 'a', number: 14 },
    { suit: 'clubs', rank: '2', number: 2 },
    { suit: 'clubs', rank: '3', number: 3 },
    { suit: 'clubs', rank: '4', number: 4 },
    { suit: 'clubs', rank: '5', number: 5 },
    { suit: 'clubs', rank: '6', number: 6 },
    { suit: 'clubs', rank: '7', number: 7 },
    { suit: 'clubs', rank: '8', number: 8 },
    { suit: 'clubs', rank: '9', number: 9 },
    { suit: 'clubs', rank: '10', number: 10 },
    { suit: 'clubs', rank: 'j', number: 11 },
    { suit: 'clubs', rank: 'q', number: 12 },
    { suit: 'clubs', rank: 'k', number: 13 }
]



let users:User[] = []

let rang:string;

let tableCards:any[] = []

let users_copy:User[] = []

const clients = new Map()
let latestClientId = 0
var roundSuit = "";
var gameOver = false;

server.listen(3001, ()=>{
    console.log("SERVER IS LISTENING ON PORT 3001")
})
io.on("connection",(socket:any)=>{
    console.log("user connected with a socket id", socket.id)
    // let id = ++latestClientId
    // console.log("clients",id)
    
    socket.on("username", (myData: any) => {
        clients.set(socket, myData);
        console.log("Received myMessage:", myData);
        console.log("users.length" , users.length)
        users.push({socket: socket, cards: [] , name:myData})
        if (users.length === 4) {
            console.log("in the if condition")
            
            for (let i = 0; i < 4; i++) {
                
                let randomCard = Math.floor(Math.random() * cards.length)
                users[i].cards.push(cards[randomCard])
            }
            for (let i = 0; i< 4; i++)
            {
                users_copy.push({socket: users[i].socket, cards: users[i].cards, name:users[i].name})
            }
            // sorting the users by the highest card
            console.log(users_copy)
            users_copy.sort((a, b) => b.cards[0].number - a.cards[0].number)
            console.log(users_copy)
            let temp_name = users_copy[0].name
            for (let i = 0; i< 4; i++)
            {
                if (users[i].name === temp_name)
                {
                    current_turn = i
                }
            }

            for (let i = 0; i < 4; i++)
            {
                users[i].cards = [];
            }
            
            
            cards = shuffleCards(cards);

            for (let i = 0; i < 4; i++) {
                let start = i * 5
                let end = start + 5
                let userCards = cards.splice(start, 5)
                // users[i].cards = userCards
                // users[i].cards.concat(userCards)
                users[i].cards = [...users[i].cards, ...userCards]


                let data = {
                  pattey: userCards,
                  isRangger: i===current_turn
                }


                console.log("sending cards to: ", i)
                setTimeout(()=>{
                    users[i].socket.emit("cards", data)
                    io.emit("msg" , String(users[current_turn].name) + " will choose the rang")    

                } , 2000)
                
            }
        }
      });

    socket.on("how-many",()=>{
        socket.emit("how-many" , clients.size)
        
    })
    
    // send all the usernames when the frontend sends a message on "get-username"
    socket.on("get-usernames",()=>{
        console.log("sending usernames")
        socket.emit("get-usernames" , Array.from(clients.values()))
    }
    )

    socket.on("card-clicked",(data:any)=>{
        console.log("card clicked" , data.card)
        tableCards.push(data.card)
        current_turn+=1
        current_turn = current_turn%4
        console.log("this is the current turn:", current_turn)

        if (data.round === "start")
        {
            roundSuit = data.card.suit;
        }

        for(let i = 0; i < 4; i++)
        {
            console.log("data being sent to " , i , ": " , {card: data.card , isTurn: current_turn===i, tableCards: tableCards, roundSuit:roundSuit})
            users[i].socket.emit("card-clicked-server" , {card: data.card , isTurn: current_turn===i, tableCards: tableCards, roundSuit:roundSuit})
            io.emit("msg" , "it is " + String(users[current_turn].name + "'s turn now"))
        }
        if (tableCards.length === 4)
        {
            let max = {suit: "" , rank: "" , number: 0}
            let ind = 0
            console.log("all the players have played their turn")
            for (let j = 0; j<4; j++ )
            {
                if (tableCards[j].suit === rang)
                {

                    if (max.suit == rang)
                    {
                        if (tableCards[j].number > max.number)
                        {
                            max = tableCards[j]
                            ind = j
                        }
                    }
                    else
                    {
                        max = tableCards[j]
                        ind = j
                    }


                }
                else if(tableCards[j].number > max.number)
                {
                    if ((max.suit !== rang) && (tableCards[j].suit === roundSuit))
                    {
                        max = tableCards[j]
                        ind = j
                    }
                }

                console.log("max now:" , max)

            }

            for (let i = 0; i < 4; i++)
            {
                console.log("user: " , users[i].name , " cards: " , users[i].cards)
            }

            console.log("max: " , max)

            for (let k = 0; k< 4; k++)
            {
                for (let iter = 0; iter<13; iter++)
                {
                    if ((users[k].cards[iter].suit === max.suit) && (users[k].cards[iter].rank === max.rank))
                    {
                        ind = k
                        break
                    }
                }
            }

            
            current_turn = ind
            console.log("max was played by: " , users[current_turn].name)
            console.log("cards of the max player: " , users[current_turn].cards)
            let msg:string = ""
            if (current_turn == 0 || current_turn==2)
            {
                team_zero_two+=1
                console.log("player 1 and 3 won this round")
                msg = "player 1 and 3 won this round"
                io.emit("msg" , msg)

            }
            else
            {
                team_one_three+=1
                console.log("player 2 and 4 won this round")
                msg = "player 2 and 4 won this round"
                io.emit("msg" , msg)
            }

            if (team_zero_two == 7)
            {
                console.log("PLAYER 1 AND 3 WON THE GAME")
                io.emit("game-over", "PLAYER 1 AND 3 WON THE GAME!!!!!")
                gameOver = true;
            }

            if (team_one_three == 7)
            {
                console.log("PLAYER 2 AND 4 WON THE GAME!!!!!")
                io.emit("game-over", "PLAYER 2 AND 4 WON THE GAME!!!!!")
                gameOver = true;
            }

            console.log("Team One-Three Score:", team_zero_two)
            console.log("Team Two-Four Score:", team_one_three)
            tableCards = []


            if (!gameOver)
            {
                for(let i = 0; i < 4; i++)
                {
                    console.log("data being sent to " , i , ": " , {card: data.card , isTurn: current_turn===i, tableCards: tableCards})
                    setTimeout(()=>{
                        users[i].socket.emit("new-round" , {card: "" , isTurn: current_turn===i, tableCards: tableCards})
                        io.emit("msg" , "it is " + String(users[current_turn].name + "'s turn now"))
                    } , 1000)
                }
            }            


        }

        // io.emit("card-clicked-server", { card: data.card, current_turn });


    })
    
    socket.on("rang-selected",(selected_rang:any)=>{
        // console.log("rang selected by player: ", users[current_turn].name)
        rang = selected_rang
        // console.log("rang selected is: ", rang)
        for (let i = 0; i < 4; i++) {
            let start = i * 8
            let end = start + 8
            let userCards = cards.slice(start, end)

            // console.log("this is the deck now" , cards)
            // console.log("This is the current turn: ",current_turn)
            users[i].cards = [...users[i].cards, ...userCards]

            
            // display each users cards
            console.log("user: " , users[i].name , " cards: " , users[i].cards)

            let data = {
                isTurn: i===current_turn,
                pattey: userCards
            }
            // console.log("sending second pair of cards to: ", i)
            // console.log("cards being sent to", i, ": " , data)
            
            setTimeout(()=>{
                users[i].socket.emit("cards-round-2", data)
            }, 1000)

            

            
            
            
        }
    }
    )


    
})

function shuffleCards(cards: any[]) {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
}
  

