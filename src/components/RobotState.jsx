import React, { useState, useEffect} from "react";
import { Row, Col } from "react-bootstrap";
import Config from "../scripts/config";
import * as Three from "three";

function RobotState() {
    const [ros, setRos] = useState(null);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);
    const [reconnectionAttempts, setReconnectionAttempts] = useState(0);
    const [robotState, setRobotState] = useState({
        x: 0.0,
        y: 0.0,
        orientation: 0.0,
        linear_velocity: 0.0,
        angular_velocity: 0.0,
    });

    const initConnection = () => {
        const newRos = new window.ROSLIB.Ros();

        newRos.on('connection', () => {
            console.log('Connection established in RobotState Component!');
            setConnected(true);
            setError(null);
            setReconnectionAttempts(0);
        });

        newRos.on('close', () => {
            console.log('Connection closed in RobotState Component!');
            setConnected(false);
            setError('Connection closed. Reconnecting....');
            // Attempt to reconnect every few seconds
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
    };

    const getOrientationFromQuaternion = (ros_orientation_quaternion) => {
        const q = new Three.Quaternion(
            ros_orientation_quaternion.x,
            ros_orientation_quaternion.y,
            ros_orientation_quaternion.z,
            ros_orientation_quaternion.w
        );
        const RPY = new Three.Euler().setFromQuaternion(q);
        return RPY['_z'] * (180 / Math.PI);
    };

    const getRobotState = () => {
        if (!ros) return;

        // Pose subscriber from AMCL_POSE Topic
        const poseSubscriber = new window.ROSLIB.Topic({
            ros: ros,
            name: Config.ROBOT_POSE_TOPIC,
            messageType: 'geometry_msgs/msg/PoseWithCovarianceStamped',
        });

        poseSubscriber.subscribe((message) => {
            setRobotState(prevState => ({
                ...prevState,
                x: message.pose.pose.position.x.toFixed(3),
                y: message.pose.pose.position.y.toFixed(3),
                orientation: getOrientationFromQuaternion(message.pose.pose.orientation).toFixed(3),
            }));
        });

        // Velocity subscriber from ODOM Topic
        const velocitySubscriber = new window.ROSLIB.Topic({
            ros: ros,
            name: Config.ROBOT_VELOCITY_TOPIC,
            messageType: 'nav_msgs/msg/Odometry',
        });

        velocitySubscriber.subscribe((message) => {
            setRobotState(prevState => ({
                ...prevState,
                linear_velocity: message.twist.twist.linear.x.toFixed(3),
                angular_velocity: message.twist.twist.angular.z.toFixed(3),
            }));
        });
    };

    useEffect(() => {
        initConnection();
    }, []);

    useEffect(() => {
        getRobotState();
    }, [ros]);

    return (
        <div>
            <Row>
                <Col>
                    <h5 className="mt-4">Position</h5>
                    <p className="mt-0">X: {robotState.x}</p>
                    <p className="mt-0">Y: {robotState.y}</p>
                    <p className="mt-0">Orientation: {robotState.orientation}</p>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h5 className="mt-4">Velocities</h5>
                    <p className="mt-0">Linear Velocity: {robotState.linear_velocity}</p>
                    <p className="mt-0">Angular Velocity: {robotState.angular_velocity}</p>
                </Col>
            </Row>
        </div>
    );
}

export default RobotState;