import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button, Grid, Typography } from "@material-ui/core";
import SettingsButton from "./SettingsButton.js"
import Settings from "./Settings.js";

const RoomPage = (props) => {
    let navigate = useNavigate();    

    const defaultGuestCanPause = true;
    const defaultVotes = 2;
    const defaultIsHost = false;

    const [guestCanPause, setGuestCanPause] = useState(defaultGuestCanPause);
    const [votesToSkip, setVotesToSkip] = useState(defaultVotes);
    const [isHost, setIsHost] = useState(defaultIsHost);
    const [roomCode, setRoomCode] = useState(useParams().roomCode);
    const [showSettings, setShowSettings] = useState(false);
    const [spotifyAuthenticated, setAuthenticated] = useState(false);

    const authenticateSpotify = () => {
        console.log("authenticating spotify")
        fetch('/spotify/is-authenticated')
        .then((response) => response.json())
        .then((data) => {
            console.log("Authentication: ");
            console.log(data.status.toString());
            setAuthenticated(data.status);
            if (!data.status) {
                console.log("here")
                fetch('/spotify/get-auth-url')
                .then((response) => response.json())
                .then((data) => {
                    window.location.replace(data.url)
                });
            }
        });
    }

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
    }

    const getRoomDetails = () => {
        console.log("get room details");
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
                
                console.log(data.is_host.toString());
                if (data.is_host) {
                    console.log("printing in the ishost");
                    authenticateSpotify();
                }
            })
            .catch((error) => console.log(error));
    }

    const showSettingsButton = () => {
        setShowSettings(true);
    }

    useEffect(() => {
        getRoomDetails();
    }, [])

    if (showSettings) {
        return (
            <Settings votesToSkip={votesToSkip} guestCanPause={guestCanPause} roomCode={roomCode} setShowSettings={setShowSettings} updateCallback={getRoomDetails} /> 
        );
    }

    return (
        
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Code: {roomCode}
                </Typography>
            </Grid>
            
            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" onClick={leaveButtonPressed}> Leave Room </Button>
            </Grid>
        </Grid>
    );
    
}


export default RoomPage;

