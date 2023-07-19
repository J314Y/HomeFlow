import React from "react";
import { 
  Button,
  Grid,
} from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage";

const Settings = ({votesToSkip, guestCanPause, roomCode, setShowSettings}) => {

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <CreateRoomPage 
                    update={true} 
                    votesToSkip={votesToSkip} 
                    guestCanPause={guestCanPause}  
                    roomCode={roomCode} 
                    updateCallback={null} />
            </Grid>
            <Grid item xs={12} align="center" >
                <Button variant="contained" color="secondary" onClick={() => setShowSettings(false)}>
                    Close
                </Button>
            </Grid>
        </Grid>
    );
}

export default Settings;