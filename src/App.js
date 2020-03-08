// import React from "react";
// import Welcome from "./welcome";
// import UserDashboard from "./userDashboard";
// //import Store from "./Store.js";
// import "./App.css";
// import { BrowserRouter as Router, Route } from "react-router-dom";

// function App() {
//   return (
//     <Router>
//       <Route path="/" exact component={Welcome} />
//       <Route path="/chat" component={UserDashboard} />
//     </Router>
//   );
// }

// export default App;

import React from "react";
import UserDashboard from "./userDashboard";
//import Store from "./Store.js";
import "./App.css";

function App() {
  return (
    <div className="App">
      <UserDashboard />
    </div>
  );
}

export default App;
