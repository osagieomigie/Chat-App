import React from "react";
import UserDashboard from "./userDashboard";
import { CookiesProvider } from "react-cookie"; // cookies import
import "./App.css";

function App() {
  return (
    <div className="App">
      <CookiesProvider>
        <UserDashboard />
      </CookiesProvider>
    </div>
  );
}

export default App;
