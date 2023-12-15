import React from "react";
import { Container } from "react-bootstrap";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import About from "./About";

function Body() {
    return (
        <Container>
            <Routes>
                <Route path="/home" element={<Home />}></Route>
                <Route path="/about" element={<About />}></Route>
                <Route path="*" element={<Navigate to="/home" replace />}></Route>
            </Routes>
        </Container>
    );
}

export default Body;