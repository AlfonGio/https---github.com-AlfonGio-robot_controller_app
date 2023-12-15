const Config = {
    // ROSBRIDGE_SERVER_IP: "172.20.39.235",
    // ROSBRIDGE_SERVER_IP: "192.168.0.8",
    ROSBRIDGE_SERVER_IP: "10.42.0.1",
    ROSBRIDGE_SERVER_PORT: "9090",
    RECONNECTION_TIMER: 3000,
    CMD_VEL_TOPIC: "/diff_cont/cmd_vel_unstamped",
    ROBOT_POSE_TOPIC: "/amcl_pose",
    ROBOT_VELOCITY_TOPIC: "/odom"
}

export default Config;
