import React from "react";
import Login from "../src/pages/login/login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/main"; // 这里替换为你Home的实际路径

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
