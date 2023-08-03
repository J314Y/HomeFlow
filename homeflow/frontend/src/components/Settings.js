import React from "react";
import { 
  Button,
  Grid,
} from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage";

export default function Settings(props) {

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <CreateRoomPage 
                    update={true} 
                    votesToSkip={props.votesToSkip} 
                    guestCanPause={props.guestCanPause}  
                    roomCode={props.roomCode} 
                    updateCallback={props.updateCallback} />
            </Grid>
            <Grid item xs={12} align="center" >
                <Button variant="contained" color="secondary" onClick={() => props.setShowSettings(false)}>
                    Close
                </Button>
            </Grid>
        </Grid>
    );
}
