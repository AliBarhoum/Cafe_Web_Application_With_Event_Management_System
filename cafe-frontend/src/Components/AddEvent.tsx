import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/AddEvent.css";

const AddEvent: React.FC = () => {
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [Price, setprice] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!title || !description || !startDate || !endDate) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      setError("End date must be after start date.");
      setLoading(false);
      return;
    }

    try {
      await api.post("/events", {
        title,
        description,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        Price,
      });
      // Success – redirect to events page
      navigate("/events");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-event-page">
      <div className="add-event-container">
        <h2>Create New Event</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Event Title *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g., Jazz Night"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              placeholder="Describe the event..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date & Time *</label>
              <input
                id="startDate"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endDate">End Date & Time *</label>
              <input
                id="endDate"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="price">Price (USD) *</label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={Price}
              onChange={(e) => setprice(Number(e.target.value))}
              required
              placeholder="e.g., 15.00"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate("/events")}
              className="btn-cancel"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;
