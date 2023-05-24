import { Socket } from "socket.io-client" 
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom';

//create an interface for the props that you want to pass to this component
interface LoadingPageProps {
    socket: Socket<DefaultEventsMap, DefaultEventsMap> //this is the type for sockets 
    //you can always add more functions/objects that you would like as props for this component
}


function LoadingPage({socket}:LoadingPageProps){
    
    const navigate = useNavigate();
    useEffect(()=>{
        let time = setInterval(()=>{
            socket.emit('how-many')
            socket.on('how-many', (data)=>{
                if(data === 4){
                    
                    navigate('/rang')
                    clearInterval(time)
                }
            }
            )
        });

    },[])
    
    return(
        <>
        <div className="sampleHomePage">
            <h1 className="sampleTitle">My Game</h1>
            <div className="sampleMessage">
                <h3>Please wait for other players. You will be redirected shortly</h3>
            </div>
        </div>
        </>
    )

}
export default LoadingPage