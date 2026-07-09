import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isRegistering) {
        await api.post("/account/register", {
          email,
          password,
          firstName,
          lastName,
        });
        alert("Registration successful! Please log in.");
        setIsRegistering(false);
        setPassword("");
      } else {
        const response = await api.post("/account/login", {
          email,
          password,
          rememberMe: false,
        });
        const token = response.data.token;
        if (token) {
          localStorage.setItem("token", token);
        }
        onLoginSuccess();
        navigate("/");
      }
    } catch (error: any) {
      alert(
        (isRegistering ? "Registration" : "Login") +
          " failed: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  return (
    <div className="container" style={{ maxWidth: "400px", marginTop: "60px" }}>
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "var(--card-shadow)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "24px" }}>
          {isRegistering ? "Create Account" : "Welcome Back"}
        </h2>

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-primary)",
                  color: "var(--text-primary)",
                }}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-primary)",
                  color: "var(--text-primary)",
                }}
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "12px",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              background: "var(--bg-primary)",
              color: "var(--text-primary)",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              background: "var(--bg-primary)",
              color: "var(--text-primary)",
            }}
          />
          <Link
            to="/forgot-password"
            style={{
              display: "block",
              textAlign: "right",
              marginBottom: "20px",
              color: "var(--accent-color)",
              fontSize: "14px",
            }}
          >
            Forgot Password?
          </Link>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "var(--accent-color)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {isRegistering ? "Register" : "Login"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setPassword("");
            }}
            style={{
              background: "none",
              border: "none",
              color: "var(--accent-color)",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            {isRegistering
              ? "Already have an account? Login"
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
