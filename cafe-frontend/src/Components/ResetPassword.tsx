import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../api/api";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract email and token from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email") || "";
  const token = queryParams.get("token") || "";

  useEffect(() => {
    if (!email || !token) {
      setMessage("Invalid or missing reset link.");
    }
  }, [email, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await api.post("/account/reset-password", {
        email,
        token,
        newPassword: password,
      });
      setMessage("Password reset successfully!");
      setIsSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (error: any) {
      setMessage(
        error.response?.data?.message ||
          "Failed to reset password. The link may have expired.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!email || !token) {
    return (
      <div
        className="container"
        style={{ maxWidth: "400px", marginTop: "60px" }}
      >
        <div
          style={{
            backgroundColor: "var(--bg-card)",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "var(--card-shadow)",
          }}
        >
          <h2 style={{ textAlign: "center", color: "red" }}>Invalid Link</h2>
          <p style={{ textAlign: "center" }}>
            The password reset link is missing or invalid.
          </p>
          <Link
            to="/login"
            style={{
              display: "block",
              textAlign: "center",
              marginTop: "20px",
              color: "var(--accent-color)",
            }}
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

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
          Set New Password
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            disabled={loading || isSuccess}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: isSuccess ? "#27ae60" : "var(--accent-color)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: isSuccess ? "default" : "pointer",
            }}
          >
            {loading
              ? "Resetting..."
              : isSuccess
                ? "✅ Success!"
                : "Reset Password"}
          </button>
        </form>

        {message && (
          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              borderRadius: "8px",
              backgroundColor: isSuccess ? "#d4edda" : "#f8d7da",
              color: isSuccess ? "#155724" : "#721c24",
              textAlign: "center",
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
