import React from "react";
import { render } from "react-dom";
import HomePage from "./HomePage";
import NavBar from "./NavBar";


export default function App() {

  return (
    <div> 
      <NavBar /> 
      <div className="homepage">
        <HomePage />
      </div>
    </div>
  );
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);