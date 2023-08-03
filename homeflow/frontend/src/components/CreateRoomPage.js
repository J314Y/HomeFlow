import React, { useState } from "react";
import { 
  Button,
  Collapse,
  Grid,
  FormHelperText,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";
import Alert from "@material-ui/lab/Alert";

export default function CreateRoomPage(props) {
  let navigate = useNavigate();

  const defaultVotes = 2;
  
  const [guestCanPause, setGuestCanPause] = props.guestCanPause !== undefined ? useState(props.guestCanPause) : useState("true");
  const [votesToSkip, setVotesToSkip] = props.votesToSkip !== undefined ? useState(props.votesToSkip) : useState(defaultVotes);
  const [responseMsg, setResponseMsg] = useState('');
  const [errorSeverity, setErrorSeverity] = useState("success");

  const handleGuestCanPauseChange = e => {
    setGuestCanPause(e.target.value);
  };

  const handleVotesToSkipChange = e => {
    setVotesToSkip(e.target.value);
  };

  const handleRoomButtonClicked = () => {
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        guest_can_pause: guestCanPause,
        votes_to_skip: votesToSkip
      }),
    };
    fetch("/api/create-room", requestOptions)
      .then((response) => response.json())
      .then((data) => navigate('/room/' + data.code));
  };

  const handleUpdateRoomButtonClicked = (props) => {

    const requestOptions = {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        guest_can_pause: guestCanPause,
        votes_to_skip: votesToSkip,
        code: props.roomCode,
      }),
    };
    fetch("/api/update-room", requestOptions)
      .then((response) =>  {
        if (response.ok) {
          setResponseMsg('Room Successfully Updated!');
          setErrorSeverity('success');
        }
        else {
          setResponseMsg('Error Updating');;
          setErrorSeverity('error');
        }
        props.updateCallback();
      });
  };

  const renderCreateRoomButtons = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button color="primary" variant="contained" onClick={handleRoomButtonClicked}>Create a Room</Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={Link}>Back</Button>
        </Grid>
      </Grid>
    );
  };

  const renderUpdateRoomButtons = (props) => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button color="primary" variant="contained" onClick={() => handleUpdateRoomButtonClicked(props)}> Update Room</Button>
        </Grid>
      </Grid>
    );
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Collapse in={responseMsg != ''} >
          <Alert severity={errorSeverity} onClose={() => { setResponseMsg('')}}>
            {responseMsg}
          </Alert>
        </Collapse>
      </Grid>

      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          { props.update ? 'Update a Room ' : 'Create a Room' }
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText>
            <div align="center"> Guest Control of Playback State </div>
          </FormHelperText>
          <RadioGroup row 
                defaultValue={props.guestCanPause !== undefined ? props.guestCanPause.toString() : guestCanPause} 
                onChange={handleGuestCanPauseChange}>
              <FormControlLabel value="true" control={<Radio color="primary" />} label="Play/Pause" labelPlacement="bottom" />
              <FormControlLabel value="false" control={<Radio color="secondary" />} label="No Control" labelPlacement="bottom" />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <TextField 
            required={true}
            type="number"
            defaultValue={props.votesToSkip ? props.votesToSkip : defaultVotes}
            onChange={handleVotesToSkipChange}
            inputProps={{min: 1, style: {textAlign: "center"}, }} > </TextField>
          <FormHelperText>
            <div align="center"> Votes Required to Skip Song </div>
          </FormHelperText>
        </FormControl>
      </Grid>
      { props.update ? renderUpdateRoomButtons(props) : renderCreateRoomButtons()}
    </Grid>
  );
}
