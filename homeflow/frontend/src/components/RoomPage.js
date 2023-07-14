import React, { useState } from "react";
import { useParams } from "react-router-dom";


function RoomPage() {
    const defaultGuestCanPause = true;
    const defaultVotes = 2;
    const defaultIsHost = false;

    const [guestCanPause, setGuestCanPause] = useState(defaultGuestCanPause);
    const [votesToSkip, setVotesToSkip] = useState(defaultVotes);
    const [isHost, setIsHost] = useState(defaultIsHost);
    const roomCode = useParams().roomCode

    const getRoomDetails = () => {
        fetch('/api/get-room' + '?code=' + roomCode)
            .then((response) => response.json())
            .then((data) => {
                setGuestCanPause(data.guest_can_pause);
                setVotesToSkip(data.votes_to_skip);
                setIsHost(data.is_host);
            });
    }

    getRoomDetails();

    return <div>
        <h3>{roomCode}</h3>
        <p> GuestCanPause: {guestCanPause.toString()} </p>
        <p> Votes: {votesToSkip} </p>
        <p> Is Host: {isHost.toString()} </p>
    </div>
}


export default RoomPage;

