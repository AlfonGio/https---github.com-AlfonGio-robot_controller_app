import React, {useState} from "react";

function Connect() {
    const connected = useState(false);

    const handleRobotConnect = () => {
        fetch('http://10.42.0.1:3001/start-rosbridge-server', { method: 'POST' })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Network response was not ok, status: ${response.status}`);
          }
          return response.text();
        })
        .then(text => {
          try {
            const jsonData = JSON.parse(text);
            console.log('JSON data:', jsonData);
            return jsonData;
          } catch (error) {
            console.error('Failed to parse JSON:', text);
            throw error;
          }
        })
        .then(data => {
          console.log('Script executed successfully:', data);
        })
        .catch(error => console.error('Error:', error));
    };

    const handleRobotStart = () => {
        fetch('http://10.42.0.1:3001/start-robot', { method: 'POST' })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Network response was not ok, status: ${response.status}`);
          }
          return response.text();
        })
        .then(text => {
          try {
            const jsonData = JSON.parse(text);
            console.log('JSON data:', jsonData);
            return jsonData;
          } catch (error) {
            console.error('Failed to parse JSON:', text);
            throw error;
          }
        })
        .then(data => {
          console.log('Script executed successfully:', data);
        })
        .catch(error => console.error('Error:', error));
    };

    return (
        <div className="text-left">
            <button className={`button ${connected ? "status-button-connect" : "button-disconnect"}`} onClick={handleRobotConnect}>
                {connected ? "Connect Robot" : "Disconnect Robot"}
            </button>
            <button className={`button ${connected ? "button-disconnect" : "status-button-connect"}`} onClick={handleRobotStart}>
                {connected ? "Start Robot" : "Stop Robot"}
            </button>
        </div>
    );
}

export default Connect;