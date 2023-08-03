import React, { useEffect, useState } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import RoomPage from "./RoomPage";
import { 
  Button, 
  ButtonGroup, 
  Grid, 
  Typography 
} from "@material-ui/core";
import {
  BrowserRouter as Router,
  Link,
  Navigate,
  useNavigate,
  Routes,
  Route,
} from "react-router-dom";


export default function AboutMePage() {

  return (
    <p> About me page</p>
  );
}
