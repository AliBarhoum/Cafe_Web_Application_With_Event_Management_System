import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // ✅ For admin "Add New Event" button
import api from "../api/api";
import EventCard from "./EventCard";
import type { EventDto, UserDto } from "../Types/Index";
import "../styles/EventCard.css";

const EventsList: React.FC = () => {
  // ---------- State ----------
  const [events, setEvents] = useState<EventDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserDto | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<Set<number>>(
    new Set(),
  );

  // ---------- Fetch current user ----------
  const fetchUser = async () => {
    try {
      const res = await api.get<UserDto>("/account/current-user");
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  // ---------- Fetch all events and registration status ----------
  const fetchEvents = async () => {
    try {
      const res = await api.get<EventDto[]>("/events");
      setEvents(res.data);

      if (user) {
        const regStatuses = await Promise.all(
          res.data.map(async (ev) => {
            try {
              const regRes = await api.get<boolean>(
                `/events/${ev.id}/registered`,
              );
              return { id: ev.id, registered: regRes.data };
            } catch {
              return { id: ev.id, registered: false };
            }
          }),
        );
        const registeredSet = new Set(
          regStatuses.filter((r) => r.registered).map((r) => r.id),
        );
        setRegisteredEvents(registeredSet);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Lifecycle ----------
  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user !== undefined) {
      fetchEvents();
    }
  }, [user]);

  // ---------- Handlers ----------
  const handleRegister = async (eventId: number) => {
    try {
      await api.post(`/events/${eventId}/register`);
      setRegisteredEvents((prev) => new Set(prev).add(eventId));
    } catch (error: any) {
      alert(
        "Registration failed: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  // ✅ NEW: Delete handler – removes event from state after successful API call
  const handleDelete = async (eventId: number) => {
    try {
      await api.delete(`/events/${eventId}`);
      // Remove from events list
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      // Remove from registered set if present (just in case)
      setRegisteredEvents((prev) => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
    } catch (error: any) {
      alert(
        "Failed to delete event: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  // ---------- Render ----------
  if (loading) {
    return <div className="container text-center">Loading events...</div>;
  }

  // --- Case 1: No events ---
  if (events.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="icon">🎭</div>
          <h2>No Events at the moment</h2>
          <p>
            Please check back later for new and exciting events at our cafe!
          </p>
          {/* Admin-only Add button */}
          {user && user.roles.includes("Admin") && (
            <Link to="/add-event">
              <button className="btn-add-event" style={{ marginTop: "20px" }}>
                Add New Event
              </button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  // --- Case 2: Events exist ---
  return (
    <div className="container">
      <h2 className="text-center mb-2">🎉 Upcoming Events</h2>

      {/* Admin-only Add button at top right */}
      {user && user.roles.includes("Admin") && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "20px",
          }}
        >
          <Link to="/add-event">
            <button className="btn-add-event">+ Add New Event</button>
          </Link>
        </div>
      )}

      <div className="events-grid">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            isRegistered={registeredEvents.has(event.id)}
            isLoggedIn={user !== null}
            onRegister={handleRegister}
            onDelete={handleDelete} // ✅ Pass delete handler
            user={user} // ✅ Pass user for admin checks
          />
        ))}
      </div>
    </div>
  );
};

export default EventsList;
