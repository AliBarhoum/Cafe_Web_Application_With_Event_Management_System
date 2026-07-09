import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api/api";

const ConfirmEmail: React.FC = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get("userId");
    const token = queryParams.get("token");

    if (!userId || !token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    const confirmEmail = async () => {
      try {
        await api.get(
          `/account/confirm-email?userId=${userId}&token=${encodeURIComponent(token)}`,
        );
        setStatus("success");
        setMessage("Email verified successfully! You can now log in.");
      } catch (error: any) {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Failed to verify email. The link may have expired.",
        );
      }
    };

    confirmEmail();
  }, [location]);

  return (
    <div className="container" style={{ maxWidth: "400px", marginTop: "60px" }}>
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "var(--card-shadow)",
          textAlign: "center",
        }}
      >
        {status === "loading" && <h2>⏳ Verifying your email...</h2>}
        {status === "success" && (
          <>
            <h2 style={{ color: "#27ae60" }}>✅ {message}</h2>
            <Link
              to="/login"
              style={{
                display: "inline-block",
                marginTop: "20px",
                padding: "10px 24px",
                backgroundColor: "var(--accent-color)",
                color: "white",
                borderRadius: "8px",
                textDecoration: "none",
              }}
            >
              Go to Login
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <h2 style={{ color: "#e74c3c" }}>❌ {message}</h2>
            <Link
              to="/login"
              style={{
                display: "inline-block",
                marginTop: "20px",
                color: "var(--accent-color)",
                textDecoration: "none",
              }}
            >
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmEmail;
