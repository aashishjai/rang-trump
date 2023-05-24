import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { useState } from "react";

interface SelectRangProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

function SelectRang({ socket }: SelectRangProps) {
  const [selectedRang, setSelectedRang] = useState("");

  const handleRangSelection = (rang: string) => {
    setSelectedRang(rang);
    socket.emit("rang-selected", rang); // Emit an event to the server indicating the selected rang
  };

  return (
    <div className="select-rang-container">
      <h3>Select Rang:</h3>
      <button className="button-select-rang" onClick={() => handleRangSelection("diams")}>
        Diamond
      </button>
      <button className="button-select-rang" onClick={() => handleRangSelection("hearts")}>
        Hearts
      </button>
      <button className="button-select-rang" onClick={() => handleRangSelection("spades")}>
        Spades
      </button>
      <button className="button-select-rang" onClick={() => handleRangSelection("clubs")}>
        Clubs
      </button>
      {selectedRang && <p>You have selected {selectedRang} as your rang.</p>}
    </div>
  );
}

export default SelectRang;
