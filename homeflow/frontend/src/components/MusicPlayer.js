import React, { useEffect, useState } from "react";
import { 
    Card,
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


    useEffect(() => {
        setTime(props.song.time);
        setDuration(props.song.duration);
        setTitle(props.song.title);
        setArtist(props.song.artist);
        setProgress(time / duration * 100);
        setIsPlaying(props.song.is_playing);
        setImageURL(props.song.image_url);
    }, [props])
    


    return (
      <Card>
        <Grid container alignItems="center">
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
                    <IconButton> 
                        { isPlaying ? <Pause /> : <PlayArrow /> } 
                    </IconButton>
                    <IconButton>
                        <SkipNext />
                    </IconButton>
                </div>
            </Grid>
        </Grid>
        <LinearProgress variant="determinate" value={progress}></LinearProgress>
      </Card>
    );
  }
  
  export default MusicPlayer;



