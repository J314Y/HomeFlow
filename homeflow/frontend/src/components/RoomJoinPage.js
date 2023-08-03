import React, { useState } from "react";
import { 
  Button,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";

export default function RoomJoinPage() {
  let navigate = useNavigate();

  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  
  const handleRoomCodeChange = e => {
    setRoomCode(e.target.value);
  };

  const handleEnterRoomButtonClick = e => {
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        room_code: roomCode
      }),
    };  
    fetch("/api/join-room", requestOptions)
      .then((response) => {
        if (response.ok) {
          navigate('/room/' + roomCode)
        }
        else {
          setError('Room Not Found')
        }
      }).catch((error) => {
        console.log(error);
      });
  };

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Join a Room
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <TextField
          label="Room Code"
          placeholder="Enter a Room Code"
          onChange={handleRoomCodeChange}
          error={error}
          helperText={error}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} align="center">
        <Button variant="contained" color="primary" onClick={handleEnterRoomButtonClick} >Enter Room </Button>
      </Grid>
      <Grid item xs={12} align="center">
        <Button variant="contained" color="secondary" to="/" component={Link} >Back </Button>
      </Grid>
    </Grid>
  );

}
