import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post("/account/forgot-password", { email });
      setMessage(
        "If your email exists, you will receive a reset link shortly.",
      );
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
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
          Forgot Password
        </h2>
        <p
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "var(--text-muted)",
          }}
        >
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <button
            type="submit"
            disabled={loading}
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
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              borderRadius: "8px",
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-primary)",
              textAlign: "center",
            }}
          >
            {message}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <Link
            to="/login"
            style={{ color: "var(--accent-color)", textDecoration: "none" }}
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
