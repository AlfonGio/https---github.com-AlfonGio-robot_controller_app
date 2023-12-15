import React from "react";
import { Row, Col, Container, Card, CardBody, CardTitle } from "react-bootstrap";
import Connection from "./Connection";
import Connect from "./Connect";
import Teleoperation from "./Teleoperation";
import RobotState from "./RobotState";
import Map from "./Map";

function Home() {
    return (
        <div>
            <Container>
                <h1 className="text-center mt-3">Robot Control Interface</h1>
                <Row>
                    <Col>
                        <Connection />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card className="robot-status-card">
                            <CardBody>
                                <CardTitle>Robot Status</CardTitle>
                                <RobotState />
                                <Connect />
                            </CardBody>
                        </Card>
                        <Teleoperation />
                    </Col>
                    <Col>
                        <h2>MAP</h2>
                        <Map />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Home;