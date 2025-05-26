import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import LoginPage from "./pages/LoginPage";
import PanelAdmin from "./pages/PanelAdmin";
import LoginPage1 from "./pages/LoginPage1";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage1 />} />
        <Route path="/panel" element={<PanelAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
