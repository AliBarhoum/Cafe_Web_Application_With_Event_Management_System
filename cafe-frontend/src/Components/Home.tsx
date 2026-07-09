import React from "react";
import "../styles/Home.css";

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <div className="container">
        {/* Hero Section */}
        <section className="hero-section">
          <h1>
            Welcome to <span className="highlight">Cafe</span>
          </h1>
          <p>
            Your favorite place for great coffee, delicious pastries, and
            unforgettable events. Join us for an experience you won't forget!
          </p>
          {/* You can replace the image URL with your own */}
          <img
            src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600"
            alt="Cafe interior"
            className="hero-image"
          />
        </section>

        {/* Features Grid */}
        <div className="features-grid">
          <div className="feature-card">
            <div className="icon">☕</div>
            <h3>Premium Coffee</h3>
            <p>Locally sourced, freshly roasted beans for the perfect cup.</p>
          </div>

          <div className="feature-card">
            <div className="icon">🎉</div>
            <h3>Live Events</h3>
            <p>
              From jazz nights to poetry readings – there's always something
              happening.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon">🍰</div>
            <h3>Delicious Pastries</h3>
            <p>Baked fresh daily to complement your coffee perfectly.</p>
          </div>

          <div className="feature-card">
            <div className="icon">🌿</div>
            <h3>Cozy Atmosphere</h3>
            <p>
              Relax in our warm, inviting space – perfect for work or catching
              up.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
