import React, { useState } from "react";
import { Link } from "react-router-dom"; // ✅ NEW
import type { EventDto, UserDto } from "../Types/Index"; // ✅ NEW
// ✅ NEW
import "../styles/EventCard.css";

interface EventCardProps {
  event: EventDto;
  isRegistered: boolean;
  isLoggedIn: boolean;
  onRegister: (eventId: number) => void;
  onDelete: (eventId: number) => void; // ✅ NEW callback for delete
  user: UserDto | null; // ✅ NEW to check admin role
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  isRegistered,
  isLoggedIn,
  onRegister,
  onDelete,
  user,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const toggleExpand = () => setExpanded((prev) => !prev);

  const handleRegister = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoggedIn && !isRegistered) onRegister(event.id);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      onDelete(event.id);
    }
  };

  const isAdmin = user?.roles?.includes("Admin") ?? false;

  return (
    <div className="event-card" onClick={toggleExpand}>
      <img
        src={`https://picsum.photos/seed/${event.id}/400/200`}
        alt={event.title}
        className="event-card-image"
      />

      <div className="event-card-content">
        <h3 className="event-card-title">{event.title}</h3>
        <div className="event-card-date">
          📅{" "}
          {new Date(event.startDate).toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
        <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>
          {expanded ? "▲ Click to hide details" : "▼ Click for details"}
        </span>
      </div>

      <div className={`event-details ${expanded ? "expanded" : ""}`}>
        <p className="event-details-description">{event.description}</p>
        <div className="event-details-price">
          💰 ${event.price.toFixed(2)} per person
        </div>

        <button
          className={`register-btn ${isRegistered ? "registered" : ""}`}
          onClick={handleRegister}
          disabled={!isLoggedIn || isRegistered}
        >
          {isRegistered
            ? "✅ Registered"
            : isLoggedIn
              ? "Register Now"
              : "🔒 Login to Register"}
        </button>

        {/* ✅ NEW: Admin actions */}
        {isAdmin && (
          <div
            className="admin-actions"
            style={{ marginTop: "12px", display: "flex", gap: "8px" }}
          >
            <Link to={`/edit-event/${event.id}`}>
              <button className="btn-edit">✏️ Edit</button>
            </Link>
            <button className="btn-delete" onClick={handleDelete}>
              🗑️ Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
