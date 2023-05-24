import { Socket } from "socket.io-client" 
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import './Home.css'
import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom';


//create an interface for the props that you want to pass to this component
interface HomePageProps {
    socket: Socket<DefaultEventsMap, DefaultEventsMap> //this is the type for sockets 
    //you can always add more functions/objects that you would like as props for this component
    setUserFunction: any
    addUserFunction: any
    users: number
}


function HomePage({socket , setUserFunction , addUserFunction , users}:HomePageProps){
    
    const navigate = useNavigate();
    const [message, setMessage] = useState<string>("")
    

    const handleClick = (socket: Socket) => {
        console.log('Socket ID:', socket.id);
        socket.emit('username', message);

        navigate('/loading')

    };


    return(
        <>
            <div className="sampleHomePage">
                <h1 className="sampleTitle">My Game</h1>

                <div className="sampleMessage">
                    <input  placeholder = "Enter your name please" onChange={(e)=>{ setMessage(e.target.value)}}></input>
                    <button  onClick={() => handleClick(socket)}>Enter</button>
                </div>
            </div>
        </>
    )

}
export default HomePage