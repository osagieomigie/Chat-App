import React from "react";
import UserDashboard from "./userDashboard";
import Store from "./Store.js";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Store>
        <UserDashboard />
      </Store>
    </div>
  );
}

export default App;
