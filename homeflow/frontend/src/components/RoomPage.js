import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button, Grid, Typography } from "@material-ui/core";

const RoomPage = (props) => {
    let navigate = useNavigate();    

    const defaultGuestCanPause = true;
    const defaultVotes = 2;
    const defaultIsHost = false;

    const [guestCanPause, setGuestCanPause] = useState(defaultGuestCanPause);
    const [votesToSkip, setVotesToSkip] = useState(defaultVotes);
    const [isHost, setIsHost] = useState(defaultIsHost);
    const [roomCode, setRoomCode] = useState(useParams().roomCode);

    const leaveButtonPressed = () => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        };
        props.onDeleteRoom()
        fetch('/api/leave-room', requestOptions)
            .then((response) => response.json())
            .then((data) => {
                navigate('/')
            });
        console.log("finished leave button pressed")
    }

    const getRoomDetails = () => {
        console.log('get room details')
        console.log(roomCode)
        fetch('/api/get-room' + '?code=' + roomCode)
            .then((response) => {
                if (!response.ok) {
                    props.onDeleteRoom();
                    navigate('/');
                  }
                return response.json();
            })
            .then((data) => {
                setGuestCanPause(data.guest_can_pause);
                setVotesToSkip(data.votes_to_skip);
                setIsHost(data.is_host);
            })
            .catch((error) => console.log(error));
    }

    useEffect(() => {
        getRoomDetails();
    }, [])

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Code: {roomCode}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Votes To Skip: {votesToSkip}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Guest Can Pause: {guestCanPause.toString()}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Is host: {isHost.toString()}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" onClick={leaveButtonPressed}> Leave Room </Button>
            </Grid>
        </Grid>
    );
    
}


export default RoomPage;

