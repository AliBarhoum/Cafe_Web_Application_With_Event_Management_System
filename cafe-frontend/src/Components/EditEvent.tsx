import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import "../styles/AddEvent.css"; // Reuse same styles

const EditEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [price, setPrice] = useState<number>(0);

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        const ev = res.data;
        setTitle(ev.title);
        setDescription(ev.description);
        // Convert ISO strings to datetime-local format
        setStartDate(new Date(ev.startDate).toISOString().slice(0, 16));
        setEndDate(new Date(ev.endDate).toISOString().slice(0, 16));
        setPrice(ev.price);
      } catch (err) {
        setError("Failed to load event.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    // Basic validation
    if (!title || !description || !startDate || !endDate) {
      setError("All fields are required.");
      setSubmitting(false);
      return;
    }
    if (price < 0) {
      setError("Price cannot be negative.");
      setSubmitting(false);
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      setError("End date must be after start date.");
      setSubmitting(false);
      return;
    }

    try {
      await api.put(`/events/${id}`, {
        title,
        description,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        price,
      });
      navigate("/events");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update event.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <div className="container text-center">Loading event...</div>;

  return (
    <div className="add-event-page">
      <div className="add-event-container">
        <h2>Edit Event</h2>
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
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
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
            <button type="submit" disabled={submitting} className="btn-submit">
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
