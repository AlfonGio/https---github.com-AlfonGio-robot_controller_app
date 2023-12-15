import React, { useState, useEffect, useRef } from "react";
import Config from "../scripts/config";

function Map() {
    const [ros, setRos] = useState(null);
    const viewerRef = useRef(null);
    const zoomViewRef = useRef(null);

    useEffect(() => {
        const newRos = new window.ROSLIB.Ros();

        newRos.on('connection', () => {
            console.log('Connected to WS in Map component');
            setRos(newRos);
        });

        newRos.on('error', (error) => {
            console.log('Error connecting to WS in Map component', error);
        });

        try {
            newRos.connect(`ws://${Config.ROSBRIDGE_SERVER_IP}:${Config.ROSBRIDGE_SERVER_PORT}`);
            setRos(newRos);
        } catch (error) {
            console.error('Connection problem in Map component:', error);
        }

        return () => {
            newRos.close();
        };
    }, []);

    useEffect(() => {
        if (ros) {
            const navDiv = document.getElementById('nav_dir');
            if (navDiv) {
                initMapView(ros);
            }
        }
    }, [ros]);

    const initMapView = (ros) => {
        var viewer = new window.ROS2D.Viewer({
            divID: 'nav_dir',
            width: 1024, //640,
            height: 768, //480,
        });

        viewerRef.current = viewer;

        var gridClient = new window.ROS2D.OccupancyGridClient({
            ros: ros,
            rootObject: viewer.scene,
            continuous: true,
        });

        gridClient.on('change', () => {
            viewer.scaleToDimensions(gridClient.currentGrid.width, gridClient.currentGrid.height);
            viewer.shift(gridClient.currentGrid.pose.position.x, gridClient.currentGrid.pose.position.y);
        });

        zoomViewRef.current = new window.ROS2D.ZoomView({
            rootObject: viewer.scene
        });
    };

    const handleZoom = (zoomFactor) => {
        const zoomView = zoomViewRef.current;
        const viewer = viewerRef.current;
        if (zoomView && viewer && viewer.scene && viewer.scene.canvas) {
            const canvas = viewer.scene.canvas;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            zoomView.startZoom(centerX, centerY);
            zoomView.zoom(zoomFactor);
        }
    };

    return (
        <div>
            <div id='nav_dir' style={{ width: '100%', height: '500px'}}>Viewer</div>
            <button onClick={() => handleZoom(1.1)}>Zoom In</button>
            <button onClick={() => handleZoom(0.9)}>Zoom Out</button>
        </div>
    );
}

export default Map;