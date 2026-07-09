import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./Context/ThemeContext";
import Navbar from "./Components/NavBar";
import Home from "./Components/Home";
import EventsList from "./Components/EventsList";
import Login from "./Components/Login";
import AddEvent from "./Components/AddEvent";
import EditEvent from "./Components/EditEvent";
import ForgotPassword from "./Components/ForgotPassword"; // NEW
import ResetPassword from "./Components/ResetPassword"; // NEW
import api from "./api/api";
import type { UserDto } from "./Types/Index";
import "./styles/App.css";
import ConfirmEmail from "./Components/ConfirmEmail";

function App() {
  const [user, setUser] = useState<UserDto | null>(null);

  const fetchUser = async () => {
    try {
      const res = await api.get<UserDto>("/account/current-user");
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<EventsList />} />
          <Route path="/login" element={<Login onLoginSuccess={fetchUser} />} />
          <Route path="/add-event" element={<AddEvent />} />
          <Route path="/edit-event/:id" element={<EditEvent />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/confirm-email" element={<ConfirmEmail />} />{" "}
          {/* We'll create this component below */}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
