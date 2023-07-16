import React from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import RoomPage from "./RoomPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

function HomePage() {

    return (
      <Router>
        <Routes>
          <Route path="/" element={<p> This is a homepage </p>} />
          <Route path="join" element={<RoomJoinPage />} />
          <Route path="create" element={<CreateRoomPage />} /> 
          <Route path="room/:roomCode" element={<RoomPage />} />
        </Routes>
      </Router>
    );
}

export default HomePage