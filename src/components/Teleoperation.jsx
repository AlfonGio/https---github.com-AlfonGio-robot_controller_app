import React, { useState, useEffect } from "react";
import { Joystick } from "react-joystick-component";
import Config from "../scripts/config";

function Teleoperation() {
    const [ros, setRos] = useState(null);
    const [error, setError] = useState(null);
    const [cmdVelPublisher, setCmdVelPublisher] = useState(null);
    const [reconnectionAttempts, setReconnectionAttempts] = useState(0);

    useEffect(() => {
        const newRos = new window.ROSLIB.Ros();

        newRos.on('connection', () => {
            console.log('Connection established in Teleoperation Component!');
            setError(null);
            setReconnectionAttempts(0);
            setCmdVelPublisher(new window.ROSLIB.Topic({
                ros: newRos,
                name: Config.CMD_VEL_TOPIC,
                messageType: 'geometry_msgs/Twist',
            }));
        });

        newRos.on('error', (error) => {
            console.error('Connection error in Teleoperation Component:', error);
            setError(`Connection error: ${error.message}`);
        })

        newRos.on('close', () => {
            console.log('Connection closed in Teleoperation Component!');
            setError('Connection closed. Reconnecting....');
            setCmdVelPublisher(null);
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

        try {
            newRos.connect(`ws://${Config.ROSBRIDGE_SERVER_IP}:${Config.ROSBRIDGE_SERVER_PORT}`);
        } catch (error) {
            console.error('Connection problem:', error);
            setError(`Connection problem: ${error.message}`);
        }

        setRos(newRos);

        return () => {
            newRos.close();
        };
    }, []);

    const handleMove = (event) => {
        if (!cmdVelPublisher) return;
        console.log('handle move');
        var twist = new window.ROSLIB.Message({
            linear: {
                x: event.y / 5,
                y: 0.0,
                z: 0.0,
            },
            angular: {
                x: 0.0,
                y: 0.0,
                z: -event.x / 5,
            },
        });

        cmdVelPublisher.publish(twist);
    };

    const handleStop = () => {
        if (!cmdVelPublisher) return;
        console.log('handle stop');
        var twist = new window.ROSLIB.Message({
            linear: {
                x: 0.0,
                y: 0.0,
                z: 0.0,
            },
            angular: {
                x: 0.0,
                y: 0.0,
                z: 0.0,
            },
        });

        cmdVelPublisher.publish(twist);
    };

    return (
        <div>
            <Joystick
                size={100}
                sticky={false}
                baseColor="#EEEEEE"
                stickColor="#BBBBBB"
                move={handleMove}
                stop={handleStop}>
            </Joystick>
        </div>
    );
}

export default Teleoperation;