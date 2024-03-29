import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button, Grid, Typography } from "@material-ui/core";
import SettingsButton from "./SettingsButton.js"
import Settings from "./Settings.js";
import MusicPlayer from "./MusicPlayer.js";

export default function RoomPage(props) {
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
    const [currentSong, setCurrentSong] = useState({});
    const [errorFlag, setErrorFlag] = useState(false);

    const authenticateSpotify = () => {
        fetch('/spotify/is-authenticated')
        .then((response) => response.json())
        .then((data) => {
            setAuthenticated(data.status);
            if (!data.status) {
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

    const getCurrentSong = () => {
        fetch('/spotify/current-song')
        .then((response) => {
            if (!response.ok) {
                setErrorFlag(true);
                return {'error': 'no song playing'};
            } else {
                if (response.status == 204) {
                    setErrorFlag(true);
                    return {};
                }
                else {
                    return response.json();
                }
            }
        })
        .then((data) => {
            setCurrentSong(data);
        });
    }

    const getRoomDetails = () => {
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
                
                if (data.is_host) {
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
        getCurrentSong();
        const interval = setInterval(() => {
            getCurrentSong();
        }, 10000);
        return () => clearInterval(interval);
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
                <MusicPlayer song={currentSong} error={errorFlag} />
            </Grid>
            { isHost ? <SettingsButton change={showSettingsButton} /> : null }
            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" onClick={leaveButtonPressed}> Leave Room </Button>
            </Grid>
        </Grid>
    );
    
}

