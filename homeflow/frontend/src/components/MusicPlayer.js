import React, { useEffect, useState } from "react";
import Alert from "@material-ui/lab/Alert";
import { 
    Card,
    Collapse,
    Grid,
    IconButton, 
    LinearProgress, 
    Typography,
} from "@material-ui/core";
import {
    PlayArrow,
    SkipNext, 
    Pause 
} from "@material-ui/icons";

function MusicPlayer(props) {
    
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [time, setTime] = useState(0);
    const [duration, setDuration] = useState(1);
    const [isPlaying, setIsPlaying] = useState('false');
    const [progress, setProgress] = useState(0);
    const [image, setImageURL] = useState('');
    const [error, setError] = useState(false);
    const [musicPlayerErrorMsg, setMusicPlayerErrorMsg] = useState('');
    const [pauseErrorSeverity, setPauseErrorSeverity] = useState("success");
    const [votes, setVotes] = useState(0);
    const [votesReq, setVotesRequired] = useState(1);

    useEffect(() => {
        setTime(props.song.time);
        setDuration(props.song.duration);
        setTitle(props.song.title);
        setArtist(props.song.artist);
        setProgress(time / duration * 100);
        setIsPlaying(props.song.is_playing);
        setImageURL(props.song.image_url);
        setError(props.error);
        setVotes(props.song.votes);
        setVotesRequired(props.song.votes_required)
    }, [props])

    const skipSong = () => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        };
        fetch('/spotify/skip', requestOptions);
    }

    const playPauseSong = () => {
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                isPlaying: isPlaying
            }),
        };
        console.log('about to hit play pause endpoint')
        fetch('/spotify/play-pause-song', requestOptions)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                if (data.message != 'Success') {
                    setPauseErrorSeverity('error')
                    setMusicPlayerErrorMsg(data.message)
                }
            });
    };

    function mainPlayer() {
        return (
            <Card>
                <Grid container alignItems="center">
                    <Grid item xs={12} align="center">
                        <Collapse in={musicPlayerErrorMsg != ''} >
                        <Alert severity={pauseErrorSeverity} onClose={() => { setMusicPlayerErrorMsg('')}}>
                            {musicPlayerErrorMsg}
                        </Alert>
                        </Collapse>
                    </Grid>
                    <Grid item align="center" xs={4}>
                        <img src={image} height="100%" width="100%" />
                    </Grid>
                    <Grid item align="center" xs={8}>
                        <Typography component="h5" variant="h5">
                            {title}
                        </Typography>
                        <Typography color="textSecondary" variant="subtitle1">
                            {artist}
                        </Typography>
                        <div>
                            <IconButton onClick={playPauseSong}> 
                                { isPlaying ? <Pause /> : <PlayArrow /> } 
                            </IconButton>
                            <IconButton onClick={skipSong}>
                                <SkipNext /> {votes} / {" "} {votesReq}
                            </IconButton>
                        </div>
                    </Grid>
                </Grid>
                <LinearProgress variant="determinate" value={progress}></LinearProgress>
            </Card>
        );
    }

    function errorComponent() {
        return (
            <Card>
                <Grid container alignItems="center">
                    <Grid item align="center" xs={12}>
                        <Typography component="h5" variant="h5">
                           No Song Playing 
                        </Typography>
                    </Grid>
                </Grid>
                <LinearProgress variant="determinate" value={0}></LinearProgress>
            </Card>
        );
    }

    return error ? errorComponent() : mainPlayer();
    
  }
  
  export default MusicPlayer;

