import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <>
      <Navbar />

      {/* Hero */}
      <div className="page-hero">
        <h1 className="page-hero-title">Contact Us</h1>
        <p className="page-hero-sub">We're here to help — reach out anytime</p>
      </div>

      <div className="container contact-container">
        <div className="contact-grid">

          {/* Left — Info + image */}
          <div className="contact-info">
            <div className="contact-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=600&q=80"
                alt="Contact"
                className="contact-img"
              />
            </div>

            <h2 className="section-heading">Get in Touch</h2>

            {[
              { icon: "📍", label: "Address", value: "12 Gandhi Salai, Chennai – 600001, Tamil Nadu" },
              { icon: "📞", label: "Phone",   value: "+91 88387 33196" },
              { icon: "✉️", label: "Email",   value: "support@busgo.in" },
              { icon: "🕐", label: "Hours",   value: "Mon–Sat, 9 AM – 6 PM" },
            ].map((item) => (
              <div key={item.label} className="contact-detail-row">
                <span className="contact-detail-icon">{item.icon}</span>
                <div>
                  <div className="contact-detail-label">{item.label}</div>
                  <div className="contact-detail-value">{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Right — Form */}
          <div className="card contact-form-card">
            {sent ? (
              <div className="contact-sent">
                <div className="contact-sent-icon">✅</div>
                <h3 className="contact-sent-title">Message Sent!</h3>
                <p className="contact-sent-sub">
                  Thanks for reaching out. We'll get back to you within 24 hours.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="contact-form-title">Send a Message</h3>

                <div className="form-group">
                  <label>Your Name</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" required />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@email.com" required />
                </div>

                <div className="form-group">
                  <label>Subject</label>
                  <input name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help?" required />
                </div>

                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Describe your issue or query..."
                    rows={5}
                    required
                    className="contact-textarea"
                  />
                </div>

                <button className="btn btn-primary btn-full" type="submit">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}