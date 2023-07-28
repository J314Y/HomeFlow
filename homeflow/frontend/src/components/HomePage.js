import React, { useEffect, useState } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import RoomPage from "./RoomPage";
import { 
  Button, 
  ButtonGroup, 
  Grid, 
  Typography 
} from "@material-ui/core";
import {
  BrowserRouter as Router,
  Link,
  Navigate,
  useNavigate,
  Routes,
  Route,
} from "react-router-dom";


function renderHomePage() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} align="center">
        <Typography variant="h3" compact="h3">
          House Party Music Controller
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <ButtonGroup disableElevation variant="contained" color="primary"> 
          <Button color="primary" to="/join" component={Link}>
            Join a Room
          </Button>
          <Button color="secondary" to="/create" component={Link}>
            Create a Room
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  );
}

function HomePage() {
  const [roomCode, setRoomCode] = useState();

  const clearRoomCode = () => {
    setRoomCode(null)
  };
  
  useEffect(() => {
    fetch('/api/user-in-room')
    .then((response) => response.json())
    .then((data) => { 
      if (data.code) {
        setRoomCode(data.code)
      }
    }).catch((error) => {
      console.log(error);
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={roomCode ? <Navigate to={`/room/${roomCode}`} /> : renderHomePage() } >  </Route>
        <Route path="join" element={<RoomJoinPage />} />
        <Route path="create" element={<CreateRoomPage />} /> 
        <Route path="room/:roomCode" element={<RoomPage onDeleteRoom={clearRoomCode} />} />
      </Routes>
    </Router>
  );
}

export default HomePage