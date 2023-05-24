import { Socket } from "socket.io-client" 
import { DefaultEventsMap } from "socket.io/dist/typed-events"
// import './rang.css'
import { useState } from "react"

//create an interface for the props that you want to pass to this component
interface MessageBoxProps {
    socket: Socket<DefaultEventsMap, DefaultEventsMap> //this is the type for sockets 
    msg:string;
    //you can always add more functions/objects that you would like as props for this component

}


function MessageBox({socket, msg}:MessageBoxProps){
    
    const [message, setMessage] = useState<string>("")
    //click handler
    const handleClick = (socket: Socket) => {
        console.log('Socket ID:', socket.id);
        // Do something with the socket object, such as emit an event
        // socket.emit('myEvent', { data: 'Hello, world!' });
        socket.emit('username', { data: message });
    };


    return(
        <>
        <div className="right-side-container messages-container">
          <h1>Messages</h1>
          <div className="message-box">
            <div className="message-content-container">
              {msg}
            </div>
          </div>
        </div>
        </>
    )

}
export default MessageBox









