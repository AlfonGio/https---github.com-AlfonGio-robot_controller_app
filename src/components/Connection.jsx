import React, { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import Config from "../scripts/config";

function Connection() {
    const [connected, setConnected] = useState(false);
    const [ros, setRos] = useState(null);
    const [error, setError] = useState(null);
    const [reconnectionAttempts, setReconnectionAttempts] = useState(0);

    useEffect(() => {
        const newRos = new window.ROSLIB.Ros();

        newRos.on('connection', () => {
            console.log('Connection established!');
            setConnected(true);
            setError(null);
            setReconnectionAttempts(0);
        });

        newRos.on('close', () => {
            console.log('Connection closed!');
            setConnected(false);
            setError('Connection closed. Reconnecting....');
            // Retry logic with incremental back-off
            const timeoutId = setTimeout(() => {
                try {
                    newRos.connect(`ws://${Config.ROSBRIDGE_SERVER_IP}:${Config.ROSBRIDGE_SERVER_PORT}`);
                } catch (error) {
                    console.error('Connection problem:', error);
                    setError(error.message);
                }
            }, reconnectionAttempts * Config.RECONNECTION_TIMER);

            setReconnectionAttempts(attempts => attempts + 1);
            return () => clearTimeout(timeoutId);
        });

        newRos.on('error', (error) => {
            console.error('Connection Error:', error);
            setError(`Connection error: ${error.message}`);
        });

        try {
            newRos.connect(`ws://${Config.ROSBRIDGE_SERVER_IP}:${Config.ROSBRIDGE_SERVER_PORT}`);
        } catch (error) {
            console.error('Connection problem:', error);
            setError(`Connection problem: ${error.message}`);
        }

        setRos(newRos);

        // Clean-up function
        return () => {
            newRos.close();
        };
    }, []);

    return (
        <div>
            <Alert className="text-center m-3" variant={connected ? "success" : "danger"}>
                {connected ? "Robot Connected" : "Robot Disconnected"}
            </Alert>
        </div>
    );
}

export default Connection;