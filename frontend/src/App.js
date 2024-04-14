import React from "react";
import { BrowserRouter as Router, Route} from "react-router-dom";
import Home from "./pages/main"; // 你的Home的实际路径
import Login from "../src/pages/login/login";
import Rigester from './pages/login/rigester'

function App() {
  return (
    <div className="App">
        <Router>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/rigester" element={<Rigester />} />
        </Router>
    </div>
  );
}

export default App;
