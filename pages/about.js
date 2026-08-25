import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function About() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <div className="page-hero">
        <h1 className="page-hero-title">About RKBus</h1>
        <p className="page-hero-sub">
          Your trusted partner for hassle-free bus travel across India
        </p>
      </div>

      <div className="container about-container">

        {/* Who We Are */}
        <div className="about-section">
          <div className="about-text">
            <h2 className="section-heading">Who We Are</h2>
            <p className="section-para">
              BusGo is a modern bus ticket booking platform built to make intercity travel simple,
              affordable and reliable. We connect thousands of passengers with the best travel operators
              across Tamil Nadu and beyond — all from the comfort of your phone or laptop.
            </p>
            <p className="section-para">
              Founded in 2024, BusGo was born from a simple belief: booking a bus ticket should be
              as easy as sending a message.
            </p>
          </div>
          <div className="about-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80"
              alt="Bus travel"
              className="about-img"
            />
          </div>
        </div>

        {/* Our Mission */}
        <div className="about-section about-section-reverse">
          <div className="about-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=600&q=80"
              alt="Our mission"
              className="about-img"
            />
          </div>
          <div className="about-text">
            <h2 className="section-heading">Our Mission</h2>
            <p className="section-para">
              We aim to digitise bus travel for every Indian — making seat selection, booking and
              cancellation instant and transparent. No hidden fees. No long queues. Just travel.
            </p>
            <p className="section-para">
              We partner with trusted operators like KPN, SRS, VRL and Parveen Travels to bring you
              real-time seat availability and competitive fares.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="about-stats">
          {[
            { num: "10+", label: "Bus Operators" },
            { num: "50+", label: "Routes Covered" },
            { num: "1000+", label: "Happy Travellers" },
          ].map((s) => (
            <div key={s.label} className="about-stat-item">
              <div className="about-stat-num">{s.num}</div>
              <div className="about-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Team */}
        <h2 className="section-heading section-heading-center">Meet the Team</h2>
        <div className="team-grid">
          {[
            { name: "Veera Vignesh", role: "Founder & Developer", img: "https://randomuser.me/api/portraits/men/32.jpg" },
            { name: "Priya Rajan",   role: "UI/UX Designer",      img: "https://randomuser.me/api/portraits/women/44.jpg" },
            { name: "Arjun Kumar",   role: "Operations Lead",     img: "https://randomuser.me/api/portraits/men/56.jpg" },
          ].map((member) => (
            <div key={member.name} className="team-card card">
              <img src={member.img} alt={member.name} className="team-avatar" />
              <div className="team-name">{member.name}</div>
              <div className="team-role">{member.role}</div>
            </div>
          ))}
        </div>

      </div>

      <Footer />
    </>
  );
}